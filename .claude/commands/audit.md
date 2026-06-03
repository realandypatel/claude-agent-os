---
description: Parallel multi-lens audit of a surface (correctness, security, perf, prod-readiness).
---

# /audit — parallel review sweep

For the surface named in the argument (or the current diff):

1. Spawn in ONE batch (concurrent): **code-review-agent** (correctness), **security-agent**
   (attack surface), **performance-agent** (bottlenecks, read-only pass), and **qa-agent**
   (production-readiness).
2. Triage the combined findings: dedupe, then sort BUG/HIGH/CRITICAL first.
3. Present one consolidated table with `file:line` + fix per finding and an overall verdict
   (ship / fix-first). Do not fix here — route fixes to the owning specialist.
