# SPEC — Built-in CRM Module for the Loop Admin (Lead Engine)

> **Hand this file to Claude Code in the product repo.** Save it as `docs/CRM_SPEC.md`,
> commit it, and reference it from `AGENTS.md` → "Pending". Work proceeds round-by-round
> per the operating law.
>
> **Operating instructions for Claude Code (read first):**
> 1. Read `AGENTS.md` (the operating law) before anything. All Iron Laws apply —
>    especially: no schema migration without showing SQL + explicit GO; minimal diffs;
>    never claim DONE without evidence; stage files by name; never force-push main.
> 2. Route work through the swarm: `architect-agent` (Phase 0 review) → `backend-agent`
>    (data + actions) → `ui-agent` (admin screens) → `unit-test-agent` →
>    `code-review-agent` + `security-agent` in parallel → `build-agent` gate → push to
>    `main` (auto-deploy) → verify in prod → `memory-agent` appends CHANGELOG round.
> 3. One phase per round. No scope creep. 〔FILL〕 marks values only the human can supply.

---

## 1. Problem & goal

We have **~40,000 scraped USA leads** (merchants) reachable via an external API, and an
outreach program (see `docs/OUTREACH-PLAN-40K.md`). We need a **CRM module inside the
existing admin** so leads, segments, suppression, pipeline stages, and follow-ups live in
our own database next to our product data — instead of a separate self-hosted CRM.

**Goals:** ingest leads from the leads API (USA-only), verify/segment them, export send
batches to the cold-email platform, capture replies/opt-outs via webhook, and run a
pipeline (new → contacted → replied → demo → won/lost) the sales agents can operate.

**Non-goals (v1):** sending email from our own infrastructure (the external sending
platform does that); cold SMS (TCPA — excluded); customer-facing anything; multi-seat
permissions beyond existing admin auth; building a generic CRM platform.

---

## 2. Configuration (env vars — names only, never commit values)

```
LEADS_API_URL            # 〔FILL: the scraped-leads API endpoint〕
LEADS_API_KEY            # 〔FILL: auth for that API, if any〕
OUTREACH_WEBHOOK_SECRET  # shared secret for inbound events from the sending platform
```

---

## 3. Data model (migrations — idempotent, RLS ON, show SQL + get GO before applying)

```sql
-- migrations/NNN_crm_leads.sql
create table if not exists crm_leads (
  id              uuid primary key default gen_random_uuid(),
  external_id     text unique,            -- id from the leads API (dedup key)
  business_name   text not null,
  first_name      text,
  last_name       text,
  email           text,
  email_status    text not null default 'unverified',
    -- unverified | valid | invalid | catch_all | disposable | role
  phone           text,
  category        text,                   -- café, salon, gym...
  city            text,
  state           text,                   -- 2-letter; REQUIRED: USA only
  country         text not null default 'US',
  segment         text not null default 'S3',   -- S1 core ICP | S2 adjacent | S3 weak
  stage           text not null default 'new',
    -- new | queued | contacted | replied | demo | won | lost | suppressed
  source          text not null default 'scraped-2026',
  next_step_at    timestamptz,
  last_touch_at   timestamptz,
  owner           text,                   -- admin user handle
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists crm_leads_stage_idx   on crm_leads (stage);
create index if not exists crm_leads_segment_idx on crm_leads (segment, email_status);

create table if not exists crm_activities (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references crm_leads(id) on delete cascade,
  kind        text not null,  -- note | email_out | email_reply | call | demo | stage_change | import
  body        text,
  meta        jsonb,
  actor       text not null,  -- admin handle or 'system'
  created_at  timestamptz not null default now()
);
create index if not exists crm_activities_lead_idx on crm_activities (lead_id, created_at desc);

create table if not exists crm_suppressions (
  email       text primary key,
  reason      text not null,   -- unsubscribe | complaint | bounce | customer | manual
  created_at  timestamptz not null default now()
);   -- append-only. NEVER delete rows. Checked before every export.

create table if not exists crm_sync_state (
  source      text primary key,           -- 'leads-api'
  watermark   text,                       -- cursor/updated_since from the API
  last_run_at timestamptz,
  last_error  text
);
```

RLS: admin-only policies on all four tables (match the existing admin tables' pattern —
never `USING (true)`). Every state change writes a `crm_activities` row (audit doctrine).

---

## 4. Lead ingestion (the API sync)

`lib/actions/crm/sync-leads.ts` + a cron route (follow the existing cron pattern with
watermark + burst guard):

1. Pull from `LEADS_API_URL` paginated, using `crm_sync_state.watermark`
   (webhook-first/polling-fallback doctrine — this source is pull-only, so cron poll,
   default every 6h, manual "Sync now" button in admin).
2. **USA filter (hard):** drop any record where country ≠ US / state not a valid US
   2-letter code. Log dropped count — no silent truncation.
3. **Normalize + dedup** on `external_id`, then on lowercased email. Upsert; never
   overwrite a lead whose stage ≠ `new` (protect worked leads — metadata is truth).
