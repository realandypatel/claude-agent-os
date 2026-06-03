# Loop Customer — 40,000-Lead Cold Outreach Plan

> Scraped/purchased list → verified, segmented, throttled cold email with hard
> kill-switches. Channel: email only (cold SMS = TCPA exposure, excluded).
> Rules inherited from the business engine: human approves every campaign,
> no fabricated claims, opt-outs are forever, value in every touch.

---

## 0. The math (set expectations first)

| Metric | Conservative | Good |
|---|---|---|
| Deliverable after verification | ~30,000 (75%) | ~34,000 (85%) |
| Open rate | 40% | 60% |
| Reply rate | 1% | 4% |
| Conversations | ~300 | ~1,300 |
| Demos/signups (25% of replies) | ~75 | ~325 |

Full first-touch coverage takes **~5–8 weeks** at safe throughput. That is the
correct speed — faster = blacklisted.

---

## Phase 0 — List hygiene (week 0, BEFORE anything sends)

1. **Verify every address** (ZeroBounce / NeverBounce / MillionVerifier, ~$100–200
   for 40k). Keep only `valid`. Drop `catch-all` into a separate low-priority
   tranche; delete `invalid`, `disposable`, `role@` (info@, sales@ — low reply, high complaint).
   **Hard rule: never send to an unverified address.**
2. **Geography screen:** exclude EU/UK (GDPR — scraped B2B is defensible in some
   regimes but not worth it) and Canada (CASL requires consent). US-only first run.
3. **Suppression list:** seed with existing Loop customers, active trials, and any
   prior unsubscribes. This list only ever grows; it is checked before every send.
4. **Segment** (drives copy + priority):
   - **S1 — Core ICP** 〔FILL: e.g. cafés, salons, barbershops, food trucks — repeat-visit merchants〕
   - **S2 — Adjacent** 〔FILL: e.g. gyms, pet groomers, car washes〕
   - **S3 — Catch-all / weak data** → last, smallest daily volume.
5. **Import to Twenty** (system of record): Companies + People with fields
   `segment`, `source=scraped-2026`, `verify_status`, `sequence_stage`, `last_touch`.

## Phase 1 — Sending infrastructure (week 0–1)

- **Buy 3 lookalike domains** (e.g. `getloopcustomer.com`, `looprewardsapp.com`,
  `tryloopcustomer.com`). **NEVER cold-send from the production domain** — one
  complaint wave poisons transactional deliverability (receipts, magic links).
- **3 mailboxes per domain = 9 senders** (e.g. andy@, team@, hello@). Real names,
  real signatures, real photo.
- **DNS on every domain:** SPF + DKIM + DMARC (`p=quarantine`), custom return-path,
  and forward the lookalikes' root → real site.
- **Warm up 14–21 days** (automated warmup network) before any real send.
- **Sending tool:** use a cold-email platform with rotation + warmup + per-inbox
  throttling (Smartlead / Instantly class, ~$40–100/mo). This is the one place the
  "$0 tools" bias loses to ROI — warmup networks and bounce-handling are not worth
  self-building. (Self-host alternative if insisted: Mautic + SES — more ops, worse
  warmup.)

## Phase 2 — Ramp schedule + kill-switches

| Week | Per mailbox/day | Fleet/day | Cumulative reached |
|---|---|---|---|
| 1–2 (warmup) | 0 real | 0 | 0 |
| 3 | 20 | ~180 | ~900 |
| 4 | 40 | ~360 | ~2,700 |
| 5 | 75 | ~675 | ~6,000 |
| 6+ | 100–150 | ~1,000–1,350 | ~5–6.5k/wk |

**Kill-switches (automated, checked daily):**
- Bounce rate >3% on any mailbox → pause mailbox, re-verify tranche.
- Spam-complaint rate >0.1% → pause segment, rewrite copy.
- Open rate <25% for 3 days → deliverability problem, stop ramp, test placement
  (GlockApps/mail-tester) before resuming.
- Domain on a blocklist → retire domain, never reuse.

## Phase 3 — The sequence (4 touches, 16 days, exit on reply/click/opt-out)

