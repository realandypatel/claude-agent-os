# DATA LIFECYCLE — PII map, retention, deletion rights (R18)

## 1. Data map  〔FILL per project — keep current; memory-agent audits it〕

| Store / table | PII fields | Source | Lawful basis / purpose | Retention |
|---|---|---|---|---|
| crm_leads | name, email, phone, business, city/state | scraped (US-only) | B2B outreach | purge if untouched 〔FILL: e.g. 12 mo〕 |
| crm_suppressions | email | opt-outs/bounces/complaints | compliance | **FOREVER — never delete** |
| 〔FILL: product tables〕 | | | | |

## 2. Retention policy

- **Scraped leads:** untouched (no reply, no activity) after 〔FILL: N months〕 → purge.
  Stale scraped PII is liability, not asset.
- **Suppression list:** append-only, kept forever (it IS the compliance record).
- **Customer/product data:** per ToS 〔FILL〕; deleted accounts purged within 〔FILL: 30d〕.
- **Backups:** purged data ages out of backups within the backup retention window
  (document the window in RESILIENCE §1).

## 3. Deletion-request runbook (CCPA applies to California residents in any US list)

1. Verify the requester controls the email/identity in question.
2. Locate all records via the data map (§1) — leads, activities, product tables, logs.
3. Delete/anonymize within the statutory window (CCPA: 45 days). **Exception:** the
   email stays on `crm_suppressions` — suppression is retention *for* the person's
   benefit and required to honor the request durably.
4. Log the request + completion (date, scope) in a deletions ledger 〔FILL: location〕.
5. Confirm to the requester. No dark patterns, no friction.

## 4. Standing rules

- No PII in logs, alerts, METRICS.jsonl, INSTINCTS, or CHANGELOG (audit refs by id, not
  by name/email).
- New table with PII → must be added to §1 in the same round (Iron Law #2: both sides).
- Exports of PII (CSV send batches) are deleted after import to the sending platform.
