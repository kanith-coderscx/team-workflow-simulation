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
