# Token policy

How Claude spends tokens on Mohammed's work. Written 2026-09-18 after measuring a full
working session. The ledger (`daily/tasks.md`) stays the source of truth for *what* is due;
this file governs *how* the work gets done.

## The finding that drives everything

Searching costs an order of magnitude more than reading or writing. In the session that
produced this file, drafting three finished emails cost about 3k tokens. Hunting for one
file across Drive and Box cost 25-30k and returned the wrong paper twice. Composition is
cheap. Looking for things is not.

## Standing rules

**1. Sweeps are scoped to the WUSTL label.** The query is
`label:Label_3 -category:promotions -category:social newer_than:1d` (2d on Monday, to cover
the weekend). Mohammed's word, 2026-09-18. This cuts a sweep from roughly 7k to roughly 3k
by dropping Redfin, UFC, newsletters and retail mail that carry no label.

  *The blind spot this creates:* mail sent straight to abbaaji189@gmail.com never gets
  Label_3, because the label marks Outlook-forwarded WUSTL mail. Anything genuinely personal
  or from a collaborator writing to the Gmail address falls outside the sweep. The Sunday
  sweep therefore adds one cheap second pass, `-label:Label_3 -category:promotions
  -category:social is:unread newer_than:7d`, metadata view only, to catch what the week missed.

**2. Never search for a file that can be named.** A Drive file ID or link costs about 0.5k
and goes straight to the content; a search for the same file costs 4-8k per attempt and can
miss. When a fact needs a document Claude does not have, the move is to bracket the fact and
ask for the link, not to go hunting. Search Drive only when nobody knows where the thing is.

**3. Read threads at the lowest useful fidelity.** `MINIMAL` to see what a thread is;
`PLAIN_TEXT` only when the body actually has to be read. Long threads repeat their whole
quoted history in every reply, so a four-message chain can cost 6k to read in full.

**4. No artifacts, renders or builds unless Mohammed asks.** An HTML morning brief costs more
than the entire rest of the brief put together. Text in an email carries the same information.

**5. Load the voice skills once per session, not once per draft.** abba-aji-voice plus the
cadence profile plus jswm-writing-style run about 5k together. That is a fair price once and
a waste three times.

**6. Batch independent calls into one turn.** Two searches that do not depend on each other
go out together.

**7. Placeholders beat archaeology.** A `[bracketed placeholder]` costs nothing and Mohammed
fills it in seconds. Reconstructing the same fact from mail and Drive costs thousands and can
still be wrong.

## Per-run budgets

These are targets, not hard caps. A run that will clearly exceed its budget should say so and
ask rather than quietly spend.

| Run | Budget | Notes |
|---|---:|---|
| Evening sweep (lean) | 12k | One scoped search, at most 3-4 thread reads |
| Morning brief, text only | 15k | Artifact only on request |
| Sandro Friday question round | 30k | Verify what the week's mail already proves; ask about the rest |
| Sandro Friday compile and deliver | 20k | rows.json is cheap; the Doc render is not |
| Ad hoc drafting (emails, replies) | 5k | Skills already loaded |
| Ledger edit, commit, push | 2k | |

## What never gets economized

- **The Friday compile ships regardless.** Unfailing means unfailing; if the budget and the
  send conflict, the send wins.
- **Deadlines, names, numbers and addresses get verified against the source.** A cheap wrong
  date costs more than an expensive right one.
- **Anything Mohammed asked for directly.** Token-saver governs Claude's own initiative, not
  his instructions.

## Measured reference costs

From the 2026-09-18 session, for planning:

| Action | ≈ Tokens |
|---|---:|
| Broad unscoped Gmail sweep, 40 threads | 7k |
| Scoped Label_3 sweep | ~3k |
| One short thread, full text | 1-2k |
| One long thread with quoted history | 6k |
| Drive search with snippets | 4-8k |
| Drive doc read, tables included | 8-12k |
| Read by known file ID | 0.5k + document |
| Three paste-ready email drafts | 3k |
| Voice skills, both, once | 5k |

## Review

Revisit when the ISTSS and revision crunch clears (after 2026-10-08), or whenever a routine
starts missing things the sweep should have caught.
