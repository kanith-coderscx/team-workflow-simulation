# Simulation shims log

**[PM]** — One GitHub account (`kanith-coderscx`) plays all four personas, and there is no real
shared test server. Some mechanics of Process v2 therefore cannot be performed literally. Each
is replaced by an explicit convention below. **A shim is never presented as the real mechanism.**

## Standing shims

| # | Real mechanism | Why impossible here | Shim used |
|---|----------------|---------------------|-----------|
| S1 | Dev *requests review from BA/SA* → the single ready-to-test signal | Can't request review from yourself | PR opens as **draft**; Dev marking it **"Ready for review"** + a comment `[Dev] 🙏 ขอ review — Deployed to: <url>` is the ready signal |
| S2 | BA/SA *approves* the PR (GitHub blocks self-approval) | Author can't approve own PR | A PR review of type **COMMENT** whose body starts `[BA/SA] ✅ APPROVE`, **plus** the label `basa-approved`. Dev may squash-merge only when both exist |
| S3 | Built-in Project workflows auto-move cards | Built-ins act on multi-actor events that don't fire for one account | PM moves the card via `gh project item-edit`, logging each move `[auto-shim]`, only on the exact trigger event Process v2 defines |
| S4 | Deploy branch to a shared test server | No server provisioned | Deploy to GitHub Pages under `pr-<issue#>/` — see [`deploy.md`](./deploy.md) |
| S5 | Issue **forms** (`.github/ISSUE_TEMPLATE/*.yml`) render only in the web UI | `gh issue create` doesn't render forms | BA/SA files issues with `gh issue create --body-file`, reproducing the feature form's field headings verbatim |
| S6 | BA/SA browser-tests as a non-technical user | The persona is an AI | BA/SA fetches the live Pages URL and reads the *served* HTML/JS behavior to judge each AC; it never clones, runs, or reviews the source to decide pass/fail |

## Shim-use log (append as they occur)

| Date (sim) | Shim | Where (issue/PR) | Note |
|------------|------|------------------|------|
| Day 1 | S3 | board setup | PM owns all card moves for the run |
| Day 1 | S5 | #1, #2, #3 | issues filed via `gh issue create`, form fields reproduced |
