#!/usr/bin/env python3
"""
Farrlandia in silico experiments: a working prototype.

Two demonstrations, both run on the published census
(epidemiology-matters-site/farrlandia/census/farrlandia-census.csv):

  A. The trial nobody can run. Randomize smoking cessation among
     Farrlandia's smokers and follow them forward under the census's own
     data-generating process. Because the DGP is known, the trial's
     estimate can be checked against the exact causal truth, and both can
     be set against the confounded observational contrast.

  B. The question a trial answers incompletely. An agent-based
     SIR epidemic on a contact network (households, workplaces,
     neighbourhoods). An individually randomized vaccine trial inside the
     epidemic recovers the direct effect; only the two-world simulation
     reveals the indirect (herd) protection, which the trial-based
     projection misses.

The CVD risk equation is copied from generate_census.py and must match it.
Phase 0 of the roadmap moves these equations into a shared module so there
is one source of truth.

Deterministic: every run of this script prints the same numbers.
"""

import csv
import math
import os
import random
import statistics

HERE = os.path.dirname(os.path.abspath(__file__))
CENSUS = os.path.join(HERE, "..", "epidemiology-matters-site",
                      "farrlandia", "census", "farrlandia-census.csv")

PROTO_SEED = 20280701


def logistic(x):
    return 1.0 / (1.0 + math.exp(-x))


def load_census():
    with open(CENSUS, newline="") as f:
        rows = []
        for r in csv.DictReader(f):
            rows.append(dict(
                id=int(r["id"]),
                age=int(r["age"]),
                female=1 if r["sex"] == "female" else 0,
                district=r["district"],
                ses=int(r["ses"]),
                occupation=r["occupation"],
                smoking=int(r["smoking"]),
                poll=int(r["air_pollution"]),
                diet=int(r["poor_diet"]),
                inact=int(r["physical_inactivity"]),
                alc=int(r["heavy_alcohol"]),
                bmi=float(r["bmi"]),
                sbp=int(r["systolic_bp"]),
                famhx=int(r["family_history_cvd"]),
                cvd=int(r["cvd"]),
            ))
    return rows


# ----------------------------------------------------------------------
# The CVD risk equation, verbatim from generate_census.py.
# ----------------------------------------------------------------------

def p_cvd(p, smoking, sbp):
    low_ses = p["ses"] <= 2
    l = (-4.35 + 0.75 * smoking + 0.4 * p["poll"] + 0.030 * (p["age"] - 40)
         + 0.35 * p["diet"] + 0.3 * p["inact"] + (0.35 if low_ses else 0)
         + 0.45 * p["alc"] + (0.4 if not p["female"] else 0)
         + 0.020 * (sbp - 120) + 0.03 * (p["bmi"] - 26.5) + 0.65 * p["famhx"])
    return logistic(l)


def cf_probs(p):
    """Risk of CVD if this person smokes vs if they do not.

    Smoking raises systolic blood pressure by 3 mmHg in the DGP, so the
    counterfactual swaps that contribution too (total effect).
    """
    sbp_as_smoker = p["sbp"] + (0 if p["smoking"] else 3)
    sbp_as_nonsmoker = p["sbp"] - (3 if p["smoking"] else 0)
    return p_cvd(p, 1, sbp_as_smoker), p_cvd(p, 0, sbp_as_nonsmoker)


# ----------------------------------------------------------------------
# Experiment A: in silico RCT of smoking cessation
# ----------------------------------------------------------------------

