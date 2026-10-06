# Activity signals, 6 October 2026: not applied

Signals are **indicators**. They show hiring, planning, permit, grid or procurement activity linked to a project. On their own they don't prove permission, funding, a secured grid connection, construction or capacity, and they never change a Reality Score automatically.

`tracker-signals-linkedin-2026-10-06.sql` creates the `dc_project_signals` table and adds 18 draft (admin-only) signals. The event date and the source publication date are stored separately, and each signal is marked as a primary or secondary source.

## Signals added

| Type | Project | Reference | Source | Link to tracker |
|---|---|---|---|---|
| Job post | CloudHQ LHR campus, Didcot | – | LinkedIn | `cloudhq-lhr-didcot` (PR #3 draft) |
| Job post | Radiant, East London AI site | – | LinkedIn | Candidate |
| Job post | Verda, Liverpool/Wirral | – | LinkedIn | Candidate |
| Job post | Skanska Slough data centre MEP project | – | LinkedIn | Candidate |
| Job post | Wates, two Yorkshire data centre refurbishments | – | LinkedIn | Candidate |
| Job post | Groq, Slough | – | LinkedIn | Candidate |
| Environmental permit | Amazon Ridgeway, Iver | EPR/TP3621MM/A001 | Environment Agency (primary) | Candidate |
| Grid / power | Thames Valley Park | 262274 Utilities Statement | Wokingham planning file (primary) | `thames-valley-park-earley` (PR #3 draft) |
| Planning application | Thames Valley Park | 262274 | Wokingham register (primary) | `thames-valley-park-earley` |
| Planning application | Chapelcross, Annan | 26/1649/PIP | Planning Geek (secondary) | Candidate |
| Planning application | Manor Farm West, Poyle | P/21160/000 | Developer site (secondary) | Candidate (not linked to Manor Farm) |
| Pre-application | Fawley Waterside | – | Developer site (secondary) | Candidate |
| Planning application | Cambois Phase 2, two data centre buildings | 26/03028/REM | Northumberland register (primary) | `cambois-data-centre-campus` |
| Grid / power | Cambois temporary 60kV substation | 26/02919/FUL | Northumberland register (primary) | `cambois-data-centre-campus` |
| Planning application | 14MW data centre, Stanford-le-Hope | 26/01013/OUT | Thurrock register (primary) | Candidate |
| Planning application | Tilbury data centre and ecology park (EIA required) | 26/00894/SCO | Thurrock register (primary) | Candidate |
| Pre-application | Charlton Riverside, Greenwich | – | BBC (secondary) | Candidate |
| Planning application | Melbourn data centre and heat network | 26/03387/FUL | South Cambs Online (secondary) | Candidate |

## Most material finding

The Utilities Statement for Thames Valley Park says the 60MVA grid supply needed (from Reading Primary) **won't be available until 2037**. Until then the site would run on 49.9MW of gas-fired fuel cells, with a 100MW peak gas supply from the high-pressure main. With fuel cells and grid together, the IT load would be about 72MW. Keep these figures separate.

## Sources checked with nothing material found

- **Find a Tender:** all 450 notices from 3 to 6 October checked; no data centre notices.
- **Contracts Finder:** no data centre notices for 3 to 6 October.
- **Public Contracts Scotland:** the only match was an Ayrshire College data-platform consultancy, which isn't a data centre.
- **Companies House:** new companies with "data centre" or "compute" in the name are small shells with no link to any project.
- **Contractors:** no new UK data centre contract awards from 1 to 6 October.
- **Equinix investor news:** no UK release.
- **Redcentric:** the sale of its data centre business completed in April 2026, so it isn't new.
- **Nscale Loughton:** the grid delay was already in the 3 October research.

## Not reachable

- The Buckinghamshire, Slough, Spelthorne, Hertsmere, Three Rivers and Newham portals: connections refused or timed out.
- The Dumfries and Galloway portal: bot check.
- Indeed: bot check.
- Sell2Wales: no results.

## Order to apply

1. Apply PR #3 drafts.
2. Run this SQL.
3. Re-run STEP 3 to link the signals.
4. Publish signals one at a time in the admin.