4. **Auto-screen:** mark `role` emails (info@, sales@…) and obvious disposables;
   anything on `crm_suppressions` → stage `suppressed` immediately.
5. Segment heuristic: map `category` → S1/S2/S3 〔FILL: category lists from
   OUTREACH-PLAN §Phase 0〕.
6. Record run in `crm_sync_state`; on failure `void reportError("crm-sync", err, …)`.
7. **Iron Law #2 check:** the import is not DONE until both sides are verified — API
   count vs rows upserted reconcile (report the delta).

Verification (email validity) happens at the external verifier; import its result CSV
via an admin upload that updates `email_status` in bulk (v1 = CSV upload, not API).

---

## 5. Export & webhook (the sending-platform bridge)

- **Export send batch** (`lib/actions/crm/export-batch.ts`): select N leads by
  segment + `email_status='valid'` + stage `new` → CSV download for the sending
  platform → mark exported leads stage `queued`, write activities. **Pre-flight check
  before export** (Iron-Law-#2 guard): every exported email re-checked against
  `crm_suppressions`; cap N at the daily fleet limit from the outreach plan.
- **Inbound webhook** `app/api/crm/outreach-events/route.ts`: receives
  `reply | open | bounce | complaint | unsubscribe` from the sending platform.
  **Verify `OUTREACH_WEBHOOK_SECRET` signature BEFORE processing** (security doctrine).
  Effects: reply → stage `replied` + activity + next_step_at=now; bounce/complaint/
  unsubscribe → suppression row + stage `suppressed`. Rate-limit the route.

---

## 6. Admin UI (ui-agent — Brand Kit rules, canonical CTA class, phone-responsive)

New admin section **"Leads"** (route group inside the existing admin shell):

1. **Pipeline board/list** — filter by stage/segment/state; columns: business, contact,
   segment, stage, last touch, next step. Bulk actions: change segment, suppress, export
   batch. Loading/empty/error states mandatory.
2. **Lead detail drawer** — fields + full activity timeline + note composer + stage
   buttons + "next step" date picker. Never surface raw DB errors.
3. **Sync panel** — last sync, watermark, dropped-row counts, "Sync now", error state.
4. **Suppression page** — search, manual add, reason badges. No delete button (append-only).
5. **Dashboard tiles** — leads by stage, replies this week, suppression count,
   kill-switch stats from webhook events (bounce % / complaint % vs thresholds in
   `docs/OUTREACH-PLAN-40K.md` — surface 🔴 when breached).

## 7. Agent wiring (the business engine operates this)

- `sales-agent`: reads `replied` leads → drafts responses (human sends), logs activity.
- `sales-followup-agent`: daily pass — `replied` with no next_step, next_step overdue,
  demo no-shows → proposes touches + CRM hygiene updates. **Never auto-sends.**
- `pm-agent`: weekly report from the dashboard metrics (sends, bounce %, complaint %,
  replies, demos, stage conversion) with 🟢/🟡/🔴.

---

## 8. Phases (one round each, in order)

| Round | Scope | Owner | Exit evidence |
|---|---|---|---|
| R-CRM.1 | Migrations + RLS (after GO) + seed suppressions from existing customers | backend-agent | tables live; RLS policy test passes |
| R-CRM.2 | Sync action + cron + USA filter + dedup | backend-agent | sync run reconciles counts vs API; dropped-row log |
| R-CRM.3 | Verification CSV upload + segment mapping | backend-agent | statuses updated in bulk on sample file |
| R-CRM.4 | Export batch + suppression pre-flight + webhook route | backend-agent | webhook signature test; export blocked for suppressed email (unit test) |
| R-CRM.5 | Admin UI (list, detail, sync panel, suppression, tiles) | ui-agent | screenshots, all states, phone check |
| R-CRM.6 | Tests + reviews + gate + deploy + prod verify | unit-test/security/code-review/build agents | gate GREEN; prod route fetch evidence |

## 9. Acceptance criteria (DONE only with evidence)

- [ ] Import of a 1,000-lead API page completes; counts reconcile; non-US rows dropped & logged
- [ ] A suppressed email can never be exported (unit test proves it)
- [ ] Webhook rejects bad signatures (test); reply event moves stage + writes activity
- [ ] Every stage change has an audit activity row
- [ ] RLS verified: non-admin principal gets zero rows
- [ ] Gate (typecheck → lint → test → build) GREEN; deployed; prod verified with a fetch
- [ ] `docs/CHANGELOG.md` updated per round; AGENTS.md folder map updated

## 10. Security checklist (security-agent blocks on any miss)

Ownership/admin check on every mutation · webhook signature before processing ·
suppressions append-only · no raw errors to UI · `LEADS_API_KEY` server-only, never
logged · rate limit on the webhook route · no lead PII in logs or alerts.

---
*Pending human: 〔FILL〕 the env values, the S1/S2 category list, and GO on migrations.*
