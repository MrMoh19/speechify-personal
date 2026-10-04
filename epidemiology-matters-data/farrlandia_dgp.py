#!/usr/bin/env python3
"""
Farrlandia data-generating process: the single source of truth.

Every risk equation behind the Farrlandia Census lives here, as a pure
function of a resident's characteristics. generate_census.py draws the
census from these equations; simulation tools (in silico trials,
agent-based models) call the same functions to compute counterfactual
risks. Changing a coefficient here changes the town everywhere at once.

All *_logit functions return the linear predictor; pass it through
logistic() for a probability. Argument names mirror the census codebook.
The term order inside each expression matches generate_census.py's
original inline arithmetic exactly, so refactored output is
bit-identical to the historical census.

female, and every 0/1 exposure, is an int flag. low_ses means ses <= 2.
"""

import csv
import math

# Mediator shifts the DGP applies (needed for total-effect counterfactuals)
SBP_SMOKING_SHIFT = 3        # smoking adds 3 mmHg to systolic BP
SBP_ALCOHOL_SHIFT = 4        # heavy alcohol adds 4 mmHg


def logistic(x):
    return 1.0 / (1.0 + math.exp(-x))


# ---------------------------------------------------------------------
# Assignment mechanisms (who gets educated, insured, exposed)
# ---------------------------------------------------------------------

def tertiary_edu_logit(ses):
    return -1.4 + 0.8 * (ses - 3)


def primary_edu_logit(ses):
    return -1.6 - 0.55 * (ses - 3)


def insured_logit(ses):
    return 0.3 + 0.55 * (ses - 3)


def smoking_logit(low_ses, high_ses, age):
    return (-1.15 + (0.7 if low_ses else 0)
            - (0.5 if high_ses else 0)
            + (0.2 if age > 45 else 0))


def air_pollution_logit(industrial_district, low_ses):
    return (-0.82 + (0.6 if industrial_district else 0)
            + (0.4 if low_ses else 0))


def poor_diet_logit(low_ses, high_ses):
    return (-0.75 + (0.7 if low_ses else 0)
            - (0.3 if high_ses else 0))


def inactivity_logit(low_ses, age):
    return (-0.6 + (0.5 if low_ses else 0)
            + (0.4 if age > 55 else 0))


def heavy_alcohol_logit(female, age):
    return (-1.55 + (0.4 if not female else 0)
            + (1.15 if age < 40 else 0)
            - (1.1 if age > 60 else 0))


def isolation_logit(low_ses, age):
    return (-1.65 + (0.5 if low_ses else 0)
            + (0.6 if age > 65 else 0))


# ---------------------------------------------------------------------
# Mediators (deterministic part; the generator adds Gaussian noise)
# ---------------------------------------------------------------------

def bmi_mean(poor_diet, inactivity, age, high_ses):
    return (26.5 + 2.0 * poor_diet + 1.7 * inactivity + 0.045 * (age - 40)
            - (1.1 if high_ses else 0))


def sbp_mean(age, bmi, smoking, heavy_alcohol):
    return (111 + 0.5 * (age - 40) + 0.55 * (bmi - 26.5)
            + SBP_SMOKING_SHIFT * smoking + SBP_ALCOHOL_SHIFT * heavy_alcohol)


# ---------------------------------------------------------------------
# Outcomes
# ---------------------------------------------------------------------

def cvd_logit(smoking, air_pollution, age, poor_diet, inactivity, low_ses,
              heavy_alcohol, female, sbp, bmi, family_history):
    return (-4.35 + 0.75 * smoking + 0.4 * air_pollution + 0.030 * (age - 40)
            + 0.35 * poor_diet + 0.3 * inactivity + (0.35 if low_ses else 0)
            + 0.45 * heavy_alcohol + (0.4 if not female else 0)
            + 0.020 * (sbp - 120) + 0.03 * (bmi - 26.5) + 0.65 * family_history)


