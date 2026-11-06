# Sandro Weekly — system of record

The weekly update for Dean Galea. `rows.json` is the single source of truth; `render.py` fills it into `template.docx`, which is the 9 October update exactly as Mohammed sent it (landscape Letter, Garamond 12, grey header rows; embedded fonts stripped to keep it small). Section order: Active manuscripts / Teaching and Mentorship / Projects / Training / On hold.

Render: `python3 render.py "Weekly updates_<DD>_<Mon>_26.docx"`. If Mohammed changes the layout again, drop his sent file in as `template.docx` (strip `word/fonts/`) and the renderer follows it.

Heading reads "Weekly Updates — Week of [Monday] – [Friday], [year]" (changed from "Meeting Agenda with Dean Galea — [date]" on Mohammed's word, Oct 7). `title_date` still just holds the Friday compile date and the automation still bumps it the same way each week — `render.py` derives the Monday-to-Friday week range from it for display only.

"Teaching and Mentorship" (added Oct 7, same `{name, update, next}` shape as Projects) sits between On hold and Projects.

Cadence (both routines fire into the standing Claude session):
- **Friday ~12:37 PM CT — question round.** Claude verifies every row against the week's email evidence, updates what it can prove, then emails Mohammed a short numbered questionnaire covering only the rows it could not verify. Mohammed replies in any form ("3: sent to co-authors; 7: no change").
- **Friday ~5:23 PM CT — compile and deliver, unfailingly.** Claude folds in the replies (or carries rows unchanged if no reply arrived), bumps title_date, commits rows.json, renders the docx, sends it to Mohammed in the Claude chat, and emails him what changed plus a paste-ready cover note for Sandro. (The Google Doc copy was dropped Oct 18: the HTML route can't carry his layout.) The send never waits on the questionnaire: no replies means rows ship marked unchanged.

Rules:
- Excluded from the Sandro update for now (tracked elsewhere): ANCHOR-MH Nigeria, PLOS Mental Health editor queue, N-MIND.
- Moves between Active and On hold only happen on Mohammed's word.
- Never send at an on-the-minute time.
