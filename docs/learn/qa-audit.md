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
| _(entries appended during the run)_ | | | | |
