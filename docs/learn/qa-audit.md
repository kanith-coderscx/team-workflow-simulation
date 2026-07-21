# QA gate audit log

**[QA]** — One row per gate crossing. I audit four gates and nothing else:

1. **DoR** — an issue may enter *Ready* only with spec link + AC checklist + test steps.
2. **Ready-signal integrity** — when a PR leaves draft: is "Deployed to:" filled and the URL live?
3. **Evidence quality** (stage ⑤) — is each AC judged with actual-vs-expected + environment + commit,
   and ticked by BA/SA (never the producer)?
4. **merged ≠ Done** (⑥→⑦) — nothing reaches *Done* on merge; only BA/SA's issue-close does.

A ticked box without evidence is self-certification, not proof. There is exactly one
ready-for-test signal and it lives on the PR, never in a chat-style ping.

| Sim day | Gate | Issue/PR | Verdict | Finding |
|---------|------|----------|---------|---------|
| Day 1 | DoR | #1 | ✅ PASS | spec link ✓, AC checklist (7, all "เมื่อ…→…" form) ✓, test steps (9) ✓. Eligible for Ready. |
| Day 1 | DoR | #2 | ✅ PASS | spec link ✓, AC checklist (7) ✓, test steps (8) ✓. Eligible for Ready. |
| Day 1 | DoR | #3 | ✅ PASS | spec link ✓, AC checklist (7) ✓, test steps (8) ✓. Eligible for Ready. |
| Day 1 | DoR-note | all | ℹ️ note | Every AC is browser-observable and several pin exact on-screen copy text — good testability, but that means wording drift will (correctly) fail testing. Flagged for Dev awareness. |
| Day 2 | ready-signal | #1/PR#4 | ✅ PASS | Left draft with "Deployed to" filled; URL `pr-1/` returned HTTP 200. Single ready signal, on the PR. |
| Day 2 | evidence | #1/PR#4 | ✅ PASS | BA/SA ticked all 7 ACs with actual-vs-expected from a **real browser**, recorded environment (`pr-1/`) + commit (c80b8cd) + date. Dev did NOT tick. Dev's 6 fail-closed UNVERIFIED items were resolved by BA/SA, not assumed. |
| Day 2 | **merged ≠ Done** | #1/PR#4 | 🔴 **FAIL — violation** | Issue #1 **auto-closed at 09:00:06, 2s after merge (09:00:04)**, BEFORE BA/SA verified on develop. Cause: the branch made by `gh issue develop` ("Create a branch from issue", stage ③) creates a Development link that auto-closes the issue on merge — defeating the `Refs`-not-`Closes` safeguard. The "Done = verified, not merged" gate was bypassed by the machine. Verify passed post-hoc so no bad code shipped **this time**, but the gate is not enforced. See `findings.md` F-01. |