def experiment_a(rows):
    print("=" * 70)
    print("A. SMOKING CESSATION: observational vs in silico RCT vs truth")
    print("=" * 70)

    # Observational contrast in the census as collected.
    smk = [p for p in rows if p["smoking"] == 1]
    non = [p for p in rows if p["smoking"] == 0]
    r1 = sum(p["cvd"] for p in smk) / len(smk)
    r0 = sum(p["cvd"] for p in non) / len(non)
    print(f"\nObservational census: {len(smk)} smokers, {len(non)} non-smokers")
    print(f"  CVD risk {100*r1:.1f} vs {100*r0:.1f} per 100 -> crude RR {r1/r0:.2f}")

    # Exact causal truth from the DGP (standardization over the population).
    p1_all = [cf_probs(p)[0] for p in rows]
    p0_all = [cf_probs(p)[1] for p in rows]
    true_rr_pop = (sum(p1_all) / len(rows)) / (sum(p0_all) / len(rows))
    print(f"\nTruth under the DGP (everyone smokes vs nobody smokes):")
    print(f"  marginal causal RR {true_rr_pop:.2f}"
          f"  (the gap from {r1/r0:.2f} is confounding)")

    # The trial population: current smokers. Truth for quitting among them.
    pairs = [cf_probs(p) for p in smk]
    true_quit_rr = (sum(q for _, q in pairs) / len(pairs)) / \
                   (sum(s for s, _ in pairs) / len(pairs))
    print(f"\nTrial question: among Farrlandia's {len(smk)} smokers, what does"
          f"\nquitting do to CVD risk?  Exact truth: RR {true_quit_rr:.2f}")

    # Run the trial many times.
    rng = random.Random(PROTO_SEED)
    K = 500
    estimates = []
    for _ in range(K):
        order = list(range(len(smk)))
        rng.shuffle(order)
        half = len(smk) // 2
        treat = set(order[:half])
        a = n1 = c = n0 = 0
        for i, p in enumerate(smk):
            ps, pq = pairs[i]
            if i in treat:                      # cessation support, quits
                n1 += 1
                a += rng.random() < pq
            else:                               # keeps smoking
                n0 += 1
                c += rng.random() < ps
        estimates.append((a / n1) / (c / n0))
    estimates.sort()
    mean_rr = statistics.fmean(estimates)
    lo, hi = estimates[int(0.025 * K)], estimates[int(0.975 * K)]
    print(f"\nIn silico RCT, {K} replications, 1:1 allocation:")
    print(f"  mean estimated RR {mean_rr:.2f}, central 95% of trials"
          f" {lo:.2f} to {hi:.2f}")
    print(f"\nRead: the observational census says RR {r1/r0:.2f}; randomization")
    print(f"recovers the truth ({true_quit_rr:.2f}), and {K} trials cost nothing")
    print("and harmed no one. No ethics board would ever allow the real version.")


# ----------------------------------------------------------------------
# Experiment B: epidemic ABM, a vaccine trial inside it, and herd effects
# ----------------------------------------------------------------------

HH_SIZES = [1, 2, 3, 4, 5]
HH_WEIGHTS = [0.28, 0.34, 0.18, 0.13, 0.07]
WORK_SIZE = {"coal miner": 15, "factory worker": 25, "farmhand": 10,
             "office worker": 12, "service worker": 12}

BETA_HOUSE = 0.055      # per contact per day
BETA_WORK = 0.014
BETA_COMM = 0.007
INF_DAYS = 7
T_DAYS = 150
N_SEEDS = 10
VAX_COVER = 0.40
VAX_EFF = 0.70          # leaky: scales susceptibility


def build_network(rows, rng):
    n = len(rows)
    nbrs = [[] for _ in range(n)]

    def link(group, beta):
        for i in range(len(group)):
            for j in range(i + 1, len(group)):
                a, b = group[i], group[j]
                nbrs[a].append((b, beta))
                nbrs[b].append((a, beta))

    # households within district
    by_dist = {}
    for i, p in enumerate(rows):
        by_dist.setdefault(p["district"], []).append(i)
    for members in by_dist.values():
        rng.shuffle(members)
        k = 0
        while k < len(members):
            size = rng.choices(HH_SIZES, HH_WEIGHTS)[0]
            link(members[k:k + size], BETA_HOUSE)
            k += size

    # workplaces within district and occupation
    by_work = {}
    for i, p in enumerate(rows):
        if p["occupation"] in WORK_SIZE:
            by_work.setdefault((p["district"], p["occupation"]), []).append(i)
    for (d, occ), members in by_work.items():
        rng.shuffle(members)
        size = WORK_SIZE[occ]
        for k in range(0, len(members), size):
            link(members[k:k + size], BETA_WORK)

    # community: 3 within-district + 1 anywhere
    for i, p in enumerate(rows):
        pool = by_dist[p["district"]]
        for _ in range(3):
            j = pool[int(rng.random() * len(pool))]
            if j != i:
                nbrs[i].append((j, BETA_COMM))
                nbrs[j].append((i, BETA_COMM))
        j = int(rng.random() * n)
        if j != i:
            nbrs[i].append((j, BETA_COMM))
            nbrs[j].append((i, BETA_COMM))
    return nbrs


