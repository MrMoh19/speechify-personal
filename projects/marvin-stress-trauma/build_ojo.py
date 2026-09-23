import importlib.util
spec=importlib.util.spec_from_file_location("bf","build_full.py")
# reuse only the build() function: import module but skip its __main__-style builds by editing? build_full runs builds on import.
# simpler: redefine build here by exec of the function block
src=open('build_full.py').read()
head=src.split("# ---------------- Mohammed's deck ----------------")[0]
exec(head)

oj=[
{'n':"Thank the chair. I speak for the Federal Ministry of Health and Social Welfare: what happens to this evidence after the conference."},
{'t':"Nigeria's Policy Moment",'b':[
 "The Mental Health Act (2021) replaced the Lunacy Act of 1958 — a colonial custodial law — with a rights-based framework",
 ("Establishes [the Department/Desk of Mental Health]; mandates integration of mental health into primary health care",1),
 ("Provides for non-discrimination, consent, and community-based care; [mental health fund / budget provision]",1),
 "The Act tells us what to build. It does not tell us how much need exists, where it concentrates, or which services to put where",
 "That is the gap the MaRVIN partnership was designed to close"],
 'n':"For sixty-three years Nigeria's mental health law was the Lunacy Act of 1958 — custodial, colonial, silent on community care. The 2021 Act replaced it with a rights-based framework: primary care integration, community services, [the Department of Mental Health and the fund]. An Act is authority, not information. It cannot tell us how much need exists, where it sits, or which service belongs where. The ministry joined MaRVIN to answer exactly that."},
{'t':"Why the Ministry Co-Owned the Research",'b':[
 "Implementation planning was blocked by four missing pieces:",
 ("No locally validated screening instruments — so no defensible case definitions for planning",1),
 ("No population-based burden estimates — so no basis for allocation across states",1),
 ("No evidence on what drives the burden — trauma, displacement conditions, or both",1),
 ("No guidance on matching scarce services to need — ~250 psychiatrists for 200+ million people",1),
 "MaRVIN was designed with the Federal Ministry of Health and Social Welfare and AFENET from the first protocol, not handed over at the end"],
 'n':"The usual pipeline — researchers publish, ministries eventually read — takes years we do not have. We co-designed MaRVIN from the first protocol: the ministry's implementation questions shaped the instruments, the sampling, and the analysis. Four missing pieces blocked planning: validated tools, burden estimates, drivers, and a basis for matching services to need with a workforce of 250 psychiatrists."},
{'t':"What the Evidence Now Says — Four Findings",'b':[
 "1. The instruments work here — with local calibration: PCL-5 cut-point 38, not the international 33 (validated against psychiatrist interview)",
 "2. The burden is large and uneven: nearly 1 in 3 adults with at least one condition; 28-fold variation across states; burden clusters intensely by community (ICC up to 0.86)",
 "3. The displacement environment is its own driver: IDP camp residence carries 1.9–2.9-fold higher prevalence after accounting for trauma",
 "4. One program does not fit all: stress-linked risk is concentrated among those with limited trauma exposure; the heavily exposed need trauma-focused care regardless of circumstances"],
 'n':"Four findings, in the order you heard them today. The instruments work, but only with local calibration — the wrong cut-point would misplan the entire response. The burden is enormous and concentrated — by state and, more sharply, by community. The camp environment drives risk beyond the trauma count. And the saturation finding: services must be matched to trauma history, not delivered uniformly."},
{'t':"From Each Finding to an Implementation Lever",'table':[
 ["Evidence","Policy lever under the Act"],
 ["Validated instruments, local cut-points","National screening standard for PHC and task-shared programs [adopt into [national guidelines]]"],
 ["Burden maps: state and community variation","Needs-based allocation to states and LGAs; community-level targeting, not blanket coverage"],
 ["Camp environment as independent driver","Joint action with humanitarian and displacement authorities — shelter, safety, livelihoods as mental health policy"],
 ["Trauma saturation → stratified need","Two-tier service model: scalable stress/livelihood support in PHC; trauma-focused referral capacity for the heavily exposed"]],
 'n':"Each finding maps to a lever. The validation gives us a defensible national screening standard. The burden maps give us an allocation formula — need varies 28-fold, so budgets should not be uniform. The camp finding takes mental health policy beyond the health sector, into how camps are run. And saturation gives the service model: a broad scalable tier in primary care, and a specialist trauma-focused tier with clear referral pathways."},
{'t':"Implementation Vehicles",'b':[
 "[Integration of the validated screening battery into PHC service protocols / mhGAP adaptation]",
 "[Task-sharing: training curriculum for community health workers — the 36-item battery is deliverable by lay workers]",
 "[State mental health desks / coordinators in the six study states first, then scale]",
 "[Financing: [mental health budget line / NHIA benefit package inclusion]]",
 "[Surveillance: repeating the MaRVIN protocol as a periodic national mental health survey]",
 "Timeline: [Dr. Ojo to supply milestones]"],
 'n':"[This slide is Dr. Ojo's to fill with the ministry's actual vehicles and dates — the draft names the plausible set: screening standards into PHC protocols, task-sharing curricula, state desks, financing through the budget line or NHIA package, and MaRVIN as the baseline wave of a recurring national surveillance instrument.]"},
{'t':"What the Workforce Numbers Require",'b':[
 "~0.6 mental health workers per 100,000 population against a WHO benchmark of 5.0; one psychiatrist per ~800,000 Nigerians",
 "Specialist care cannot reach the 1 in 3 — and the evidence says it does not need to",
 "Tier 1 (the many, limited trauma exposure): task-shared stress management, livelihood-linked psychosocial support, delivered in PHC and community settings",
 "Tier 2 (the few, extensive exposure): trauma-focused therapies through trained specialist and supervised non-specialist providers; referral triggered by brief trauma-history screening",
 "The validated instruments make triage by lay workers feasible"],
 'n':"With one psychiatrist per 800,000 people, the only honest plan is task-sharing — and the saturation evidence tells us it is also the right plan. Most of the affected population retains stress sensitivity and can be served by scalable, task-shared support in primary care. The smaller heavily-exposed group needs trauma-focused care, which is where scarce specialist capacity belongs. A brief trauma-history screen — feasible for lay workers with these validated tools — is the triage."},
{'t':"A Working Model Other Settings Can Copy",'b':[
 "Ministry co-ownership from protocol design shortened the evidence-to-policy pipeline from years to months",
 "Validation → surveillance → mechanism → implementation, as one program of work with one government partner",
 "The approach is transferable to other conflict-affected settings: the instruments, the sampling design in insecure areas, and the partnership structure",
 "What we ask of this room: [research partnership on the longitudinal and intervention questions]; [technical support for surveillance institutionalization]; [financing partners for the two-tier scale-up]"],
 'n':"Close on three notes. First, the model: a ministry inside the research from day one turns a four-paper symposium into an implementation plan — other conflict-affected countries can copy the structure. Second, the commitments you saw two slides ago — [Dr. Ojo restates the two or three he owns]. Third, the ask: partners for the longitudinal and intervention trials the saturation finding demands, technical support to institutionalize surveillance, and financing for the two-tier scale-up. The evidence exists. The law exists. The remaining work is implementation, and that is the ministry's job — with your partnership."},
{'t':"Conclusions",'b':[
 "Nigeria now has what implementation of the Mental Health Act (2021) was missing: validated instruments, population burden estimates, and evidence on who needs which service",
 "The response must be as structured as the evidence: locally calibrated screening, needs-based allocation, camp-environment action, and a two-tier service model",
 "The MaRVIN partnership shows a ministry co-owning research is the fastest route from measurement to policy",
 "Thank you — on behalf of the Federal Ministry of Health and Social Welfare"],
 'n':"To conclude: the Act gave us the mandate; MaRVIN gave us the map. Screening standards, needs-based allocation, action on the camp environment, and a two-tier service model — that is the implementation agenda. Thank you, and thank you to the study communities, AFENET, and the research team."},
]
n=build('istss_ojo_policy.pptx',
 "From Evidence to Action: Translating MaRVIN Study Findings Into Policy Implementation Under Nigeria's 2021 Mental Health Act",
 ["Tunde MasseyFerguson Ojo, MBBS, MSc, FMCPsych",
  ("Federal Ministry of Health and Social Welfare, Nigeria · University of Abuja",14),
  ("ISTSS 42nd Annual Meeting · San Antonio, TX · September 24, 2026",13)],
 "Tunde MasseyFerguson Ojo", oj)
print(n)
