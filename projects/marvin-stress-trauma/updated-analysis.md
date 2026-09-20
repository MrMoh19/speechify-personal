# Study 3 (Chapter 4) — Updated Analysis and Approach

Trauma Saturation and Differential Stress Sensitivity. Re-analysis run 20 September 2026 from `marvin_collab_data` (Box, MARVIN collaboration folder). Script: `analysis.py`; full estimates: `results.json`.

## What changed in the approach, and why

The original specification tested trauma × stressor interactions with trauma in four arbitrary bins (0, 1–2, 3–4, 5+), stressors centered at the mean, and no covariate adjustment. Reviewers at Social Science & Medicine will press on three points: the bins impose the saturation shape rather than test it, the multiplicative scale alone cannot support a claim about who gains most from intervention, and an unadjusted interaction can be confounded by anything that tracks both trauma burden and stress exposure (age, gender, education, state). The updated approach answers each.

1. **Trauma modeled continuously** (0–12 events) with a restricted cubic spline (knots 0, 2, 5), so the saturation curve is estimated, not assumed. The 0/1–2/3–4/5+ specification is retained as a secondary analysis for comparability with the original draft.
2. **Modified Poisson with cluster-robust variance** at the community (PSU) level, 299 clusters, strata by state — this is the design-based analogue of the svy Poisson in the draft and carries over to Stata as `svy: poisson ... , vce(linearized)` with `svyset psu_id [pw=weight], strata(state_strata)`.
3. **Covariate adjustment** for age, gender, education, and state in the primary model; the unadjusted categorical model is reported alongside so the two drafts reconcile.
4. **Both scales of interaction.** Multiplicative (stressor IRR by trauma level, Wald test on the interaction block) and additive (model-based risk differences per +4 stressors at low and high trauma, cluster-bootstrap CIs, 400 replicates). Public-health claims about intervention targeting belong on the additive scale; the draft currently argues them from IRRs alone.
5. **Predicted prevalence surface** (trauma 0–7 × stressors 0–6) with bootstrap CIs, replacing the two-point 18%→31% vs ~70% contrast.
6. **Prespecified sensitivity analyses**: alternative cutoffs (PCL-5≥33, PHQ-9≥15, GAD-7≥7) and continuous symptom scores, so the finding cannot be attributed to any single threshold.

## Headline results from the re-analysis

Analytic sample: **N=1,135** adults with complete data across Benue, Borno, Enugu, Rivers, Sokoto; 299 communities. Prevalence: PTSD 21.3%, depression 25.6%, anxiety 24.3%.

**Replication (unadjusted, categorical, per additional stressor on the 0–10 count):**

| Trauma | PTSD IRR (95% CI) | Depression | Anxiety |
|---|---|---|---|
| 0 events | 1.70 (1.33–2.17) | 1.31 (0.98–1.76) | 1.38 (1.05–1.81) |
| 1–2 | 1.16 (0.95–1.41) | 1.22 (1.04–1.43) | 1.08 (0.93–1.26) |
| 3–4 | 1.07 (0.90–1.27) | 1.03 (0.88–1.20) | 0.90 (0.78–1.05) |
| 5+ | 0.94 (0.82–1.07) | 1.05 (0.94–1.17) | 1.03 (0.92–1.15) |
| Interaction p | <0.001 | 0.052 | 0.013 |

**Primary (adjusted, continuous spline trauma × stressors):** interaction p = 0.008 (PTSD), 0.017 (anxiety), 0.077 (depression at PHQ-9≥10; p<0.001 at ≥15 and p=0.010 for continuous PHQ-9). AIC favors the interaction model for PTSD and anxiety.

**Additive scale (risk difference for stressors 4 vs 0, bootstrap 95% CI):**
- No trauma: PTSD +22 pp (+7 to +37); depression +19 pp (+4 to +33); anxiety +16 pp (+2 to +33).
- Five events: PTSD −12 pp (−25 to +6); depression +3 pp (−19 to +20); anxiety −18 pp (−35 to −3).

**Predicted prevalence (PTSD):** at zero trauma, 9% (3–20) at zero stressors rising to 31% (14–47) at four and 54% (23–79) at six; at seven events, 71% (37–95) at zero stressors and 45% (23–60) at six. The gradient at high trauma is flat to negative, which is stronger than saturation: the point estimates cross. Treat the reversal cautiously (wide CIs, possible selection among the heavily exposed), but the saturation claim itself now rests on a shape the model was free to reject.

## Reconciliation with the current draft — read before swapping numbers in

- **N differs (1,135 vs 1,352).** The collaboration extract loses rows to column misalignment (concentrated in Sokoto and Borno) and to cleaning on gender, education, and age. Re-running the same script on the master Stata file should recover the draft's N; the pattern will not change, the estimates will move slightly.
- **Stressor scale differs.** The draft uses the 30-item scale (mean 20.5, SD 10.1); the extract carries the 0–10 socioeconomic challenge count. That is why the draft's IRRs (1.155 at no trauma) look smaller than the re-analysis (1.70): per-unit on a 30-point scale versus per-item on a 10-point count. Pick one, state it, and report the per-SD IRR alongside so readers can compare across scales.
- **Weights.** `sampling_weight` in the extract is 1 for everyone ("equal — to be refined"). "Survey-weighted" in the draft should therefore be restated as design-clustered (strata, PSU) unless the refined weights exist; if they do, the script takes them without modification.
- **Interpretation to soften.** "Renders persons insensitive to additional stressors" overreads a cross-sectional interaction. The updated framing: symptom prevalence among the heavily exposed is high at every stressor level, and the marginal association of socioeconomic stressors with symptoms is concentrated among those with limited trauma exposure. Same clinical implication, defensible causally.

