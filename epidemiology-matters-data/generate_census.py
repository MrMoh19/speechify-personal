#!/usr/bin/env python3
"""
Farrlandia Census generator — Epidemiology Matters (2nd ed.)

Generates the 10,000-person Farrlandia Census with a documented causal
structure, writes it as CSV for the website, and regenerates the site
explorer's 1,000-person dataset as a literal simple random sample of the
census (so the explorer is, exactly, Step 3 of the seven-step framework).

Built-in lessons (verified by the validation report this script prints):
  A. Confounding: smoking -> CVD is confounded by age and SES.
  B. Reversal: heavy alcohol -> CVD looks null/protective crude, harmful
     once age-adjusted (heavy drinking is concentrated in the young).
  C. Interaction: smoking x air pollution on lung cancer is superadditive.
  D. Selection (Berkson's bias): among clinic attendees, type 2 diabetes
     falsely appears to protect against depression, because attendance is
     a collider (disease -> attendance <- depression).
  E. Structure & place: Hill district hosts the colliery; coal-mine work
     and Hill residence drive respiratory infection, so place and
     occupation - not chance - pattern disease.
  F. A true null, for now: District Snow's poorest households draw water
     from the Snow Pump. The pump is currently clean: analyses against it
     should find nothing. (An outbreak switch exists for the Challenge -
     see OUTBREAK below.)
  G. Natural experiment: the Vulcan Works in Snow closed two years before
     the census. Workers who lost their jobs report far more depression
     now than before the closure; workers the plant kept do not. The
     depression_2yr_ago column supports a difference-in-differences
     comparison.
  H. Ascertainment: the Nightingale Clinic opened eighteen months before
     the census. True diabetes prevalence is flat across districts, but
     diagnosed diabetes runs higher in Nightingale because more residents
     now sit in front of a clinician.

Reproducible: fixed seed. Do not edit the CSV by hand; edit this script.
"""

import csv
import math
import random
import os

SEED = 20280402
N = 10000
SAMPLE_N = 1000

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, "..", "epidemiology-matters-site")
CSV_OUT = os.path.join(SITE, "farrlandia", "census", "farrlandia-census.csv")
JS_OUT = os.path.join(SITE, "scripts", "farr-data.js")

DISTRICTS = ["", "Snow", "Nightingale", "Hill", "Doll", "Rose"]


def logistic(x):
    return 1.0 / (1.0 + math.exp(-x))


