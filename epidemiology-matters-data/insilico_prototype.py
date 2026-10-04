#!/usr/bin/env python3
"""
Farrlandia in silico experiments: a working prototype.

Two demonstrations, both run on the published census and the published
contact network (farrlandia-census.csv, farrlandia-contacts.csv):

  A. The trial nobody can run. Randomize smoking cessation among
     Farrlandia's smokers and follow them forward under the census's own
     data-generating process. Because the DGP is known, the trial's
     estimate can be checked against the exact causal truth, and both can
     be set against the confounded observational contrast.

  B. The question a trial answers incompletely. An agent-based
     SIR epidemic on the census's household / workplace / community
     network. An individually randomized vaccine trial inside the
     epidemic recovers the direct effect; only the two-world simulation
     reveals the indirect (herd) protection, which the trial-based
     projection misses.

Risk equations come from farrlandia_dgp.py, the same module the census
generator draws from, so simulation and census share one truth.

Deterministic: every run of this script prints the same numbers.
"""

import csv
import os
import random
import statistics

import farrlandia_dgp as dgp

HERE = os.path.dirname(os.path.abspath(__file__))
CENSUS_DIR = os.path.join(HERE, "..", "epidemiology-matters-site",
                          "farrlandia", "census")
CENSUS = os.path.join(CENSUS_DIR, "farrlandia-census.csv")
CONTACTS = os.path.join(CENSUS_DIR, "farrlandia-contacts.csv")

PROTO_SEED = 20280701


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
    p1_all = [dgp.cvd_prob(p, smoking=1) for p in rows]
    p0_all = [dgp.cvd_prob(p, smoking=0) for p in rows]
    true_rr_pop = (sum(p1_all) / len(rows)) / (sum(p0_all) / len(rows))
    print(f"\nTruth under the DGP (everyone smokes vs nobody smokes):")
    print(f"  marginal causal RR {true_rr_pop:.2f}"
          f"  (the gap from {r1/r0:.2f} is confounding)")

    # The trial population: current smokers. Truth for quitting among them.
    pairs = [(dgp.cvd_prob(p, smoking=1), dgp.cvd_prob(p, smoking=0))
             for p in smk]
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

BETA = {"household": 0.055, "workplace": 0.014, "community": 0.007}
INF_DAYS = 7
T_DAYS = 150
N_SEEDS = 10
VAX_COVER = 0.40
VAX_EFF = 0.70          # leaky: scales susceptibility


def load_network(rows):
    idx = {p["id"]: i for i, p in enumerate(rows)}
    nbrs = [[] for _ in rows]
    with open(CONTACTS, newline="") as f:
        for e in csv.DictReader(f):
            a, b = idx[int(e["person_a"])], idx[int(e["person_b"])]
            beta = BETA[e["layer"]]
            nbrs[a].append((b, beta))
            nbrs[b].append((a, beta))
    return nbrs


def run_epidemic(rows, nbrs, vaccinated, rng):
    """SIR. vaccinated is a set of indices with leaky protection."""
    sus = [True] * len(rows)
    days_left = [0] * len(rows)
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
    nbrs = load_network(rows)
    n = len(rows)
    deg = statistics.fmean(len(a) for a in nbrs)
    print(f"\nContact network: the published farrlandia-contacts.csv,"
          f"\n{n} residents, mean {deg:.1f} contacts each"
          " (household, workplace, community).")

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
    rows = dgp.load_census(CENSUS)
    print(f"Loaded {len(rows)} residents from the published census.\n")
    experiment_a(rows)
    experiment_b(rows)


if __name__ == "__main__":
    main()
