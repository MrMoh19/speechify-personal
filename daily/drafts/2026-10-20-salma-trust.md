# Salma Abdalla — trust analysis (paste-ready for Outlook)

**To:** s.abdalla@wustl.edu
**Subject:** What are we measuring when we measure trust?

Source: trust-measurement-study repo, branch claude/phase3-track-a (Phase 3 executive summary, Oct 19). Discovery-sample results only; the 44 holdout countries are untouched.

Suggested attachments: figures/polychoric_pooled_vs_within.png, figures/per_country_loadings_discovery.png, and a short brief of the findings (the Phase 3 executive summary is too technical to send as is).

---

Hi Salma,

I know we have talked through a few analyses, and I have not sent you any of them yet, so I am taking the initiative with this one.

Trust is a question I had thought about before, but I engaged with it more deeply after listening to your presentation comparing India with the other countries. I used the Wellcome Global Monitor 2026 (Gallup World Poll, 143,620 respondents in 140 countries) and asked what the trust items are actually measuring. I worked on 96 countries and held the other 44 back for a confirmatory test later. The analysis draws on methods I have been using lately: exploratory and confirmatory factor analysis to identify the latent constructs, and machine learning style prediction, leaving out one country at a time, to test whether those constructs carry information into countries the model has never seen.

A few early findings:

- The six core trust items form two closely related dimensions, the two science-worded items and the items naming people (scientists, doctors and nurses, and others), correlated at about 0.86. Trust in health information from the internet sits apart from both.
- The items behave similarly across gender, age, education and survey mode, but their response thresholds shift across countries and regions. Associations within countries hold up; direct comparisons of mean trust scores between countries do not, which bears on comparisons like the ones in your talk.
- Trust adds predictive information for views on vaccines and for confidence in accessing healthcare in about nine of every ten countries held out. For healthcare access, keeping the two dimensions separate predicts better than a single trust score.
- Respondents do not fall into distinct trust types. The pattern is a continuous gradient from low to high.

I attach [the figures and a short summary]. I would value your read on whether it is worth taking further and how it might sit with your multi-country work.

Warm regards,
Mohammed
