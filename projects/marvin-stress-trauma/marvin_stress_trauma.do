********************************************************************************
* Study 3 (Chapter 4) - Trauma saturation, updated analysis
* Data: Marvin_1_Feb_2026_cleaned.dta (six states, Ogun = non-conflict comparison)
* Mirrors projects/marvin-stress-trauma/analysis.py (Python port run 20 Sep 2026
* on the Box collaboration extract). Rename variables in the locals below to
* match merged.dta before running.
********************************************************************************

version 19.5
clear all
set more off
capture log close
log using "/Users/mohammedabba-aji/Downloads/_Sorted/Spreadsheets & Data/study3_trauma_saturation.log", replace text
use "/Users/mohammedabba-aji/Downloads/_Sorted/Spreadsheets & Data/Marvin_1_Feb_2026_cleaned.dta", clear

*--- 0. Map variable names here (edit to match merged.dta) --------------------
local trauma   trauma_total          // total traumatic events, 0-12
local stress   stressor_count        // socioeconomic stressor count/scale
local pcl      pcl5_total
local phq      phq9_total
local gad      gad7_total
local wt       sampling_weight
local strata   strata               // state strata (1 benue ... 7 sokoto); use strata2 for state-x-setting
local psu      cluster_id           // community cluster ID
local covars   age i.gender i.education i.state_cat

* Primary sample: all six states (Ogun = non-conflict comparison state).
* Sensitivity: five conflict-affected states only — set the local below to 1.
local five_state_only 0
if `five_state_only' drop if `strata' == 5

* Trauma count hygiene: pure refusals are missing, not zero
egen tt_check = rowtotal(traumatic_eventsNaturaldisaste traumatic_eventsLifethreatenin ///
    traumatic_eventsSevereHumanSu traumatic_eventsOtherverystre traumatic_eventsFireorexplosi ///
    traumatic_eventsTransportation traumatic_eventsSeriousacciden traumatic_eventsExposuretoat ///
    traumatic_eventsPhysicalassaul traumatic_eventsAssaultwitha traumatic_eventsSexualassault ///
    traumatic_eventsExposuretoarm)
assert tt_check == `trauma'
replace `trauma' = . if traumatic_eventsPrefernottoa==1 & traumatic_eventsNoneoftheabo==0 & tt_check==0
drop tt_check

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

* Rebuild trauma_cat from the corrected count (dataset version predates the refusal fix)
capture drop trauma_cat
gen trauma_cat = 0 if `trauma'==0
replace trauma_cat = 1 if inrange(`trauma',1,2)
replace trauma_cat = 2 if inrange(`trauma',3,4)
replace trauma_cat = 3 if `trauma'>=5 & !missing(`trauma')
label define traumcat2 0 "None" 1 "1-2 events" 2 "3-4 events" 3 "5+ events", replace
label values trauma_cat traumcat2

* re-center stress_c on the analytic sample
quietly summarize `stress'
capture drop stress_c
gen double stress_c = `stress' - r(mean)
local smean = r(mean)
local ssd   = r(sd)

*--- 3. Secondary: categorical specification (adjusted; unadjusted = sensitivity)
foreach y in ptsd dep anx {
    di as result _n "=== Replication (categorical, unadjusted): `y' ==="
    svy: poisson `y' i.trauma_cat##c.stress_c `covars', irr
    * Stressor IRR within each trauma stratum
    forvalues k = 0/3 {
        if `k'==0 lincom stress_c, irr
        else      lincom stress_c + `k'.trauma_cat#c.stress_c, irr
    }
    testparm i.trauma_cat#c.stress_c        // interaction block
}

