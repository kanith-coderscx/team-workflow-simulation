# PM daily digest

**[PM]** — one short digest per simulation day: what moved, what's stuck. A digest, not
per-event spam. It reports where *work* is, never who is "fast" or "slow".

## Day 1 (จันทร์ 2026-07-20)

- **Board stood up:** Backlog / Ready / In Progress / In Review / Done. `develop` is default; "PR merged → Done" is intentionally NOT used (Done = BA/SA closes the issue).
- **Filed:** #1 add-transaction (p1), #2 history-list (p2), #3 monthly-summary (p2) — all via the feature form fields, all DoR-complete (QA confirmed).
- **Prioritized into Ready** (BA/SA decision, top→bottom): **#1 → #2 → #3**. #1 is the foundation (defines the localStorage schema #2 and #3 depend on), so it's top of Ready.
- **Stuck:** nothing yet. Dev picks up #1 next (Day 2).
- **Shims active:** S3 (PM performs card moves), S5 (issues filed via `gh`). See `ops/simulation-shims.md`.
