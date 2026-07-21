# Process findings (real frictions surfaced by the simulation)

Genuine gaps between Process v2 as written and how GitHub actually behaves. Each is
evidence for the weekly retro (stage ⑧).

## F-01 — "Create a branch from issue" auto-closes the issue on merge, breaking "Done = verified, not merged"

- **Severity:** high — it defeats a core, deliberately-designed gate.
- **What happened (issue #1):** Stage ③ says to create the branch with GitHub's *"Create a branch"* button on the issue (here: `gh issue develop`). That creates a **Development link** between issue and PR. Process v2 also mandates PRs use `Refs #123`, never `Closes`, *specifically so the merge does not close the issue* — closing is BA/SA's job after verifying on `develop` (stage ⑦). But the Development link **auto-closed #1 at 09:00:06Z, two seconds after the PR merged at 09:00:04Z**, before BA/SA verified. Timeline evidence: `closed | reason=COMPLETED | commit=None` immediately after the `merged` event.
- **Why it matters:** the `Refs`-not-`Closes` rule is defeated by the linked-branch behaviour. The "merge ≠ Done" property — which QA insisted on ("equating merged with Done makes the board lie") — is not actually enforced. A PR that merges but then fails BA/SA's develop verification would leave a *closed* issue for broken code, and re-opening is a manual catch.
- **This run:** BA/SA's develop verify passed anyway, so nothing broken shipped — but that was luck, not the gate.
- **Fix applied mid-run (from #2 onward):** create the branch with plain `git` (`git branch feature/<n>-slug develop`) instead of `gh issue develop`, so there is **no Development link** and the merge leaves the issue open for BA/SA to close after verifying. Linkage to the issue is still provided by `Refs #n` in the PR. Logged as deviation D-01 in `ops/simulation-shims.md`.
- **For the real team to decide (retro):** either (a) don't use the "Create a branch" button — lose one-click linkage, keep the gate; or (b) keep the button and accept that "close" happens at merge, then make stage ⑦ a *re-open-if-fails* verification rather than a *close-after-verify* one. (a) preserves the design intent; (b) weakens it. Recommend (a).
