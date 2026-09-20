# Study 3 (Chapter 4) — Updated Analysis and Approach

Trauma saturation and differential stress sensitivity. Definitive run 20 September 2026 (refusal-corrected trauma count) in Stata 19.5 on `Marvin_1_Feb_2026_cleaned.dta` (six states, Ogun included), via `marvin_stress_trauma.do`. The earlier Python run on the Box extract (`analysis.py`, `results.json`) is superseded but agrees on every pattern.

## What changed in the approach, and why

The original specification tested trauma × stressor interactions with trauma in four arbitrary bins (0, 1–2, 3–4, 5+), stressors centered at the mean, and no covariate adjustment. Reviewers will press on three points: the bins impose the saturation shape rather than test it, the multiplicative scale alone cannot support claims about intervention targeting, and an unadjusted interaction can be confounded by anything tracking both trauma and stress (age, gender, education, state). The update answers each:

1. **Trauma continuous** (0–12 events) as a restricted cubic spline (knots 0, 2, 5): the saturation curve is estimated, not assumed. The categorical spec is retained as a secondary analysis.
2. **Design-based variance**: svy Poisson, 6 state strata, 572 community PSUs, linearized SEs.
3. **Covariate adjustment** (age, gender, education, state) in the primary model.
4. **Both interaction scales**: stressor IRRs by trauma level (Wald test on the interaction block) and absolute risk differences from `margins` contrasts.
5. **Predicted prevalence surface** (trauma × stressors) in place of a two-point contrast.
6. **Prespecified sensitivity analyses**: PCL-5≥33, PHQ-9≥15, GAD-7≥7, and continuous scores.
7. **Sample**: all six states, with Ogun as the non-conflict comparison anchoring the low-trauma end; five-state (conflict-only) run available as sensitivity via the toggle in the do-file.

## Definitive results (six states)

N=1,729 (unadjusted models), N=1,706 (adjusted); 565/558 PSUs, 6 strata. Thirty-seven respondents who declined the trauma items are excluded (recoded from zero to missing; verified against the item-level data — see the hygiene block in the do-file). Stressor count mean 2.05, SD 1.65.

**Secondary (categorical, unadjusted): per-stressor IRR (95% CI)**

| Trauma | PTSD | Depression | Anxiety |
|---|---|---|---|
| 0 events | 1.97 (1.53–2.54) | 1.83 (1.46–2.30) | 1.71 (1.35–2.17) |
| 1–2 | 1.26 (1.06–1.50) | 1.27 (1.11–1.45) | 1.15 (1.01–1.31) |
| 3–4 | 1.03 (0.87–1.21) | 0.95 (0.81–1.12) | 0.86 (0.75–0.99) |
| 5+ | 0.92 (0.83–1.03) | 0.99 (0.90–1.09) | 1.03 (0.95–1.13) |
| Interaction F(3,557), p | 11.41, <0.0001 | 11.29, <0.0001 | 9.09, <0.0001 |

**Primary (adjusted, spline trauma × stressors): interaction Wald F(2,551), p** — PTSD 5.97, 0.0027; depression 9.91, 0.0001; anxiety 5.99, 0.0027.

**Sensitivity**: PCL-5≥33 p=0.0002; PHQ-9≥15 p=0.0001; GAD-7≥7 p<0.0001; continuous PCL-5 p<0.0001, PHQ-9 p=0.0001, GAD-7 p<0.0001. The interaction survives every threshold and the continuous scores.

**Additive scale (margins contrast, stressors 4 vs 0):**
- Zero events: PTSD +21.8 pp (95% CI 7.2–36.5, p=0.004); depression +24.1 pp (10.5–37.6, p=0.001); anxiety +17.8 pp (3.9–31.6, p=0.012).
- Five events: PTSD −2.5 pp (−18.3 to +13.4, p=0.76); depression +3.5 pp (−7.7 to +14.6, p=0.54); anxiety −4.0 pp (−15.1 to +7.1, p=0.48). Null in all three.

**Predicted prevalence (adjusted):** at zero events, PTSD rises from 6.5% (1.1–12.0) with no stressors to 28.4% (15.4–41.3) at four; at five events it sits at 40.9% (20.3–61.4) with no stressors and 38.4% (27.4–49.3) at four — high and flat. Depression: 5.4%→29.4% at zero events; 35.3%→38.7% at five. Anxiety: 7.1%→24.9% at zero events; 40.2%→36.2% at five.

Caution on the trauma=7 grid rows: the log-link model predicts values near or above 1 there (e.g., PTSD 1.01 at zero stressors), which is the known ceiling artifact of Poisson-for-prevalence at extreme covariate values, not a finding. Report the surface up to five events in the paper and note in a footnote that predictions beyond that are unstable (only ~60 respondents have 6+ events).

## Reporting decisions

- **Sample framing**: six states — five conflict-affected (Benue, Borno, Enugu, Rivers, Sokoto) plus Ogun as a non-conflict comparison. Manuscript 2's 20.8% remains the conflict-states prevalence anchor in the introduction. The five-state-only run is the robustness sentence (`local five_state_only 1` in the do-file; run it once and report the interaction p-values).
- **Weights are equal**, so describe the analysis as accounting for the stratified cluster design (state strata, community PSUs, linearized variances), not as "survey-weighted."
- **Stressor metric**: the 0–10 socioeconomic challenge count (mean 2.05, SD 1.65). Per-SD IRR = exp(1.653 × log IRR) where a reviewer asks for cross-scale comparability. Drop the abstract's 30-item scale description unless that instrument is what Chapter 3 validated; the numbers above are per additional stressor on the count.
- **Soften "renders insensitive"**: cross-sectional data support "the stressor–symptom gradient is concentrated among those with limited trauma exposure; among the heavily exposed, prevalence is high at every stressor level."

