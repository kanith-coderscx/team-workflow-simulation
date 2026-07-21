# Process v2 simulation — final report

**What was simulated:** four AI personas (BA/SA, Dev, PM, QA) building a small expense/income
tracker end-to-end through the team's Process v2, on real GitHub infrastructure.

- **Repo:** https://github.com/kanith-coderscx/team-workflow-simulation
- **Board (Projects v2):** https://github.com/users/kanith-coderscx/projects/1
- **Test server (GitHub Pages):** https://kanith-coderscx.github.io/team-workflow-simulation/
- **Outcome:** 3 issues shipped and accepted (all Done). 1 genuine rework loop. 2 process findings. 1 deviation adopted.

| Issue | Feature | PR | Review rounds | Result |
|-------|---------|----|:-------------:|--------|
| [#1](https://github.com/kanith-coderscx/team-workflow-simulation/issues/1) | add-transaction | [#4](https://github.com/kanith-coderscx/team-workflow-simulation/pull/4) | 1 | Done |
| [#2](https://github.com/kanith-coderscx/team-workflow-simulation/issues/2) | history-list | [#5](https://github.com/kanith-coderscx/team-workflow-simulation/pull/5) | 1 | Done |
| [#3](https://github.com/kanith-coderscx/team-workflow-simulation/issues/3) | monthly-summary | [#6](https://github.com/kanith-coderscx/team-workflow-simulation/pull/6) | 2 (1 bounce) | Done |

## Did the process hold? The six invariants vs. evidence

1. **Definition of Ready — no issue without spec link + AC + test steps.**
   ✅ All three issues were filed with the feature-form fields (summary, spec link, AC checklist, test steps). Specs committed to develop first (`docs/feature/*/spec/`). QA confirmed DoR on all three before any entered Ready (`qa-audit.md`, Day 1).

2. **Priority is a human decision (only BA/SA drags Backlog→Ready).**
   ✅ All three cards entered Backlog automatically, then BA/SA prioritized #1→#2→#3 into Ready (foundation first). No automation moved work into Ready (`pm-digest.md`, Day 1).

3. **Exactly one "ready to test" signal, on the PR.**
   ✅ Each PR opened as **draft**, then Dev marked it ready + posted `[Dev] 🙏 ขอ review — Deployed to: <url>` with the Pages URL live (HTTP 200 checked each time). No chat-thread handoffs. (Shim S1 stands in for self-review-request; logged.)

4. **Evidence comes from the acceptor — AC boxes ticked by BA/SA only.**
   ✅ Every AC was ticked by BA/SA from a **real Chrome browser**, with environment + commit + date recorded on the PR. Dev never ticked. Dev's fail-closed UNVERIFIED items (6/7/7 across the three) were all resolved by the tester, never assumed passed.

5. **Done = verified, not merged.**
   ⚠️→✅ PRs used `Refs`, never `Closes`. **But finding F-01:** on #1 the "Create a branch from issue" Development link auto-closed the issue at merge, *before* BA/SA verified — the gate was bypassed by GitHub (closed 2s after merge). Fixed as **D-01** (plain-git branches); on #2 and #3 the issue stayed **OPEN** at merge and BA/SA closed it only after verifying on develop. Gate enforced from #2 onward.

6. **No merge before BA/SA approve.**
   ✅ Merge was gated on the `basa-approved` label + `[BA/SA] ✅ APPROVE` (shim S2). #3 was **not** approved on round 1 (Request Changes) and was not merged until round 2 after the AC1 fix. No unapproved code ever merged.

## The rework loop (genuine, not staged)

Issue #3, round 1: BA/SA browser-tested and **failed AC1** — opening the summary on the current month when it has no data hid the totals labels «รายรับรวม/รายจ่ายรวม/คงเหลือ». Root cause: AC1 (labels on open) and AC6 (empty-month message) were unreconciled in the spec (**F-02**). Request Changes → card back to In Progress → Dev fixed (always render labels at 0.00 + keep the empty note) → round 2 re-verified → approved → merged. This is stage ⑤ doing exactly its job.

## Simulation shims used (never presented as the real mechanism)

S1 draft→ready = review request · S2 comment+label = approval · S3 PM performs board moves · S4 Pages `pr-N/` = test server · S5 `gh issue create` reproduces the issue form · S6 browser testing by an AI. Deviation **D-01**: plain-git branches instead of "Create a branch from issue". Full log: `docs/ops/simulation-shims.md`.

## Observations (where the process helped or hurt)

1. **The human evidence gate is the process's backbone** — it caught F-02, which a checkbox-or-self-certify process would have shipped.
2. **A recommended step (stage ③ "Create a branch from issue") actively broke a core invariant (F-01).** Two well-intentioned rules collided; only real execution exposed it. The team should decide explicitly (retro recommends: keep plain-git branches).
3. **"Deployed to" as the single gate worked** — but depended on a real, reachable URL. GitHub Pages' ~30–60s rebuild + 10-min asset cache meant testers must hard-reload; a real shared server should send no-cache headers for test builds.
4. **Fail-closed reporting paid off** — Dev honestly marked browser-only ACs UNVERIFIED rather than guessing, so BA/SA knew exactly what still needed a human.
5. **One-account simulation can't exercise native review-request/approval** — the shims are faithful in spirit, but a real two-person run is needed to test notification routing and branch-protection enforcement (Phase 2/3 of Process v2).

## Artifacts to browse

Board · issues #1–3 (closed, with test evidence + verify comments) · PRs #4–6 (bodies + BA/SA test comments; #6 shows the fail→fix→pass loop) · `docs/learn/{qa-audit,findings,captures,retro-week-1}.md` · `docs/ops/{deploy,simulation-shims}.md`.
