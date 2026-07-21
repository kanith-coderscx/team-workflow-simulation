# Weekly retro — Week 1 (สัปดาห์แรก)

**[PM] facilitator.** Aggregated from per-issue captures (`captures.md`), the QA audit (`qa-audit.md`), findings (`findings.md`), and develop history.

## What shipped

| Issue | Result | Review rounds | Bounces | Notes |
|-------|--------|:-------------:|:-------:|-------|
| #1 add-transaction | Done | 1 | 0 | clean; surfaced F-01 |
| #2 history-list | Done | 1 | 0 | clean; inline confirm; surfaced list-sync backlog |
| #3 monthly-summary | Done | 2 | 1 | AC1/AC6 spec gap (F-02) caught in test |

Throughput: 3/3 accepted. This measures where **work** flowed, not who was fast.

## What worked

- **The board never lied.** Every "Done" corresponds to a BA/SA issue-close after a develop verify — not a merge. After adopting D-01, "merge ≠ Done" held on #2 and #3.
- **Human evidence gate held.** All ACs were ticked by BA/SA from a real browser with environment + commit recorded; Dev never self-certified. Dev's fail-closed UNVERIFIED items (6, 7, 7) were all resolved by the tester, never assumed.
- **The rework loop worked as designed.** #3's AC1 failure flowed back through Request Changes with a written repro, not a chat ping, and only merged after re-verification.

## The one decision we got wrong (mandatory line)

**Using GitHub's "Create a branch from issue" (`gh issue develop`) on #1.** It quietly created a Development link that auto-closed the issue on merge, *before* BA/SA verified on develop — defeating the whole "Done = verified, not merged" design (F-01). We only noticed because the close happened 2 seconds after merge. Correct call would have been to script branch creation with plain `git` from the start. Fixed as D-01 from #2 on.

## Friction watchlist (escalate if a line recurs ≥3 weeks → fix root cause, not another workaround)

| Friction | Seen | Action |
|----------|------|--------|
| Linked-branch auto-close vs. "close after verify" (F-01) | Week 1 (#1) | D-01 adopted (plain-git branches). Watch that no one reintroduces `gh issue develop`. |
| Overlapping/unreconciled ACs (F-02) | Week 1 (#3) | Add spec-template check: define "on open" behaviour when the default dataset is empty. |
| Cross-section UI state not synced (add-list vs history) | Week 1 (#2) | Backlog chore; not yet worth a fix. Revisit if users report it. |

## Actions for next week

1. Add the two spec-template / setup guardrails above (owners: BA/SA for the AC checklist; Dev for keeping branch creation on plain git).
2. File the list-sync backlog chore as a `type:chore` issue when it next matters.
3. Keep `Refs`, keep the draft→ready signal, keep BA/SA-closes-after-verify.
