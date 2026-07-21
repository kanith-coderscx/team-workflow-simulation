# Deploy convention (the test server)

**[PM]** — In Process v2, a dev must deploy their branch to a shared test server and fill the
PR's "Deployed to:" field before requesting review (stage ④). This repo uses **GitHub Pages**
as that shared test server.

## How it works

- Pages serves the **`gh-pages`** branch at
  `https://kanith-coderscx.github.io/team-workflow-simulation/`.
- Each PR is deployed to its own subfolder so testing is isolated per issue:

  ```
  gh-pages/
  ├── pr-1/      # deployment of feature branch for issue #1
  ├── pr-2/
  ├── pr-3/
  └── develop/   # integration deployment built from develop (used at stage ⑦)
  ```

- **Per-PR URL:** `https://kanith-coderscx.github.io/team-workflow-simulation/pr-<issue#>/`
- **Integration URL (stage ⑦):** `https://kanith-coderscx.github.io/team-workflow-simulation/develop/`

## Dev deploy steps (stage ④)

1. Finish the feature on `feature/<issue#>-<slug>`.
2. Copy `app/*` into `gh-pages` under `pr-<issue#>/`, commit, push.
3. Confirm the URL returns HTTP 200 before filling "Deployed to:".
4. Put `Deployed to: <url> (branch @ commit)` in the PR body — an empty value means "not ready".

## Integration deploy (stage ⑦, after merge)

After a squash-merge into `develop`, refresh `gh-pages/develop/` from `app/*` on `develop` so
BA/SA can verify the integrated result before closing the issue.

> This is a **simulation shim** for a real shared test server — logged in
> [`simulation-shims.md`](./simulation-shims.md).