*--- 3b. Sensitivity: categorical, unadjusted (dissertation specification) -----
foreach y in ptsd dep anx {
    di as result _n "=== Categorical (unadjusted sensitivity): `y' ==="
    quietly svy: poisson `y' i.trauma_cat##c.stress_c, irr
    forvalues k = 0/3 {
        if `k'==0 lincom stress_c, irr
        else      lincom stress_c + `k'.trauma_cat#c.stress_c, irr
    }
    testparm i.trauma_cat#c.stress_c
}

*--- 4. Primary: continuous spline trauma x stress, adjusted -------------------
foreach y in ptsd dep anx {
    di as result _n "=== Primary (spline, adjusted): `y' ==="
    svy: poisson `y' (c.`trauma' c.tr_s1)##c.`stress' `covars', irr
    testparm c.`trauma'#c.`stress' c.tr_s1#c.`stress'
    estimates store int_`y'

    * Predicted prevalence surface: trauma {0 1 2 3 5 7} x stress {0 2 4 6}
    * tr_s1 at each trauma value (same formula as above):
    * t=0:0  t=1:.04  t=2:.32  t=3:1.0133333  t=5:3.2  t=7:5.6
    margins, at(`trauma'=0 tr_s1=0         `stress'=(0 2 4 6)) ///
             at(`trauma'=1 tr_s1=.04       `stress'=(0 2 4 6)) ///
             at(`trauma'=2 tr_s1=.32       `stress'=(0 2 4 6)) ///
             at(`trauma'=3 tr_s1=1.0133333 `stress'=(0 2 4 6)) ///
             at(`trauma'=5 tr_s1=3.2      `stress'=(0 2 4 6)) ///
             at(`trauma'=7 tr_s1=5.6 `stress'=(0 2 4 6)) ///
             vce(unconditional)

    * Additive-scale contrasts: stress 4 vs 0 at trauma 0 and trauma 5
    margins, at(`trauma'=0 tr_s1=0    `stress'=(0 4)) ///
             at(`trauma'=5 tr_s1=3.2 `stress'=(0 4)) ///
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

*--- Figure: per-stressor IRR along the trauma curve (run after PTSD model) ---
capture frame drop splinefig
frame create splinefig t irr lo hi
forvalues i = 0/16 {
    local t = `i'/2
    local s1 = (max(`t',0)^3 - max(`t'-2,0)^3*(5/3) + max(`t'-5,0)^3*(2/3))/25
    quietly lincom stressor_count + `t'*c.trauma_total#c.stressor_count ///
        + `s1'*c.tr_s1#c.stressor_count
    frame post splinefig (`t') (exp(r(estimate))) ///
        (exp(r(estimate)-invttail(r(df),.025)*r(se))) ///
        (exp(r(estimate)+invttail(r(df),.025)*r(se)))
}
frame splinefig {
    gen cx=. 
    gen cy=. 
    gen cl=. 
    gen ch=.
    replace cx=0 in 1
    replace cy=1.97 in 1
    replace cl=1.53 in 1
    replace ch=2.54 in 1
    replace cx=1.5 in 2
    replace cy=1.26 in 2
    replace cl=1.06 in 2
    replace ch=1.50 in 2
    replace cx=3.5 in 3
    replace cy=1.03 in 3
    replace cl=0.87 in 3
    replace ch=1.21 in 3
    replace cx=5.5 in 4
    replace cy=0.92 in 4
    replace cl=0.83 in 4
    replace ch=1.03 in 4
    twoway (rarea lo hi t, color("62 111 165%18") lwidth(none)) ///
           (line irr t, lcolor("30 58 92") lwidth(medthick)) ///
           (rcap cl ch cx, lcolor("200 16 46") lwidth(medium)) ///
           (scatter cy cx, mcolor("200 16 46") msize(medium) mlcolor(white) mlwidth(vthin)), ///
        yline(1, lpattern(dash) lcolor(gs8)) ///
        ytitle("Prevalence ratio per additional stressor (PTSD)") ///
        xtitle("Traumatic event types (count)") ///
        ylabel(0.75(0.25)2.5, angle(0) grid glcolor(gs15)) xlabel(0(1)8) ///
        yscale(range(0.6 2.7)) ///
        legend(order(2 "Spline estimate (adjusted), 95% CI" 4 "Categorical estimates (95% CI)") ///
               position(1) ring(0) cols(1) region(lstyle(none))) ///
        title("Stressor effect declines smoothly along the trauma curve", size(medium) position(11)) ///
        graphregion(color(white)) plotregion(margin(small))
    graph export "spline_effect_stata.png", width(2400) replace
}

log close