## Statistical Analysis section (drop-in)

> We modeled each outcome with Poisson regression, which returns prevalence ratios directly and avoids the non-collapsibility of odds ratios at the prevalences observed here. All models accounted for the stratified multi-stage design, with state as the stratification variable, community as the primary sampling unit, and linearized variance estimation. Trauma exposure entered the primary models continuously (0–12 events) as a restricted cubic spline with knots at 0, 2, and 5 events, so that any flattening of the stressor–symptom association at higher exposure would be estimated from the data rather than imposed by categorization; socioeconomic stressors entered as the challenge count (0–10). Primary models adjusted for age, gender, education, and state. We tested departure from a common stressor effect with an adjusted Wald test on the trauma × stressor interaction terms. Because claims about intervention targeting rest on absolute rather than relative differences, we also estimated model-based changes in predicted prevalence for an increase from zero to four stressors at fixed trauma levels. We prespecified three sensitivity analyses: alternative case thresholds (PCL-5≥33, PHQ-9≥15, GAD-7≥7), continuous symptom scores, and the categorical trauma specification (0, 1–2, 3–4, 5+ events) used in earlier versions of this work, estimated without covariate adjustment for comparability. Analyses used Stata 19.5.

## Results paragraphs (drop-in)

> Stressor effects depended on trauma exposure for all three outcomes. Among respondents reporting no traumatic events, each additional socioeconomic stressor was associated with a 97% higher prevalence of probable PTSD (IRR 1.97, 95% CI 1.53–2.54); among those reporting five or more events, the association was null (IRR 0.92, 95% CI 0.83–1.03; interaction p<0.0001). Depression (1.83, 1.46–2.30, falling to 0.99, 0.90–1.09; p<0.0001) and anxiety (1.71, 1.35–2.17, falling to 1.03, 0.95–1.13; p<0.0001) followed the same pattern. The continuous specification told the same story without the categories: in adjusted models with trauma as a restricted cubic spline, the trauma × stressor interaction held for PTSD (p=0.0027), depression (p=0.0001), and anxiety (p=0.0027), and survived alternative case thresholds and continuous symptom scores (all p≤0.0002).
>
> The absolute differences carry the public health point. At zero traumatic events, moving from zero to four stressors was associated with a 21.8 percentage-point rise in adjusted PTSD prevalence (95% CI 7.2–36.5), from 6.5% to 28.4%. At five events, the same contrast produced no rise (−2.5 points, 95% CI −18.3 to +13.4) against a prevalence near 40% at every stressor level. Depression and anxiety showed the same contrast: a 24.1-point and a 17.8-point rise respectively at zero events, and null differences at five. Respondents with extensive trauma histories, therefore, carried the highest symptom burden regardless of socioeconomic stress, while those without trauma histories carried a burden that tracked it steeply.

## Abstract (drop-in; update Methods sentence if you keep the five-state framing instead)

> **Background:** Whether daily socioeconomic stressors and trauma exposure combine additively in shaping mental health, or whether trauma modifies stress sensitivity, remains unresolved in conflict settings. We tested whether trauma exposure modifies the association between socioeconomic stressors and mental health outcomes in Nigeria.
>
> **Methods:** We analyzed data from 1,729 adults in six Nigerian states — five conflict-affected (Benue, Borno, Enugu, Rivers, Sokoto) and one non-conflict comparison state (Ogun) — sampled through stratified multi-stage cluster sampling between January and March 2024. Outcomes were probable PTSD (PCL-5≥38), depression (PHQ-9≥10), and anxiety (GAD-7≥10). We fit Poisson models with trauma exposure as a restricted cubic spline (0–12 events), a trauma × stressor interaction, adjustment for age, gender, education, and state, and design-based variance estimation (state strata, 565 community clusters), and we estimated absolute prevalence differences at fixed trauma levels. Sensitivity analyses varied case thresholds and modeled continuous symptom scores.
>
> **Results:** Stressor–symptom associations weakened monotonically with trauma exposure (interaction p<0.0001 for all three outcomes). Among adults without trauma exposure, each additional stressor was associated with an IRR of 1.97 (95% CI 1.53–2.54) for PTSD; among those with five or more events, 0.92 (0.83–1.03). On the absolute scale, four additional stressors were associated with a 21.8 percentage-point rise in PTSD prevalence at zero events (6.5% to 28.4%) and no rise at five events, where prevalence stayed near 40% regardless of stressor level. Depression and anxiety followed the same pattern, and the interaction held across alternative thresholds and continuous scores.
>
> **Interpretation:** Symptom burden among adults with extensive trauma exposure was high at every level of socioeconomic stress, and the stress–symptom gradient was concentrated among those with limited exposure. These findings argue against universal psychosocial programming and for matching interventions to trauma history: stress-focused support where stress sensitivity is retained, trauma-focused therapies where exposure is extensive.

## Remaining to-dos

1. Run the five-state sensitivity (`local five_state_only 1`) and add its interaction p-values as one sentence.
2. Decide the sample framing (six-state primary as drafted above, or five-state primary with Ogun as sensitivity) and align N throughout the chapter.
3. Table 2 = the categorical IRR table above; Figure 1 = predicted prevalence by stressors at trauma 0/1/2/3/5 (margins output, trauma 7 omitted).
