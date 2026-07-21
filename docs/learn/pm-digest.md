# PM daily digest

**[PM]** — one short digest per simulation day: what moved, what's stuck. A digest, not
per-event spam. It reports where *work* is, never who is "fast" or "slow".

## Day 1 (จันทร์ 2026-07-20)

- **Board stood up:** Backlog / Ready / In Progress / In Review / Done. `develop` is default; "PR merged → Done" is intentionally NOT used (Done = BA/SA closes the issue).
- **Filed:** #1 add-transaction (p1), #2 history-list (p2), #3 monthly-summary (p2) — all via the feature form fields, all DoR-complete (QA confirmed).
- **Prioritized into Ready** (BA/SA decision, top→bottom): **#1 → #2 → #3**. #1 is the foundation (defines the localStorage schema #2 and #3 depend on), so it's top of Ready.
- **Stuck:** nothing yet. Dev picks up #1 next (Day 2).
- **Shims active:** S3 (PM performs card moves), S5 (issues filed via `gh`). See `ops/simulation-shims.md`.

## Day 2 (อังคาร 2026-07-21)

- **#1 add-transaction shipped end-to-end:** In Progress → PR #4 (draft → ready) → BA/SA browser-tested all 7 AC PASS → approved → squash-merged → verified on develop → **Done**.
- **Cycle:** 1 review round, 0 bounces. Dev flagged 6 fail-closed UNVERIFIED items (no browser in dev env); BA/SA confirmed all 6 on a real browser.
- **🔴 Real finding F-01:** the "Create a branch from issue" link auto-closed #1 at merge, *before* BA/SA's develop verify — the "merge ≠ Done" gate was bypassed by GitHub. Fix adopted from #2: create branches with plain `git` (no Development link). See `learn/findings.md`.
- **Stuck:** none. #2 history-list is next (top of Ready).

## Day 3 (พุธ 2026-07-22)

- **#2 history-list shipped end-to-end** → Done. 1 review round, 0 bounces. Inline delete-confirm (no native dialog), sort/persist/empty-state all verified on a real browser.
- **F-01 fix (D-01) proven:** the plain-git branch left #2 **open** at merge; BA/SA closed it after verifying on develop. "merge ≠ Done" now actually holds.
- **Backlog surfaced:** #1 add-list vs #2 history-list don't sync on delete until reload — logged, not blocking (correct scoping by BA/SA).
- **Stuck:** none. #3 monthly-summary (last of Ready) is next.
