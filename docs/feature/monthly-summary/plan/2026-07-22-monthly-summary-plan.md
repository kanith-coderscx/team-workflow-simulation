# Plan: สรุปยอดรายเดือน (monthly-summary) — issue #3

- **branch:** `feature/3-monthly-summary`
- **spec:** `docs/feature/monthly-summary/spec/2026-07-20-monthly-summary-spec.md`
- **author (Dev):** implement stage ④
- **date:** 2026-07-22

## 1. Goal

Fill the `#summary-section` placeholder with a read-only monthly summary that reads
the same `localStorage` key `tws.transactions` written by #1 and listed by #2. Pick a
month → show total income / total expense / balance + a per-category breakdown for that
month. Never mutate storage; do not touch `#add-section` (#1) or `#history-section` (#2).

## 2. Approach & key decisions

- **Own IIFE appended to `app.js`** (3rd block), mirroring how #1 and #2 are structured.
  Storage/format helpers are duplicated locally to match the established convention
  ("kept in its own IIFE so it does not touch the other issues' merged code").
- **Month picker = native `<input type="month">`**, value format is exactly `YYYY-MM`.
  Default value set to the **local** current month. This is the single biggest
  timezone-bug guard: the picker hands us a `YYYY-MM` string directly — no `Date`
  parsing anywhere in the filter path.
- **Month filtering off the ISO date STRING**: `tx.date.slice(0, 7) === selectedMonth`.
  No `new Date(tx.date)`, so no UTC off-by-one at month boundaries (the classic pitfall).
- **Recompute-always (no stale values)**: a single pure `summarize(list, month)` computes
  everything from scratch on each `render()`. `render()` reads `loadTransactions()` fresh
  and reads the picker's current value each call. No computed totals are cached at module
  scope, so switching months (July → Jan → July) can never show a previous month's values.
- **Category ↔ total reconciliation (guaranteed, not coincidental)**: build
  `incomeByCat` / `expenseByCat` maps first, then derive `totalIncome` / `totalExpense`
  by summing those maps. Totals are therefore *by construction* equal to the sum of the
  displayed categories — they cannot drift apart regardless of float addition order.
- **Negative balance**: `formatBaht()` emits an explicit leading `-` for negatives
  (`'-' + formatAmount(abs) + ' ฿'`) instead of relying on a locale minus glyph, so the
  AC "must clearly show a minus sign when expense > income" holds unambiguously.
- **Empty month**: per the scope note ("show empty state, NOT an ambiguous 0 / blank"),
  when the selected month has zero transactions we render **only** «ไม่มีรายการในเดือนนี้»
  and suppress the totals card. The three labels «รายรับรวม»/«รายจ่ายรวม»/«คงเหลือ»
  render whenever the month has data (which, in the acceptance test, the default current
  month July 2026 does). See §5 for the AC1/AC6 reconciliation note.
- **Live refresh after an add** (additive, mirrors #2): a `submit` listener on `#add-form`
  re-renders the summary via `setTimeout(…, 0)` inside a try/catch. This does not modify
  `#add-section`; it just keeps the summary current so test step 6 ("view July again"
  after adding) reflects the new value without a manual reselect/reload.
- **On-screen copy as constants** (`MSG`) to match the spec character-for-character:
  «รายรับรวม», «รายจ่ายรวม», «คงเหลือ», «ไม่มีรายการในเดือนนี้».
- **No native dialogs** (read-only view; nothing to confirm anyway).

## 3. Files to change (only under `app/` + this plan)

- `app/index.html` — replace the `#summary-section` placeholder with the month picker
  (`<input type="month" id="summary-month">` + label) and an empty `#summary-body`.
- `app/styles.css` — add a `/* --- monthly-summary feature (issue #3) --- */` block
  (totals grid, stat cards, breakdown groups) reusing existing CSS tokens.
- `app/app.js` — append the 3rd IIFE (compute + render + wiring). Includes a
  `typeof module !== 'undefined'` guarded `module.exports` so the pure compute functions
  can be unit-tested in Node (inert in the browser — `module` is undefined there).

## 4. Self-review + self-QA (fail-closed)

- `node --check app/app.js` — static syntax check.
- Node unit test of the **real** `summarize` / `monthOf` / `formatBaht` / `currentMonthISO`
  (loaded via the guarded export, with a `document` stub) against the spec numbers:
  July 2026 → income 20000, expense 2000, balance 18000; category reconciliation; the
  +25000 case → balance −7000 (leading `-`); empty January; and repeated July calls
  returning identical fresh results (proves no caching in the compute layer).
- Browser-only ACs (rendering, picker default, click-to-switch recompute, empty-state on
  screen) **cannot be executed here (no browser)** → reported **UNVERIFIED with reason**,
  never "passed". Logic is exercised by the Node test where possible.

## 5. AC1 vs AC6 reconciliation (documented decision)

AC1 asks that the three labels show on open; AC6 + the scope note require that an empty
month shows the empty-state message and **not** an ambiguous 0. These only conflict when
the default current month is itself empty. Decision: labels render with the totals card
whenever the month has data; an empty month shows only «ไม่มีรายการในเดือนนี้». The
concrete test steps add July 2026 data before opening, so the labels are present on open
as AC1 requires, while empty months honour the scope note.