def dep_pre_logit(isolation, low_ses, female, heavy_alcohol, age):
    return (-2.95 + 1.0 * isolation + (0.5 if low_ses else 0) + 0.4 * female
            + 0.3 * heavy_alcohol - 0.012 * (age - 42))


def dep_logit(isolation, low_ses, female, heavy_alcohol, age, dep_pre, laid_off):
    return (-3.3 + 0.9 * isolation + (0.45 if low_ses else 0) + 0.35 * female
            + 0.3 * heavy_alcohol - 0.012 * (age - 40) + 1.7 * dep_pre
            + 0.95 * laid_off)


def lc_logit(smoking, pack_years, air_pollution, age):
    return (-5.35 + 0.9 * smoking + 0.030 * pack_years + 0.5 * air_pollution
            + 0.85 * smoking * air_pollution + 0.045 * (age - 40))


def t2d_logit(bmi, age, inactivity, poor_diet, low_ses):
    return (-3.6 + 0.085 * (bmi - 26.5) + 0.040 * (age - 40)
            + 0.45 * inactivity + 0.35 * poor_diet + (0.3 if low_ses else 0))


def injury_logit(heavy_alcohol, age, female, manual_job):
    return (-2.65 + 0.85 * heavy_alcohol + (0.5 if age < 30 else 0)
            + (0.4 if age >= 70 else 0) + (0.3 if not female else 0)
            + 0.5 * manual_job)


def resp_logit(miner, hill_resident, air_pollution, smoking, age, low_ses):
    return (-2.15 + 1.2 * miner + (0.5 if hill_resident else 0)
            + 0.5 * air_pollution + 0.45 * smoking + (0.4 if age > 65 else 0)
            + (0.25 if low_ses else 0))


def visit_logit(somatic, depression, insured, nightingale_resident, age,
                female, injury):
    return (-2.5 + 2.3 * somatic + 2.3 * depression + 1.2 * insured
            + (0.9 if nightingale_resident else 0)
            + (0.35 if age > 60 else 0) + 0.25 * female + 0.5 * injury)


def t2d_dx_prob(visit, nightingale_resident):
    """P(diagnosed | true type 2 diabetes)."""
    return (0.85 if nightingale_resident else 0.5) if visit else 0.18


# ---------------------------------------------------------------------
# Working with the published census CSV
# ---------------------------------------------------------------------

def load_census(path):
    """Read the published census into typed dicts keyed by codebook names."""
    INT = {"id", "age", "ses", "laid_off_factory", "insured", "smoking",
           "air_pollution", "poor_diet", "physical_inactivity",
           "heavy_alcohol", "social_isolation", "systolic_bp",
           "family_history_cvd", "cvd", "depression", "depression_2yr_ago",
           "lung_cancer", "type2_diabetes", "type2_diabetes_diagnosed",
           "resp_infection_past_year", "injury_past_year",
           "clinic_visit_past_year"}
    FLOAT = {"pack_years", "bmi", "followup_years"}
    rows = []
    with open(path, newline="") as f:
        for r in csv.DictReader(f):
            for k in r:
                if k in INT:
                    r[k] = int(r[k])
                elif k in FLOAT:
                    r[k] = float(r[k])
            r["female"] = 1 if r["sex"] == "female" else 0
            rows.append(r)
    return rows


def cvd_prob(row, smoking=None):
    """P(CVD) for a census row, optionally under counterfactual smoking.

    Setting smoking also moves systolic blood pressure by the DGP's
    smoking shift, so this is the total effect of the smoking change.
    """
    s = row["smoking"] if smoking is None else smoking
    sbp = row["systolic_bp"] + SBP_SMOKING_SHIFT * (s - row["smoking"])
    return logistic(cvd_logit(
        s, row["air_pollution"], row["age"], row["poor_diet"],
        row["physical_inactivity"], row["ses"] <= 2, row["heavy_alcohol"],
        row["female"], sbp, row["bmi"], row["family_history_cvd"]))