## Revised Statistical Analysis section (drop-in)

> We modeled each outcome with modified Poisson regression, which returns prevalence ratios directly and avoids the non-collapsibility of odds ratios at prevalences above 20%. Trauma exposure entered the models continuously (0–12 events) as a restricted cubic spline with knots at 0, 2, and 5 events, so that any flattening of the stressor–symptom association at higher exposure would be estimated from the data rather than imposed by categorization. Socioeconomic stressors entered as the challenge count. The primary models adjusted for age, gender, education, and state, and all variances were linearized with clustering at the community level within state strata. We tested departure from a common stressor effect with a Wald test on the trauma × stressor interaction block. Because claims about intervention targeting depend on absolute rather than relative differences, we also estimated the model-based change in predicted prevalence associated with an increase from zero to four stressors at each trauma level, with confidence intervals from a cluster bootstrap (400 replicates). Three sensitivity analyses were prespecified: alternative case thresholds (PCL-5≥33, PHQ-9≥15, GAD-7≥7), continuous symptom scores, and the categorical trauma specification (0, 1–2, 3–4, 5+ events) used in earlier versions of this work. Analyses used [Stata 19.5 / statsmodels 0.14].

## Revised Results paragraphs (drop-in; update bracketed values from the master file)

> Stressor effects depended on trauma exposure for all three outcomes. Among respondents reporting no traumatic events, each additional socioeconomic stressor was associated with a [70]% higher prevalence of probable PTSD (IRR [1.70], 95% CI [1.33–2.17]); among those reporting five or more events, the association was null (IRR [0.94], 95% CI [0.82–1.07]; interaction p[<0.001]). The continuous specification told the same story without the categories: the spline × stressor interaction was significant for PTSD (p=[0.008]) and anxiety (p=[0.017]), and for depression at the higher severity threshold (PHQ-9≥15, p[<0.001]).
>
> The absolute differences carry the public health point. At zero traumatic events, moving from zero to four stressors was associated with a [22] percentage-point rise in PTSD prevalence (95% CI [7–37]), from [9]% to [31]%. At five events, the same contrast was associated with no rise ([−12] points, 95% CI [−25 to +6]) against a baseline prevalence near [49]%. Respondents with extensive trauma histories, therefore, carried the highest symptom burden at every stressor level, but their symptoms did not track socioeconomic stress; respondents without trauma histories carried a lower burden that tracked it steeply.

## Revised Abstract (drop-in)

> **Background:** Whether daily socioeconomic stressors and trauma exposure combine additively in shaping mental health, or whether trauma modifies stress sensitivity, remains unresolved in conflict settings. Building on our documentation of [20.8]% PTSD prevalence across conflict-affected Nigeria, we tested whether trauma exposure modifies the association between socioeconomic stressors and mental health outcomes.
>
> **Methods:** We analyzed data from [1,352] adults in five Nigerian states (Benue, Borno, Enugu, Rivers, Sokoto), sampled through stratified multi-stage cluster sampling between January and March 2024. Outcomes were probable PTSD (PCL-5≥38), depression (PHQ-9≥10), and anxiety (GAD-7≥10), using instruments validated in this population. We fit modified Poisson models with trauma exposure as a restricted cubic spline (0–12 events), a trauma × stressor interaction, adjustment for age, gender, education, and state, and community-clustered variances, and we estimated absolute prevalence differences by cluster bootstrap. Sensitivity analyses varied case thresholds and modeled continuous symptom scores.
>
> **Results:** Stressor–symptom associations weakened monotonically with trauma exposure (interaction p[<0.001] for PTSD). Among adults without trauma exposure, each additional stressor was associated with an IRR of [1.70] (95% CI [1.33–2.17]) for PTSD; among those with five or more events, [0.94] ([0.82–1.07]). On the absolute scale, four additional stressors were associated with a [22] percentage-point rise in PTSD prevalence at zero events ([9]% to [31]%) and no rise at five or more, where prevalence stayed near [49–70]% regardless of stressor level. Depression and anxiety followed the same pattern.
>
> **Interpretation:** Symptom burden among adults with extensive trauma exposure was high at every level of socioeconomic stress, and the stress–symptom gradient was concentrated among those with limited exposure. These findings argue against universal psychosocial programming and for matching interventions to trauma history: stress-focused support where stress sensitivity is retained, trauma-focused therapies where exposure is extensive.

## To finish

1. Re-run `analysis.py` against the master Stata file (or port to Stata: `svyset`, `svy: poisson`, `margins`) so the Ns and estimates match the dissertation dataset; replace the bracketed values.
2. Decide the stressor metric (30-item scale vs 0–10 count) and add a per-SD estimate.
3. Confirm whether refined sampling weights exist; if not, restate "survey-weighted" as design-clustered throughout.
4. Keep the negative high-trauma gradients out of the headline claims; a sentence in the discussion flagging possible reversal, with the selection caveat, is enough.
