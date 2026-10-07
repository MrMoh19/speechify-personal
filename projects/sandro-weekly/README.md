# Sandro Weekly — system of record

The weekly update for Dean Galea. `rows.json` is the single source of truth; `weekly.js` renders it to the docx in his table format (Active manuscripts / On hold / Teaching and Mentorship / Projects / Training).

Heading reads "Weekly Updates — Week of [Monday] – [Friday], [year]" (changed from "Meeting Agenda with Dean Galea — [date]" on Mohammed's word, Oct 7). `title_date` still just holds the Friday compile date and the automation still bumps it the same way each week — `weekly.js` derives the Monday-to-Friday week range from it for display only.

"Teaching and Mentorship" (added Oct 7, same `{name, update, next}` shape as Projects) sits between On hold and Projects.

Cadence (both routines fire into the standing Claude session):
- **Friday ~12:37 PM CT — question round.** Claude verifies every row against the week's email evidence, updates what it can prove, then emails Mohammed a short numbered questionnaire covering only the rows it could not verify. Mohammed replies in any form ("3: sent to co-authors; 7: no change").
- **Friday ~5:23 PM CT — compile and deliver, unfailingly.** Claude folds in the replies (or carries rows unchanged if no reply arrived), bumps title_date, commits rows.json, renders the update as a Google Doc in Drive (HTML upload, converts with tables intact), and emails Mohammed the link plus a short paste-ready cover note for Sandro. The send never waits on the questionnaire: no replies means rows ship marked unchanged.

Rules:
- Excluded from the Sandro update for now (tracked elsewhere): ANCHOR-MH Nigeria, PLOS Mental Health editor queue, N-MIND.
- Moves between Active and On hold only happen on Mohammed's word.
- Never send at an on-the-minute time.