def generate():
    rng = random.Random(SEED)
    rows = []
    ids = rng.sample(range(10001, 99999), N)
    for i in range(N):
        pid = ids[i]
        age = 18 + int(rng.random() * 62)          # 18..79
        female = 1 if rng.random() < 0.51 else 0
        dist = 1 + int(rng.random() * 5)
        # SES 1..5; Doll & Rose affluent, Snow industrial/poorer
        ses_raw = rng.random() + (0.18 if dist in (4, 5) else 0) - (0.12 if dist == 1 else 0)
        ses = max(1, min(5, round(1 + ses_raw * 4)))
        low_ses = ses <= 2

        # education from SES
        r = rng.random()
        p_tert = logistic(-1.4 + 0.8 * (ses - 3))
        p_prim = logistic(-1.6 - 0.55 * (ses - 3))
        if r < p_tert:
            edu = "tertiary"
        elif r < p_tert + p_prim:
            edu = "primary"
        else:
            edu = "secondary"

        insured = 1 if rng.random() < logistic(0.3 + 0.55 * (ses - 3)) else 0

        # ---- structure: occupation & water source ----
        # Hill hosts the colliery; Snow the factories and the Snow Pump.
        r2 = rng.random()
        if age >= 65 and r2 < 0.85:
            occ = "retired"
        elif age < 23 and r2 < 0.5:
            occ = "student"
        elif rng.random() < (0.10 if low_ses else 0.04):
            occ = "unemployed"
        elif dist == 3 and rng.random() < (0.30 if (not female and edu != "tertiary") else 0.05):
            occ = "coal miner"
        elif dist == 1 and rng.random() < (0.34 if edu != "tertiary" else 0.08):
            occ = "factory worker"
        elif dist == 2 and rng.random() < 0.20:
            occ = "farmhand"
        elif edu == "tertiary" or ses >= 4:
            occ = "office worker"
        else:
            occ = "service worker"
        miner = 1 if occ == "coal miner" else 0
        manual = 1 if occ in ("coal miner", "factory worker", "farmhand") else 0

        if dist == 1:
            p_pump = 0.75 if low_ses else (0.40 if ses == 3 else 0.15)
        elif dist == 3:
            p_pump = 0.10
        else:
            p_pump = 0.04
        water = "snow pump" if rng.random() < p_pump else "municipal"

        # The Vulcan Works closed two years before the census. Some of its
        # workforce was kept on at the remaining Snow plants; the rest were
        # laid off and are now unemployed or in service work.
        laid = 0
        if dist == 1 and 25 <= age <= 64:
            if occ in ("unemployed", "service worker") and rng.random() < 0.45:
                laid = 1

        # ---- exposures ----
        smoking = 1 if rng.random() < logistic(-1.15 + (0.7 if low_ses else 0)
                                               - (0.5 if ses >= 4 else 0)
                                               + (0.2 if age > 45 else 0)) else 0
        pack_years = round(max(0.0, (age - 18) * 0.35 * (0.5 + rng.random())), 1) if smoking else 0.0
        pack_years = min(pack_years, 60.0)
        poll = 1 if rng.random() < logistic(-0.82 + (0.6 if dist in (1, 3) else 0)
                                            + (0.4 if low_ses else 0)) else 0
        diet = 1 if rng.random() < logistic(-0.75 + (0.7 if low_ses else 0)
                                            - (0.3 if ses >= 4 else 0)) else 0
        inact = 1 if rng.random() < logistic(-0.6 + (0.5 if low_ses else 0)
                                             + (0.4 if age > 55 else 0)) else 0
        # heavy alcohol concentrated in the young (drives Lesson B)
        alc = 1 if rng.random() < logistic(-1.55 + (0.4 if not female else 0)
                                           + (1.15 if age < 40 else 0)
                                           - (1.1 if age > 60 else 0)) else 0
        iso = 1 if rng.random() < logistic(-1.65 + (0.5 if low_ses else 0)
                                           + (0.6 if age > 65 else 0)) else 0

        bmi = 26.5 + 2.0 * diet + 1.7 * inact + 0.045 * (age - 40) \
            - (1.1 if ses >= 4 else 0) + rng.gauss(0, 3.3)
        bmi = round(max(16.5, min(52.0, bmi)), 1)
        sbp = 111 + 0.5 * (age - 40) + 0.55 * (bmi - 26.5) + 3 * smoking + 4 * alc + rng.gauss(0, 9)
        sbp = int(max(90, min(210, round(sbp))))
        famhx = 1 if rng.random() < 0.15 else 0

        # ---- outcomes ----
        cvd_l = (-4.35 + 0.75 * smoking + 0.4 * poll + 0.030 * (age - 40)
                 + 0.35 * diet + 0.3 * inact + (0.35 if low_ses else 0)
                 + 0.45 * alc + (0.4 if not female else 0)
                 + 0.020 * (sbp - 120) + 0.03 * (bmi - 26.5) + 0.65 * famhx)
        cvd = 1 if rng.random() < logistic(cvd_l) else 0

        dep_pre_l = (-2.95 + 1.0 * iso + (0.5 if low_ses else 0) + 0.4 * female
                     + 0.3 * alc - 0.012 * (age - 42))
        dep_pre = 1 if rng.random() < logistic(dep_pre_l) else 0
        dep_l = (-3.3 + 0.9 * iso + (0.45 if low_ses else 0) + 0.35 * female
                 + 0.3 * alc - 0.012 * (age - 40) + 1.7 * dep_pre + 0.95 * laid)
        dep = 1 if rng.random() < logistic(dep_l) else 0

        lc_l = (-5.35 + 0.9 * smoking + 0.030 * pack_years + 0.5 * poll
                + 0.85 * smoking * poll + 0.045 * (age - 40))
        lc = 1 if rng.random() < logistic(lc_l) else 0

        t2d_l = (-3.6 + 0.085 * (bmi - 26.5) + 0.040 * (age - 40)
                 + 0.45 * inact + 0.35 * diet + (0.3 if low_ses else 0))
        t2d = 1 if rng.random() < logistic(t2d_l) else 0

        inj_l = (-2.65 + 0.85 * alc + (0.5 if age < 30 else 0)
                 + (0.4 if age >= 70 else 0) + (0.3 if not female else 0)
                 + 0.5 * manual)
        inj = 1 if rng.random() < logistic(inj_l) else 0

        # Respiratory infection: the colliery's ambient dust burdens all of
        # Hill; mine work itself is the strongest driver. The Snow Pump has
        # NO effect here - the well is clean (Lesson F).
        resp_l = (-2.15 + 1.2 * miner + (0.5 if dist == 3 else 0)
                  + 0.5 * poll + 0.45 * smoking + (0.4 if age > 65 else 0)
                  + (0.25 if low_ses else 0))
        resp = 1 if rng.random() < logistic(resp_l) else 0

        somatic = 1 if (cvd or lc or t2d) else 0
        # The Nightingale Clinic opened eighteen months before the census,
        # so Nightingale residents get through a clinic door more often.
        visit_l = (-2.5 + 2.3 * somatic + 2.3 * dep + 1.2 * insured
                   + (0.9 if dist == 2 else 0)
                   + (0.35 if age > 60 else 0) + 0.25 * female + 0.5 * inj)
        visit = 1 if rng.random() < logistic(visit_l) else 0
        # Diabetes is diagnosed when someone is seen, and the new
        # Nightingale Clinic runs screening the older dispensaries do not.
        t2d_dx = 1 if (t2d and rng.random() < ((0.85 if dist == 2 else 0.5) if visit else 0.18)) else 0

        followup = round(4 + rng.random() * 6, 1)   # 4.0 .. 10.0 person-years

        rows.append(dict(
            id=pid, age=age, female=female, district=dist, ses=ses, education=edu,
            occupation=occ, water_source=water, laid_off_factory=laid,
            insured=insured,
            smoking=smoking, pack_years=pack_years,
            air_pollution=poll, poor_diet=diet, physical_inactivity=inact,
            heavy_alcohol=alc, social_isolation=iso, bmi=bmi, systolic_bp=sbp,
            family_history_cvd=famhx, cvd=cvd, depression=dep,
            depression_2yr_ago=dep_pre, lung_cancer=lc,
            type2_diabetes=t2d, type2_diabetes_diagnosed=t2d_dx,
            resp_infection_past_year=resp,
            injury_past_year=inj, clinic_visit_past_year=visit,
            followup_years=followup,
        ))
    return rows, random.Random(SEED + 1)