> Personalization tokens from the scraped data: `{{first_name}}`, `{{business}}`,
> `{{category}}`, `{{city}}`. Every email: plain text, 1 idea, 1 CTA, unsubscribe
> link + physical address in footer (CAN-SPAM). No images, no links in touch 1
> (deliverability). **Claims marked 〔FILL〕 must be real before sending — no
> invented stats (honesty guard).**

**E1 — Day 0 · the problem**
> Subject: `punch cards at {{business}}?`
>
> Hi {{first_name}} — quick question about {{business}}.
>
> Most {{category}} owners we talk to in {{city}} still run paper punch cards —
> and about half of them get lost in pockets and washing machines.
>
> Loop turns them into digital stamp cards customers keep on their phone. Set up
> takes about 10 minutes, no hardware, no app for customers to download.
>
> Worth a look? Happy to send a 90-second video of how it works at a shop like yours.
>
> — Andy, Loop Customer

**E2 — Day 3 · proof**
> Subject: `re: punch cards at {{business}}`
>
> One quick number: 〔FILL: REAL merchant result, e.g. "X Coffee in Austin saw
> repeat visits up Y% in 60 days" — only if true and provable〕.
>
> The mechanics are simple: customers scan once, stamps land in their phone
> wallet, and {{business}} gets a dashboard of who's coming back and who's gone
> quiet.
>
> Want me to set up a free demo card for {{business}} so you can see your own
> branding on it? Takes me 5 minutes.

**E3 — Day 8 · different angle (the lapsed-customer hook)**
> Subject: `the customers who stopped coming`
>
> {{first_name}} — the expensive problem isn't new customers, it's the regulars
> who quietly stop showing up.
>
> Loop flags them automatically ("haven't visited in 30 days") so you can win
> them back with one tap 〔FILL: confirm exact feature naming against WEBSITE.md
> claims ledger〕.
>
> If that's a problem you feel at {{business}}, I'll show you exactly how it works.

**E4 — Day 16 · breakup**
> Subject: `closing the loop`
>
> Haven't heard back, so I'll assume loyalty isn't a priority for {{business}}
> right now — totally fair.
>
> If that changes, here's the link to set up a card whenever: 〔FILL: signup URL〕.
> I won't email again.

**website-keeper check before launch:** every claim in E1–E4 audited against
`docs/WEBSITE.md` (terminology: "stamps", never "points"; no false free-trial claims).

## Phase 4 — Reply ops (where the money actually is)

- All replies land in a unified inbox → logged to **Twenty** (stage: `replied`).
- `sales-agent` drafts responses (human sends). Target: first response <4 business hours.
- `sales-followup-agent` owns: no-reply-after-positive (3-day bump), demo no-shows,
  stale `replied` >7 days. Exit conditions enforced.
- Opt-outs → suppression list same day. Angry replies → suppress, never argue.
- Weekly `pm-agent` review: sends, bounce %, complaint %, replies, demos, and
  kill-switch status. 🟢/🟡/🔴.

## Compliance checklist (gate before first send)

- [ ] List verified; invalid/disposable/role purged
- [ ] EU/UK/Canada excluded; suppression list loaded
- [ ] Unsubscribe link working + honored instantly (tool-enforced)
- [ ] Physical mailing address in footer
- [ ] Subject lines truthful; sender identity real
- [ ] All copy claims verified real (no fabricated stats/customers)
- [ ] Lookalike domains only; production domain untouched
- [ ] Kill-switch thresholds configured in the sending tool

## Budget (monthly, steady state)

| Item | Cost |
|---|---|
| Verification (one-time) | ~$150 |
| 3 domains | ~$30/yr |
| 9 mailboxes (Google/MS) | ~$54/mo |
| Sending platform | ~$50–100/mo |
| Twenty (self-host VPS) | ~$20–40/mo |
| **Total** | **~$130–200/mo + $180 one-time** |

---

*Status: plan DONE. Pending human: domain purchase, verification run, 〔FILL〕 proof
points, and explicit GO on the first 500-lead pilot batch (S1 only) before any ramp.*
