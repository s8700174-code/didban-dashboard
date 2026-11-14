# Validation record

Date: 2026-11-14. Environment: Node.js on Windows and the connected Chromium-based in-app browser.

## Automated

`npm run check` passed. `npm test` passed all six tests: reconciliation, period selection, composed project filters, empty values, CSV escaping/formula neutralization, and fixture bounds.

## Observed browser checks

- Full-period totals: revenue 4,443; cost 2,598; illustrative profit 1,845; target 4,590 (million toman).
- Shahrivar + sales: revenue 311; cost 166; profit 145; target 300; attainment 103.7%. Chart, unit share, project table and attention cards updated together.
- Project details showed DB-102's 260 budget, 218 spent, 58% progress and its milestone list.
- Bookmark action changed the control to remove and added a star to the project list.
- Searching `NO MATCH` produced the explicit empty state. Searching `DB-102` with risk status produced one result.
- Actual CSV download contained only the selected DB-102 project and correct budget/spent/progress values.
- Report navigation displayed six monthly rows and aggregate totals consistent with the KPI cards.
- At a 390×844 viewport override, content width and document scroll width were both 375 pixels (remaining width reserved for scrollbar); no page-level horizontal overflow. Wide report tables remained within their scroll container.
- Light dashboard and dark report were visually inspected. Screenshots are included in this directory.

Print styling is implemented but physical print/PDF output has not been validated. No formal accessibility audit, real-device test matrix, backend, security certification or production-load test is claimed.
