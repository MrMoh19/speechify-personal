********************************************************************************
* Study 3 (Chapter 4) - Trauma saturation, updated analysis
* Run on: /Users/mohammedabba-aji/Downloads/_Sorted/Spreadsheets & Data/merged.dta
* Mirrors projects/marvin-stress-trauma/analysis.py (Python port run 20 Sep 2026
* on the Box collaboration extract). Rename variables in the locals below to
* match merged.dta before running.
********************************************************************************

version 19.5
clear all
set more off
use "/Users/mohammedabba-aji/Downloads/_Sorted/Spreadsheets & Data/merged.dta", clear

*--- 0. Map variable names here (edit to match merged.dta) --------------------
local trauma   trauma_total          // total traumatic events, 0-12
local stress   stressor_count        // socioeconomic stressor count/scale
local pcl      pcl5_total
local phq      phq9_total
local gad      gad7_total
local wt       sampling_weight
local strata   strata               // state strata (1 benue ... 7 sokoto); use strata2 for state-x-setting
local psu      cluster_id           // community cluster ID
local covars   age_years i.gender i.education_level i.state_cat

* Study 3 is the five conflict-affected states: drop Ogun (strata==5)
drop if `strata' == 5

*--- 1. Outcomes and design ----------------------------------------------------
gen byte ptsd = `pcl'  >= 38 if !missing(`pcl')
gen byte dep  = `phq'  >= 10 if !missing(`phq')
gen byte anx  = `gad'  >= 10 if !missing(`gad')
gen byte ptsd33 = `pcl' >= 33 if !missing(`pcl')
gen byte dep15  = `phq' >= 15 if !missing(`phq')
gen byte anx7   = `gad' >= 7  if !missing(`gad')

capture confirm variable `wt'
if _rc gen `wt' = 1                  // equal weights if none in merged.dta
svyset `psu' [pweight=`wt'], strata(`strata') vce(linearized) singleunit(scaled)

*--- 2. Restricted cubic spline for trauma, knots at 0, 2, 5 -------------------
* Manual basis so margins can be evaluated at exact trauma values via at().
* s1 = (max(x,0)^3 - max(x-2,0)^3*5/3 + max(x-5,0)^3*2/3) / 25
gen double tr_s1 = (max(`trauma',0)^3 - max(`trauma'-2,0)^3*(5/3) ///
                    + max(`trauma'-5,0)^3*(2/3)) / 25

* stress_c and trauma_cat (0/1-2/3-4/5+) already exist in merged.dta;
* re-center stress_c after dropping Ogun so it is centered on the analytic sample
quietly summarize `stress'
capture drop stress_c
gen double stress_c = `stress' - r(mean)
local smean = r(mean)
local ssd   = r(sd)

*--- 3. Replication: original categorical specification (unadjusted) -----------
foreach y in ptsd dep anx {
    di as result _n "=== Replication (categorical, unadjusted): `y' ==="
    svy: poisson `y' i.trauma_cat##c.stress_c, irr
    * Stressor IRR within each trauma stratum
    forvalues k = 0/3 {
        if `k'==0 lincom stress_c, irr
        else      lincom stress_c + `k'.trauma_cat#c.stress_c, irr
    }
    testparm i.trauma_cat#c.stress_c        // interaction block
}

*--- 4. Primary: continuous spline trauma x stress, adjusted -------------------
foreach y in ptsd dep anx {
    di as result _n "=== Primary (spline, adjusted): `y' ==="
    svy: poisson `y' (c.`trauma' c.tr_s1)##c.`stress' `covars', irr
    testparm c.`trauma'#c.`stress' c.tr_s1#c.`stress'
    estimates store int_`y'

    * Predicted prevalence surface: trauma {0 1 2 3 5 7} x stress {0 2 4 6}
    * tr_s1 at each trauma value (same formula as above):
    * t=0:0  t=1:.04  t=2:.32  t=3:1.0133333  t=5:3.72  t=7:7.5466667
    margins, at(`trauma'=0 tr_s1=0         `stress'=(0 2 4 6)) ///
             at(`trauma'=1 tr_s1=.04       `stress'=(0 2 4 6)) ///
             at(`trauma'=2 tr_s1=.32       `stress'=(0 2 4 6)) ///
             at(`trauma'=3 tr_s1=1.0133333 `stress'=(0 2 4 6)) ///
             at(`trauma'=5 tr_s1=3.72      `stress'=(0 2 4 6)) ///
             at(`trauma'=7 tr_s1=7.5466667 `stress'=(0 2 4 6)) ///
             vce(unconditional)

    * Additive-scale contrasts: stress 4 vs 0 at trauma 0 and trauma 5
    margins, at(`trauma'=0 tr_s1=0    `stress'=(0 4)) ///
             at(`trauma'=5 tr_s1=3.72 `stress'=(0 4)) ///
             vce(unconditional) post
    lincom _b[2._at] - _b[1._at]     // RD, +4 stressors at trauma=0
    lincom _b[4._at] - _b[3._at]     // RD, +4 stressors at trauma=5
}

*--- 5. Sensitivity: alternative cutoffs ---------------------------------------
foreach y in ptsd33 dep15 anx7 {
    di as result _n "=== Sensitivity cutoff: `y' ==="
    quietly svy: poisson `y' (c.`trauma' c.tr_s1)##c.`stress' `covars', irr
    testparm c.`trauma'#c.`stress' c.tr_s1#c.`stress'
}

*--- 6. Sensitivity: continuous symptom scores (linear, design-based) ----------
foreach y in `pcl' `phq' `gad' {
    di as result _n "=== Sensitivity continuous: `y' ==="
    quietly svy: regress `y' (c.`trauma' c.tr_s1)##c.`stress' `covars'
    testparm c.`trauma'#c.`stress' c.tr_s1#c.`stress'
}

*--- 7. Per-SD stressor effect (for cross-scale comparability) -----------------
di as result _n "Stressor mean = `smean', SD = `ssd'; multiply log-IRRs by `ssd' for per-SD."
