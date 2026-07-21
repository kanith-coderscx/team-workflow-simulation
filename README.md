# team-workflow-simulation

A simulation of the team's issue-driven development process (**Process v2**), run end-to-end
by four AI personas — **BA/SA, Dev, PM, QA** — building a small **expense/income tracker**
(บันทึกรายรับ-รายจ่าย).

The point is not the app; it's to exercise every stage and gate of the workflow on real
GitHub infrastructure (issues, a Projects v2 board, branches, PRs, GitHub Pages as the test
server) and produce auditable evidence that the process was followed.

- **Process being simulated:** see [`agent-develop-workflow/docs/team-workflow.md`](https://github.com/) (the source contract).
- **The app:** a static single-page app (vanilla HTML/CSS/JS + `localStorage`, no build step),
  served from GitHub Pages.
- **Default branch:** `develop`. Features branch off it as `feature/<issue#>-<slug>` and land via
  squash-merge after BA/SA acceptance.

## Roles

| Persona | Owns | Never does |
|---------|------|-----------|
| **BA/SA** | specs, issues, priority, AC testing, acceptance (approve), closing issues | write code, merge |
| **Dev** | app code, branches, plans, deploy, PRs, the merge click | tick AC boxes, approve own work |
| **PM** | the board, day digests, the retro | write specs/code, cross gates |
| **QA** | gate audits (`docs/learn/qa-audit.md`) | write code/specs, tick boxes, approve |

## Where things live (per Process v2 §2)

```
app/                       the expense/income tracker (SPA)
docs/
├── data-model/            data shapes (this app: localStorage schema)
├── feature/<slug>/        design/ · spec/ · plan/  — one folder per feature
├── ops/                   deploy convention + simulation shims log
└── learn/                 per-issue captures, QA audit, weekly retro
```

## Simulation caveats

One GitHub account plays all four personas, so a few native mechanics are impossible to do
literally (self-approving a PR, requesting review from yourself). Those are replaced by
explicit, logged conventions — see [`docs/ops/simulation-shims.md`](docs/ops/simulation-shims.md).
Every shim is called out so the simulation never pretends a convention is the real mechanism.