def run_epidemic(rows, nbrs, vaccinated, rng):
    """SIR. vaccinated is a set of indices with leaky protection."""
    n = len(rows)
    sus = [True] * n
    days_left = [0] * n
    snow = [i for i, p in enumerate(rows) if p["district"] == "Snow"]
    infectious = []
    for i in rng.sample(snow, N_SEEDS):
        sus[i] = False
        days_left[i] = INF_DAYS
        infectious.append(i)
    cases = set(infectious)

    for _ in range(T_DAYS):
        if not infectious:
            break
        new = []
        for i in infectious:
            for j, beta in nbrs[i]:
                if sus[j]:
                    p = beta * (1 - VAX_EFF) if j in vaccinated else beta
                    if rng.random() < p:
                        sus[j] = False
                        new.append(j)
        for j in new:
            days_left[j] = INF_DAYS
            cases.add(j)
        nxt = []
        for i in infectious:
            days_left[i] -= 1
            if days_left[i] > 0:
                nxt.append(i)
        infectious = nxt + new
    return cases


def experiment_b(rows):
    print()
    print("=" * 70)
    print("B. EPIDEMIC POLICY: what a trial sees vs what the town gets")
    print("=" * 70)
    rng = random.Random(PROTO_SEED + 1)
    nbrs = build_network(rows, rng)
    n = len(rows)
    deg = statistics.fmean(len(a) for a in nbrs)
    print(f"\nContact network: {n} residents, mean {deg:.1f} contacts each"
          "\n(households, workplaces, neighbourhood).")

    RUNS = 12
    base_runs, pol_runs, rr_runs = [], [], []
    for _ in range(RUNS):
        base_runs.append(len(run_epidemic(rows, nbrs, set(), rng)))
        vax = set(rng.sample(range(n), int(VAX_COVER * n)))
        cases = run_epidemic(rows, nbrs, vax, rng)
        pol_runs.append(len(cases))
        ar_v = len(cases & vax) / len(vax)
        unvax_n = n - len(vax)
        ar_u = len(cases - vax) / unvax_n
        if ar_u > 0:
            rr_runs.append(ar_v / ar_u)

    base = statistics.fmean(base_runs)
    pol = statistics.fmean(pol_runs)
    rr = statistics.fmean(rr_runs)
    print(f"\nBaseline epidemic (no vaccination), {RUNS} runs:"
          f" mean {base:.0f} cases ({100*base/n:.1f}% of the town).")
    print(f"\nVaccinate a random {int(100*VAX_COVER)}% (leaky efficacy"
          f" {int(100*VAX_EFF)}%). Inside that world, an individually"
          f"\nrandomized trial compares attack rates:")
    print(f"  vaccinated vs unvaccinated RR {rr:.2f}"
          f"  -> direct effect, about {100*(1-rr):.0f}% protection")

    projected = base * (1 - VAX_COVER * (1 - rr))
    print(f"\nProjection from the trial alone (direct effect only):"
          f"\n  expect about {projected:.0f} cases.")
    print(f"Simulated town with the policy actually in place:"
          f"\n  {pol:.0f} cases ({100*pol/n:.1f}% of the town).")
    averted_total = base - pol
    averted_direct = base - projected
    print(f"\nCases averted: {averted_total:.0f} in the simulation against"
          f" {averted_direct:.0f} the trial-based"
          f"\nprojection promises. The difference,"
          f" {averted_total-averted_direct:.0f} cases, is herd protection:"
          f"\nunvaccinated residents spared because their contacts were"
          " immune. An\nindividually randomized trial cannot see it, because"
          " both arms share one\nepidemic.")
    print("\nThe same machinery answers questions no trial design reaches:"
          "\nclose the Snow Pump, reopen the Vulcan Works, staff a second"
          " clinic,\nand compare the towns that follow.")


def main():
    rows = load_census()
    print(f"Loaded {len(rows)} residents from the published census.\n")
    experiment_a(rows)
    experiment_b(rows)


if __name__ == "__main__":
    main()