# ---------- validation helpers ----------

def prev(rows, k):
    return 100.0 * sum(r[k] for r in rows) / len(rows)


def rr(rows, e, o, ev=1):
    e1 = [r for r in rows if r[e] == ev]
    e0 = [r for r in rows if r[e] != ev]
    r1 = sum(r[o] for r in e1) / max(1, len(e1))
    r0 = sum(r[o] for r in e0) / max(1, len(e0))
    return r1 / r0 if r0 else float("nan")


def mh_rr(rows, e, o, strata_fn):
    """Mantel-Haenszel risk ratio across strata."""
    num = den = 0.0
    for key in set(strata_fn(r) for r in rows):
        s = [r for r in rows if strata_fn(r) == key]
        n1 = len([r for r in s if r[e] == 1])
        n0 = len([r for r in s if r[e] == 0])
        if not n1 or not n0:
            continue
        a = sum(r[o] for r in s if r[e] == 1)
        c = sum(r[o] for r in s if r[e] == 0)
        t = n1 + n0
        num += a * n0 / t
        den += c * n1 / t
    return num / den if den else float("nan")


def report(rows):
    print(f"N = {len(rows)}")
    print("--- prevalences (%) ---")
    for k in ["smoking", "air_pollution", "poor_diet", "physical_inactivity",
              "heavy_alcohol", "social_isolation", "insured",
              "cvd", "depression", "lung_cancer", "type2_diabetes",
              "injury_past_year", "clinic_visit_past_year"]:
        print(f"  {k:24s} {prev(rows, k):5.1f}")
    age_band = lambda r: (r["age"] // 15)
    print("--- Lesson A: smoking -> CVD ---")
    print(f"  crude RR        {rr(rows, 'smoking', 'cvd'):.2f}")
    print(f"  age-adj MH RR   {mh_rr(rows, 'smoking', 'cvd', age_band):.2f}")
    print("--- Lesson B: heavy alcohol -> CVD (reversal) ---")
    print(f"  crude RR        {rr(rows, 'heavy_alcohol', 'cvd'):.2f}")
    print(f"  age-adj MH RR   {mh_rr(rows, 'heavy_alcohol', 'cvd', age_band):.2f}")
    print("--- Lesson C: smoking -> lung cancer, by air pollution (interaction) ---")
    low = [r for r in rows if r["air_pollution"] == 0]
    high = [r for r in rows if r["air_pollution"] == 1]
    print(f"  RR | low pollution   {rr(low, 'smoking', 'lung_cancer'):.2f}")
    print(f"  RR | high pollution  {rr(high, 'smoking', 'lung_cancer'):.2f}")
    print("--- Lesson D: type 2 diabetes -> depression (Berkson's bias) ---")
    attendees = [r for r in rows if r["clinic_visit_past_year"] == 1]
    print(f"  RR, whole population   {rr(rows, 'type2_diabetes', 'depression'):.2f}")
    print(f"  RR, clinic attendees   {rr(attendees, 'type2_diabetes', 'depression'):.2f}")
    print("--- Lesson E: place & occupation -> respiratory infection ---")
    for d in range(1, 6):
        s = [r for r in rows if r["district"] == d]
        print(f"  {DISTRICTS[d]:12s} prevalence {prev(s, 'resp_infection_past_year'):5.1f}%")
    miners = [r for r in rows if r["occupation"] == "coal miner"]
    print(f"  coal miners (n={len(miners)}) prevalence {prev(miners, 'resp_infection_past_year'):.1f}%")
    non = [r for r in rows if r["occupation"] != "coal miner"]
    print(f"  miner vs non-miner RR  {(prev(miners,'resp_infection_past_year')/prev(non,'resp_infection_past_year')):.2f}")
    print("--- Lesson F: the Snow Pump is clean (true nulls) ---")
    pump = [r for r in rows if r["water_source"] == "snow pump"]
    muni = [r for r in rows if r["water_source"] == "municipal"]
    print(f"  pump users n={len(pump)} ({100*len(pump)/len(rows):.1f}%)")
    for o in ["resp_infection_past_year", "cvd", "depression"]:
        print(f"  pump vs municipal RR, {o}: {(prev(pump,o)/prev(muni,o)):.2f}")
    print("--- Lesson G: the Vulcan Works closure (difference-in-differences) ---")
    laid_g = [r for r in rows if r["laid_off_factory"] == 1]
    kept_g = [r for r in rows if r["district"] == 1 and r["occupation"] == "factory worker"]
    lp, lc_ = prev(laid_g, "depression_2yr_ago"), prev(laid_g, "depression")
    kp, kc = prev(kept_g, "depression_2yr_ago"), prev(kept_g, "depression")
    print(f"  laid off  (n={len(laid_g)}): depression {lp:.1f}% before, {lc_:.1f}% now")
    print(f"  kept on   (n={len(kept_g)}): depression {kp:.1f}% before, {kc:.1f}% now")
    print(f"  difference-in-differences: {(lc_-lp)-(kc-kp):+.1f} pp")
    print("--- Lesson H: the Nightingale Clinic (ascertainment) ---")
    for d in range(1, 6):
        s = [r for r in rows if r["district"] == d]
        print(f"  {DISTRICTS[d]:12s} true T2D {prev(s,'type2_diabetes'):5.1f}%   diagnosed {prev(s,'type2_diabetes_diagnosed'):5.1f}%   clinic visits {prev(s,'clinic_visit_past_year'):5.1f}%")
    pump_flag = lambda r: 1 if r["water_source"] == "snow pump" else 0
    for r_ in rows: r_["_pump"] = pump_flag(r_)
    strat = lambda r: (r["ses"], r["district"], r["age"] // 12)
    print(f"  pump -> CVD, SES/district/age-adjusted MH RR: {mh_rr(rows, '_pump', 'cvd', strat):.2f}  (the pump is acquitted)")


# ---------- outputs ----------

CSV_COLS = ["id", "age", "sex", "district", "ses", "education", "occupation",
            "water_source", "laid_off_factory", "insured",
            "smoking", "pack_years", "air_pollution", "poor_diet",
            "physical_inactivity", "heavy_alcohol", "social_isolation",
            "bmi", "systolic_bp", "family_history_cvd",
            "cvd", "depression", "depression_2yr_ago", "lung_cancer",
            "type2_diabetes", "type2_diabetes_diagnosed",
            "resp_infection_past_year",
            "injury_past_year", "clinic_visit_past_year", "followup_years"]


def write_csv(rows):
    os.makedirs(os.path.dirname(CSV_OUT), exist_ok=True)
    with open(CSV_OUT, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(CSV_COLS)
        for r in rows:
            w.writerow([
                r["id"], r["age"], "female" if r["female"] else "male",
                DISTRICTS[r["district"]], r["ses"], r["education"],
                r["occupation"], r["water_source"], r["laid_off_factory"], r["insured"],
                r["smoking"], r["pack_years"], r["air_pollution"], r["poor_diet"],
                r["physical_inactivity"], r["heavy_alcohol"], r["social_isolation"],
                r["bmi"], r["systolic_bp"], r["family_history_cvd"],
                r["cvd"], r["depression"], r["depression_2yr_ago"], r["lung_cancer"],
                r["type2_diabetes"], r["type2_diabetes_diagnosed"],
                r["resp_infection_past_year"],
                r["injury_past_year"], r["clinic_visit_past_year"], r["followup_years"],
            ])
    print(f"wrote {CSV_OUT} ({os.path.getsize(CSV_OUT)} bytes)")


def write_sample_js(rows, sampler):
    sample = sampler.sample(rows, SAMPLE_N)
    arrs = []
    for r in sample:
        arrs.append([r["id"], r["age"], r["female"], r["district"], r["ses"],
                     r["smoking"], r["air_pollution"], r["poor_diet"],
                     r["physical_inactivity"], r["heavy_alcohol"],
                     r["social_isolation"], r["cvd"], r["depression"],
                     r["lung_cancer"], r["followup_years"]])
    js = ("// A 1,000-person simple random sample of the 10,000-person Farrlandia Census.\n"
          "// Generated by epidemiology-matters-data/generate_census.py (seed "
          + str(SEED) + "). Do not edit by hand.\n"
          "window.__FARR_RAW__=" + str(arrs).replace(" ", "") + ";")
    with open(JS_OUT, "w") as f:
        f.write(js)
    print(f"wrote {JS_OUT} ({os.path.getsize(JS_OUT)} bytes)")
    print("--- sample check (n=1000) ---")
    print(f"  cvd {prev(sample,'cvd'):.1f}%  dep {prev(sample,'depression'):.1f}%  "
          f"lc {prev(sample,'lung_cancer'):.1f}%  smoking {prev(sample,'smoking'):.1f}%")


# ---------- The Challenge outbreak (disabled by default) ----------
# When OUTBREAK is True, the Snow Pump is contaminated and an outbreak
# line list is written alongside the census. The census itself is NOT
# changed - the outbreak is a separate event dataset for the Farrlandia
# Challenge. Attack is concentrated among pump users, with household /
# neighbourhood spillover in Snow and sporadic background cases.
OUTBREAK = False
OUTBREAK_OUT = os.path.join(SITE, "farrlandia", "census", "snow-pump-outbreak.csv")


def write_outbreak(rows, path=None):
    orng = random.Random(SEED + 7)
    path = path or OUTBREAK_OUT
    cases = []
    for r in rows:
        if r["water_source"] == "snow pump":
            p = 0.38
        elif r["district"] == 1:
            p = 0.06
        else:
            p = 0.012
        if orng.random() >= p:
            continue
        if r["water_source"] == "snow pump":
            onset = max(1, min(42, int(orng.gauss(13, 5))))
        else:
            onset = max(1, min(42, int(orng.gauss(19, 8))))
        severe = 1 if orng.random() < logistic(-2.6 + 0.03 * (r["age"] - 40)
                                               + 0.5 * (r["ses"] <= 2)) else 0
        cases.append([r["id"], r["age"], "female" if r["female"] else "male",
                      DISTRICTS[r["district"]], r["ses"], r["water_source"],
                      onset, severe])
    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["id", "age", "sex", "district", "ses", "water_source",
                    "onset_day", "severe"])
        w.writerows(cases)
    n_pump = sum(1 for r in rows if r["water_source"] == "snow pump")
    n_case_pump = sum(1 for c in cases if c[5] == "snow pump")
    print(f"outbreak: {len(cases)} cases; attack rate pump {100*n_case_pump/n_pump:.1f}% "
          f"vs other {100*(len(cases)-n_case_pump)/(len(rows)-n_pump):.1f}%; wrote {path}")


if __name__ == "__main__":
    rows, sampler = generate()
    report(rows)
    write_csv(rows)
    write_sample_js(rows, sampler)
    if OUTBREAK:
        write_outbreak(rows)
