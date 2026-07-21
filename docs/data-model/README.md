# Data model

**[BA/SA]** — This app has no server DB; state lives in the browser's `localStorage`.
The shared shape used by every feature is defined here so features stay consistent.

## `localStorage` key: `tws.transactions`

A JSON array of transaction objects:

| field    | type   | notes                                             |
|----------|--------|---------------------------------------------------|
| `id`     | string | unique id (timestamp-based)                       |
| `type`   | string | `"income"` \| `"expense"`                         |
| `amount` | number | > 0, in THB                                       |
| `category` | string | e.g. อาหาร, เดินทาง, เงินเดือน                    |
| `date`   | string | ISO `YYYY-MM-DD`                                   |
| `note`   | string | optional memo                                     |

Defined at issue #1 (add transaction); consumed by #2 (history) and #3 (monthly summary).
