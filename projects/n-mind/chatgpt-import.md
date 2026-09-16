# N-MIND — imported working notes (ChatGPT thread, saved 2026-09-16)

Source: shared ChatGPT conversation provided by Mohammed. Raw message texts in original order; image attachments omitted.

Dear colleagues,

Please find attached the N-MIND FNPH Records and Pharmacy Readiness Form.

My apologies for not getting back to you earlier. I had initially intended to send the full patient-level data extraction form. However, I decided that we should first complete this readiness assessment while awaiting ethical clearance.

The form will help us understand what information is available in the hospital records, EHR and pharmacy systems; how it is recorded; whether it can be linked and exported; and what aggregate summary data are available.

Staff may consult relevant records and systems within their authorized hospital roles. However, please do not enter patient names, hospital numbers, NINs or other direct identifiers into this workbook.

Once ethical clearance and the necessary institutional approvals are obtained, we will circulate the patient-level extraction form and begin the main data extraction.

Thank you for your patience and support.

Best regards,  
Mohammed

---

:::writing{variant="email" id="38417" subject="N-MIND FNPH Records and Pharmacy Readiness Form"}
Dear colleagues,

Please find attached the N-MIND FNPH Records and Pharmacy Readiness Form.

My apologies for not getting back to you earlier. I had initially intended to send the full patient-level data extraction form. However, I decided that we should first complete this readiness assessment while awaiting ethical clearance.

The form will help us understand what information is available in the hospital records, EHR and pharmacy systems; how it is recorded; whether it can be linked and exported; and what aggregate summary data are available.

Staff may consult relevant records and systems within their authorized hospital roles. However, please do not enter patient names, hospital numbers, NINs or other direct identifiers into this workbook.

Once ethical clearance and the necessary institutional approvals are obtained, we will circulate the patient-level extraction form and begin the main data extraction.

Thank you for your patience and support.

Best regards,  
Mohammed
:::

---

Now draft an email to say here is this. And apologize for not getting back to them earlier,I had intended to send an extraction form but I decided to send this first until we get ethical clearance before we start getting patient level data.

---

Updated. Staff may now consult patient folders, prescriptions, EHR screens, and authorized queries. The only restriction retained is not entering direct identifiers into the returned workbook.

[N-MIND FNPH Records and Pharmacy Readiness Forms v0.3.xlsx](sandbox:/workspace/scratch/3a956ac2f1d0/outputs/nmind_authorized_forms_20260816/N-MIND_FNPH_Records_and_Pharmacy_Readiness_Forms_v0.3.xlsx)

---

{"plan":[{"step":"Identify permission-related stop clauses and restrictive wording","status":"completed"},{"step":"Revise the workbook for authorized Records and Pharmacy staff","status":"completed"},{"step":"Rebuild, render, and verify all sheets and formulas","status":"completed"},{"step":"Save the revised workbook as the next version of the existing file","status":"completed"}],"explanation":"The workbook now assumes authorized hospital access while retaining data-minimization safeguards for the returned file."}

---

bash -lc /bin/bash -lc "python3 /root/.codex/plugins/cache/openai-curated-remote/openai-library/0.1.46/skills/library/scripts/library_file_transfer.py apply-xattrs /workspace/scratch/3a956ac2f1d0/outputs/nmind_authorized_forms_20260816/N-MIND_FNPH_Records_and_Pharmacy_Readiness_Forms_v0.3.xlsx libfile_cea2f9d0a5e48191ad26845450f35977 <<'JSON'
[{\"name\":\"user.library-file-version\",\"value\":\"1\"}]
JSON"

---

The revised wording is complete and verified. All “STOP,” “do not open,” “requires approval,” and similar restrictions have been removed; the workbook now explicitly permits authorized record review and EHR queries. I’m saving the updated version.

---

I found the issue throughout the workbook, not just on the first page. I’m replacing the blanket prohibitions with one clear instruction: staff may review records and run queries within their hospital role, but the returned workbook should contain only system information and aggregate findings—not direct identifiers.

---

{"plan":[{"step":"Identify permission-related stop clauses and restrictive wording","status":"in_progress"},{"step":"Revise the workbook for authorized Records and Pharmacy staff","status":"pending"},{"step":"Rebuild, render, and verify all sheets and formulas","status":"pending"},{"step":"Save the revised workbook as the next version of the existing file","status":"pending"}]}

---

I’ll revise the workbook for authorized hospital staff: they may consult patient folders, pharmacy records, and the EHR as permitted by the hospital. I’ll retain only the essential rule that direct patient identifiers must not be entered into the workbook being returned. I’m using the spreadsheet and file-saving workflows to update and verify it.

---

Let’s remove things like “if this requires opening a patient folder. STOP” and other similar clauses, this is going to people that have permission to open it

---

You’re right. I rebuilt it as a plain-language, site-facing workbook:

- Separate forms for the Records Officer and Pharmacist.
- Clear instructions on what they may use now.
- A prominent stop rule: do not open patient files or run patient-level queries.
- Optional routine aggregate totals only with management permission.
- No fields for names, hospital numbers, diagnoses, prescriptions, or other patient-level information.

This is a pre-ethics readiness assessment—not the later research extraction workbook.

[Download the simplified FNPH Records and Pharmacy Forms](sandbox:/workspace/scratch/3a956ac2f1d0/outputs/nmind_site_forms_20260815/N-MIND_FNPH_Pre-Ethics_Records_and_Pharmacy_Forms_v0.2.xlsx)

---

{"plan":[{"step":"Redesign the workbook around the Records and Pharmacy staff workflows","status":"completed"},{"step":"Build the plain-language site forms and pre-ethics safety controls","status":"completed"},{"step":"Render and verify every sheet, formulas, and workbook integrity","status":"completed"},{"step":"Save the final site-facing workbook","status":"completed"}],"explanation":"The complex coordinating-centre schema was converted into a plain six-sheet pre-ethics workbook for FNPH Records and Pharmacy staff, then visually and technically verified."}

---

bash -lc /bin/bash -lc 'python3 /root/.codex/plugins/cache/openai-curated-remote/openai-library/0.1.46/skills/library/scripts/library_file_transfer.py apply-xattrs /workspace/scratch/3a956ac2f1d0/outputs/nmind_site_forms_20260815/N-MIND_FNPH_Pre-Ethics_Records_and_Pharmacy_Forms_v0.2.xlsx libfile_cea2f9d0a5e48191ad26845450f35977'

---

The final check passed: the workbook opens cleanly, all six sheets are present, the safety formulas work, and no formula errors were found. I’m saving the simplified site-facing version now.

---

bash -lc /bin/bash -lc 'montage /tmp/nmind_site_forms_20260815/previews/*.png -thumbnail 900x650 -tile 2x3 -geometry +16+16 /tmp/nmind_site_forms_20260815/contact_final.png'

---

You’re right—the site team should see simple role-based questions, not a research database schema. I’ve rebuilt it as two plain forms—one for Records and one for Pharmacy—and I’m doing the final visual check now.

---

The simplified forms are much clearer. I’m making one last usability pass: fixing the cramped site-identification block, correcting the completion counters, and reducing the optional totals sheet so staff do not face an unnecessarily wide table.

---

{"plan":[{"step":"Redesign the workbook around the Records Officer and Pharmacist workflows","status":"in_progress"},{"step":"Build the plain-language site forms with dropdowns and safety boundaries","status":"pending"},{"step":"Verify every sheet visually and test formulas/validation","status":"pending"},{"step":"Save the simplified site workbook to Library","status":"pending"}]}

---

bash -lc /bin/bash -lc 'cat /root/.codex/skills/builtins/spreadsheets/SKILL.md && cat /root/.codex/skills/builtins/spreadsheets/style_guidelines.md && cat /root/.codex/skills/builtins/spreadsheets/artifact_tool_docs/API_QUICK_START.md && cat /root/.codex/skills/builtins/spreadsheets/domain_guidance/healthcare.md && cat /root/.codex/skills/builtins/spreadsheets/domain_guidance/scientific_research.md && cat /root/.codex/plugins/cache/openai-curated-remote/openai-library/0.1.46/skills/library/SKILL.md'

---

You’re right. The workbook was built for the coordinating team, not for the people who actually need to answer it. I’ll replace the site-facing version with a short, plain-language workbook: one “Start Here” page, one form for Records, one for Pharmacy, and a brief definitions page. The technical data dictionary will stay out of their way.

---

Completed and saved to your Library.

It includes system inventories, field-availability assessments, export capability, authorized aggregate reporting, governance readiness, dropdown validation, QC flags, and synthetic examples. Patient-level extraction tables were excluded.

[N-MIND FNPH Pre-Ethics Site Readiness Workbook v0.1.xlsx](sandbox:/workspace/scratch/3a956ac2f1d0/outputs/nmind_preethics_20260815/N-MIND_FNPH_Pre-Ethics_Site_Readiness_Workbook_v0.1.xlsx)

---

{"plan":[{"step":"Inspect the existing N-MIND workbook and preserve its visual conventions","status":"completed"},{"step":"Build the separate pre-ethics site-readiness workbook with guarded content and validation","status":"completed"},{"step":"Verify formulas, restrictions, and visual layout across all sheets","status":"completed"},{"step":"Save the final workbook to Library and deliver it","status":"completed"}]}

---

bash -lc /bin/bash -lc "python3 /root/.codex/plugins/cache/openai-curated-remote/openai-library/0.1.46/skills/library/scripts/library_file_transfer.py apply-xattrs /workspace/scratch/3a956ac2f1d0/outputs/nmind_preethics_20260815/N-MIND_FNPH_Pre-Ethics_Site_Readiness_Workbook_v0.1.xlsx libfile_940ba09bcf5481918de1f8930a0efeca <<'JSON'
[{\"name\":\"user.library-file-version\",\"value\":\"0\"}]
JSON"

---

The workbook is complete and verified. It excludes patient-level extraction tables entirely, includes the existing-routine-aggregate safeguard and QC flag, and carries the pre-ethics warning on every working sheet. I’m saving the final file to your Library.

---

{"plan":[{"step":"Inspect the existing N-MIND workbook and preserve its visual conventions","status":"completed"},{"step":"Build the separate pre-ethics site-readiness workbook with guarded content and validation","status":"completed"},{"step":"Verify formulas, restrictions, and visual layout across all sheets","status":"completed"},{"step":"Save the final workbook to Library and deliver it","status":"in_progress"}],"explanation":"The separate pre-ethics workbook has been built and verified across all 13 sheets. It contains only system-level readiness fields, authorized aggregate-report fields, governance preparation, and synthetic examples; no real patient-entry tables are included."}

---

The first visual pass is clean. I identified one data-quality issue in the readiness tables: the proposed source name and the source department were sharing a column. I’m separating them so dropdown values remain valid and sites can distinguish “Health Records” from a specific EHR/register.

---

bash -lc /bin/bash -lc 'montage /tmp/nmind_preethics_20260815/final_previews/*.png -thumbnail 700x420 -tile 2x7 -geometry +12+12 /tmp/nmind_preethics_20260815/final_contact.png && ls -lh /workspace/scratch/3a956ac2f1d0/outputs/nmind_preethics_20260815/N-MIND_FNPH_Pre-Ethics_Site_Readiness_Workbook_v0.1.xlsx /tmp/nmind_preethics_20260815/final_contact.png'

---

bash -lc /bin/bash -lc 'node /root/.codex/skills/builtins/spreadsheets/container_tools/mark_artifact_operation_started.mjs --operation-kind create --expected-output-count 1 --output-format xlsx'

---

bash -lc /bin/bash -lc 'node container_tools/mark_artifact_operation_started.mjs --operation-kind create --expected-output-count 1 --output-format xlsx'

---

I found the original workbook and am preserving its navy-header, pale-yellow input convention. The new version will contain no real patient-entry tables; instead, it will let Records, Pharmacy, Laboratory, Outcomes and EHR staff assess each proposed field without opening charts or running patient-level queries.

---

{"plan":[{"step":"Inspect the existing N-MIND workbook and preserve its visual conventions","status":"completed"},{"step":"Build the separate pre-ethics site-readiness workbook with guarded content and validation","status":"in_progress"},{"step":"Verify formulas, restrictions, and visual layout across all sheets","status":"pending"},{"step":"Save the final workbook to Library and deliver it","status":"pending"}]}

---

bash -lc /bin/bash -lc 'montage /tmp/nmind_preethics_20260815/existing_previews/*.png -thumbnail 600x400 -tile 2x5 -geometry +10+10 /tmp/nmind_preethics_20260815/existing_contact.png'

---

bash -lc /bin/bash -lc "find /tmp/nmind_preethics_20260815/existing_previews -maxdepth 1 -type f -name '*.png' -print | sort && command -v montage || true"

---

bash -lc /bin/bash -lc 'ls -l /tmp/nmind_preethics_20260815/inspect_existing.mjs && "$CODEX_PRIMARY_RUNTIME_NODE" /tmp/nmind_preethics_20260815/inspect_existing.mjs'

---

bash -lc /bin/bash -lc 'mkdir -p /tmp/nmind_preethics_20260815 && ln -sfn "$CODEX_PRIMARY_RUNTIME_NODE_MODULES" /tmp/nmind_preethics_20260815/node_modules'

---

bash -lc /bin/bash -lc "sed -n '1,260p' /root/.codex/skills/builtins/spreadsheets/style_guidelines.md && cat /root/.codex/skills/builtins/spreadsheets/artifact_tool_docs/API_QUICK_START.md && sed -n '1,260p' /root/.codex/skills/builtins/spreadsheets/domain_guidance/healthcare.md && sed -n '1,260p' /root/.codex/skills/builtins/spreadsheets/domain_guidance/scientific_research.md"

---

bash -lc /bin/bash -lc 'skill_md_path="/root/.codex/plugins/cache/openai-curated-remote/openai-library/0.1.46/skills/library/SKILL.md"; python3 "$(dirname "$skill_md_path")/scripts/library_download.py" '"'{\"api_tool_source\":\"files/search\",\"results\":[{\"read_locator\":null,\"result_index\":0,\"result_id\":\"library:libfile_b4a58f46cc748191b93b2f0f8da7220e:0\",\"file_id\":\"file_000000009edc81f5b5d12baf653f5bf3\",\"version_id\":\"1\",\"library_file_id\":\"libfile_b4a58f46cc748191b93b2f0f8da7220e\",\"name\":\"N-MIND_FNPH_Data_Extraction_Workbook.xlsx\",\"mime_type\":\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\",\"score\":null,\"snippets\":[],\"locators\":[],\"document_chunk_id\":null,\"created_at\":\"2026-07-22T21:05:37.489925Z\",\"modified_at\":\"2026-07-23T03:07:33.691051Z\",\"size_bytes\":121225,\"image_taken_at\":null,\"image_location\":null,\"surface\":\"library\",\"metadata\":{\"id\":\"file_000000009edc81f5b5d12baf653f5bf3\",\"kind\":\"file\",\"name\":\"N-MIND_FNPH_Data_Extraction_Workbook.xlsx\",\"path\":\"/N-MIND_FNPH_Data_Extraction_Workbook.xlsx\",\"file_id\":\"file_000000009edc81f5b5d12baf653f5bf3\",\"library_file_id\":\"libfile_b4a58f46cc748191b93b2f0f8da7220e\",\"library_artifact_type\":null,\"version_id\":\"1\",\"mime_type\":\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\",\"size_bytes\":121225,\"created_at\":\"2026-07-22T21:05:37.489925Z\",\"modified_at\":\"2026-07-23T03:07:33.691051Z\",\"model_generated\":true,\"surface\":\"library\"},\"match_source\":\"library_metadata_filename\"}],\"retrieval_title_results\":[],\"next_cursor\":null,\"warnings\":[],\"external_connectors_accessed\":false}' '000' 'downloads'"

---

bash -lc /bin/bash -lc "sed -n '1,260p' /root/.codex/skills/builtins/spreadsheets/SKILL.md && sed -n '1,220p' /root/.codex/plugins/cache/openai-curated-remote/openai-library/0.1.46/skills/library/SKILL.md && sed -n '1,180p' /root/.codex/skills/oai/personal-context/SKILL.md"

---

I’ll build the pre-ethics site-readiness workbook as a separate, safe-to-share version—restricted to system-level feasibility information, synthetic examples, and governance preparation, with patient-level sheets locked and clearly marked against real-data entry. I’m using the spreadsheet and Library workflows because this continues the existing N‑MIND workbook and produces a reusable Excel artifact.

---

Yes. We can send a **pre-ethics site-readiness package**. The key rule is:

> Sharing an empty workbook for review is acceptable; asking staff to open records and populate it is research activity.

### What we can safely send now

- Empty extraction workbook and codebook
- Read Me and proposed variable definitions
- Facility-code assignment
- Blank Site Setup sheet
- Synthetic example records clearly labelled “fictional”
- Draft extraction SOP
- Data-governance and tiered-sharing framework
- Draft protocol, DSA and HREC documents
- A system-level feasibility questionnaire asking:
  - EHR/pharmacy system name
  - Available modules
  - ICD-10/11 usage
  - Years of electronic coverage
  - Whether fields are structured or free text
  - Available export formats
  - Whether pharmacy reports are patient-linked
  - Whether stockouts are recorded
  - Existing routine aggregate reports
  - Staff responsible for each data source

Department heads can answer these based on operational knowledge, manuals, report menus and data dictionaries—without opening individual patient records.

### What they may provide before HREC approval

With hospital administrative permission:

- EHR and pharmacy data dictionaries
- Blank screenshots or report templates
- Existing hospital-wide aggregate reports
- Routine stock totals, such as total fluphenazine ampoules used over six months
- Approximate annual admissions or visits, if already reported routinely
- Retention periods and electronic coverage dates
- Information about database architecture and export capability
- Comments on whether each proposed field is routinely collected

No cell should identify a patient or describe a small, recognizable subgroup.

### What must wait

- Reviewing even a sample of 20 patient files
- Entering hospital numbers into the Key Log
- Generating study patient IDs from real patients
- Extracting pseudonymized row-level data
- Testing linkage across modules using real patients
- Hashing NIN or generating linkage tokens
- Running patient-level EHR queries
- Creating new research-specific counts from identifiable records
- Transferring dates, diagnoses, medications or outcomes
- Staff interviews or surveys intended for publication

Nigeria’s National Code states that health research intended to contribute to generalizable knowledge falls under ethics oversight. Importantly, investigators cannot independently declare a project exempt—the HREC determines exemption after receiving a proposal or written summary. [National Code of Health Research Ethics](https://healthresearchwebafrica.org.za/files/NCHRECurrentVersion.pdf)

### Recommended workbook solution

Create a separate **“N-MIND Pre-Ethics Site Readiness Workbook”** containing:

1. Read Me  
2. Site Setup  
3. EHR System Inventory  
4. Records Field Availability  
5. Pharmacy Field Availability  
6. Laboratory Field Availability  
7. Outcomes Field Availability  
8. Data Export Capability  
9. Governance Readiness  
10. Codebook  
11. Synthetic Examples  

The patient-level extraction sheets can be visible for review but locked and watermarked:

**PLANNING COPY — DO NOT ENTER PATIENT DATA BEFORE HREC AND INSTITUTIONAL APPROVAL**

This allows us to assess feasibility and prepare the protocol without prematurely beginning the study. We should also submit a short feasibility summary to the coordinating HREC and request a formal determination before any site runs new queries against patient records.

---

I’ll separate what can be sent for planning from what would constitute data access or research activity. The safe boundary is important here: sharing an empty tool is different from asking staff to open records and populate it.

---

https://health.gov.ng/opening-remarks-by-the-honourable-minister-of-state-for-health-and-social-welfare-dr-iziaq-adekunle-salako-delivered-at-the-national-council-on-health-nch-2025/

---

https://health.gov.ng/opening-speech-by-dr-iziaq-adekunle-salako-minister-of-state-for-health-and-social-welfare-delivered-at-the-himss-eurasia-healthtech-conference-exhibition-held-at-the-susesi-luxury-resort-bel/

---

https://health.gov.ng/speech-by-dr-iziaq-adekunle-salako-minister-of-state-for-health-and-social-welfare-delivered-at-the-44th-scientific-conference-and-annual-general-meeting-of-the-association-of-health-record-and-info/

---

https://www.researchgate.net/publication/394393744_Assessment_of_Compliance_with_Data_Protection_and_Privacy_Regulations_in_the_Nigeria_Healthcare_Sector

---

Overall, the decisions are strong. They convert the workbook from a collection of extraction sheets into a governed, linkable research-data model suitable for a national cohort. I would implement all nine items, with several refinements before building.

### Important refinements

1. **Use a Patient Registry as the referential spine**

Patient-level IDs in Pharmacy, Encounters, Outcomes, Laboratory Results and Treatment Context should be checked against a dedicated `Patient Registry`, not only Records Extraction.

Records currently represents an index hospitalization. A patient treated only as an outpatient could legitimately appear in Pharmacy or Outcomes without an index admission. The Patient Registry should contain one row per study patient:

- `facility_code`
- `study_patient_id`
- `birth_year`
- `sex_at_birth`
- `state_of_residence`
- `transferred_from_id`
- `linkage_token`
- `linkage_token_version`
- `registry_date`
- `source_system`
- `active_at_site`

Records Extraction then remains one row per index hospitalization or episode.

2. **Do not generate linkage tokens inside Excel**

A salted SHA-256 hash is not the best protection for a structured identifier such as NIN. A non-secret salt does not prevent enumeration attacks. Prefer:

`HMAC-SHA-256(standardized NIN, centrally controlled secret key)`

The workbook should receive only the resulting token. It should never contain:

- Raw NIN
- The secret key
- A token-generation formula
- A temporary NIN entry field

Add `linkage_token_version`, so the method or key can be rotated without mixing token generations. The linkage process should have a separate SOP and DPIA. Given the sensitivity of psychiatric information and national identifiers, the DPIA should precede Tier 3 linkage processing; the NDPC specifically identifies its 2025 implementation directive and Schedule IV as relevant to DPIAs. [NDPC DPIA guidance announcement](https://www.ndpc.gov.ng/2025/03/28/dial-seeks-ndpc-partnership-for-data-privacy-impact-assessments/) and [Nigeria Data Protection Act](https://www.ndpc.gov.ng/ndp-act-2023/).

3. **Make the Key Log a separate local companion workbook**

A “DO NOT RETURN” sheet is better than mixing hospital numbers into ordinary extraction sheets, but it remains vulnerable to accidental sharing, cloud synchronization or incomplete deletion.

The safer package is:

- `N-MIND_Site_Extraction.xlsx` — returnable
- `N-MIND_Local_Key_Log.xlsx` — never leaves the hospital
- Central facility-code registry — controlled by the coordinating centre

If a single workbook must be used, the Key Log should have conspicuous warnings and the return SOP must require its deletion and verification before transmission. Excel sheet protection should be treated as an error-prevention feature, not a security control.

4. **Define derived outcomes carefully**

Derived variables should not turn inadequate observation into a negative outcome.

- `length_of_stay_days`: define as discharge date minus admission date; specify whether same-day admission/discharge equals 0 days.
- `followup_day`: calculate from a clearly named anchor such as index discharge or treatment initiation.
- `days_delayed`: calculate from scheduled and actual administration dates. Consider retaining a signed `administration_date_deviation_days`; negative values identify early injections.
- `readmission_within_90d/365d`: code `0` only when the patient had adequate observable follow-up. Otherwise use blank/unknown, especially when the site’s data coverage ends before the window.
- `mono_polypharmacy`: `none` for 0, `monotherapy` for 1 and `polypharmacy` for ≥2; missing count must produce missing classification.

Readmission derivation also needs rules for transfers, same-day returns, planned admissions, death and admissions recorded at another FNPH.

5. **Event IDs must not depend on row number**

A formula such as `ROW()` would cause identifiers to change when rows are inserted or deleted. Add an immutable site-assigned event serial and derive something like:

`01-PH-000001`

The format should work for patient-specific and stock-level pharmacy events. The serial must never be reused, even when an erroneous row is withdrawn. The event ID formula and serial should be locked after assignment.

6. **Apply date validation by field, not globally**

“No future dates” is appropriate for observed clinical events, but not necessarily for:

- next scheduled injection date;
- planned appointment date;
- expected stock delivery date.

Validation should distinguish observed dates from scheduled dates.

7. **Make data-sharing tier machine-readable**

In addition to the Read Me, add a Codebook column such as `minimum_sharing_tier`:

- Tier 1: aggregate only
- Tier 2: deidentified row-level
- Tier 3: linkage-enabled

This will eventually permit automated creation of compliant export datasets. The approach aligns well with Nigeria’s evolving digital-health architecture, which emphasizes interoperability, health information exchange, data governance and unified national systems. [Federal Ministry of Health NDHI description](https://health.gov.ng/fg-rallies-stakeholders-to-build-national-digital-health-backbone/).

### Recommended implementation sequence

1. **Freeze schema version 0.3**

Resolve the remaining conventions:

- Patient Registry structure
- Pharmacy-event ID format
- Length-of-stay convention
- Readmission observability rules
- Early versus delayed injection handling
- Pharmacy quantity units
- Linkage-token SOP and versioning

2. **Build the structural changes**

Add:

- Site Setup
- Patient Registry
- Local Key Log or companion workbook
- New linkage and transfer variables
- Immutable event serials
- Derived-variable columns
- Sharing-tier metadata

3. **Build validations and QC**

Add dropdowns, format checks, duplicate highlighting, range rules, logical flags and cross-module referential checks. QC should remain soft and visible—preferably with columns such as:

- `qc_flag`
- `qc_flag_count`
- `qc_flag_detail`
- `qc_review_status`

4. **Add a QC Dashboard**

For each module and facility, show:

- rows entered;
- unique patients;
- duplicate IDs;
- invalid ID formats;
- orphan patient IDs;
- missing critical variables;
- dates outside permitted ranges;
- unresolved QC flags;
- proportion of derived outcomes that are actually observable.

5. **Test with a synthetic adversarial dataset**

Include deliberate examples of:

- Wrong facility prefix
- Duplicate patient and event IDs
- Stock events with patient IDs
- Patient events without patient IDs
- Administration without dose
- Transfers
- Early and delayed injections
- Inadequate readmission follow-up
- Missing discharge dates
- Future scheduled dates
- Invalid ICD codes
- Free-text containing prohibited identifiers

6. **Conduct a two-site pilot**

Retain the existing minimum of 20 linked patients across modules and 6–12 complete months of pharmacy/treatment data, ideally using two contrasting sites. The pilot should measure the predefined thresholds: linkage ≥90%, treatment initiation ≥80%, baseline confounders ≥80%, outcome linkage ≥80% and access continuity ≥80%.

7. **Freeze the national release only after pilot corrections**

The release package should ultimately include:

- Master extraction workbook
- Local Key Log companion
- Codebook/data dictionary
- Extraction SOP
- Linkage SOP
- QC resolution guide
- Governance and data-transfer checklist
- Version/change log

The best immediate next step is therefore to update the workbook to version 0.3, beginning with the Patient Registry, Site Setup, ID architecture and Key Log separation before adding formulas and validations.

---

Nigeria Calls for Continental Investment in Digital Health Skilling to Drive Africa’s Healthcare Transformation – Federal Ministry of Health and Social welfare

---

SPEECH BY DR. IZIAQ ADEKUNLE SALAKO, MINISTER OF STATE FOR HEALTH AND SOCIAL WELFARE DELIVERED AT THE 44TH SCIENTIFIC CONFERENCE AND ANNUAL GENERAL MEETING OF THE ASSOCIATION OF HEALTH RECORD AND INFORMATION MANAGEMENT PRACTIONERS OF NIGERIA HELD ON NOVEMBER 25TH, 2025 AT THE POWA SECRETARIAT, ABUJA. – Federal Ministry of Health and Social welfare

---

Opening Remarks by the Honourable Minister of State for Health and Social Welfare, Dr. Iziaq Adekunle Salako, Delivered at the National Council on Health (NCH), 2025 – Federal Ministry of Health and Social welfare

---

OPENING SPEECH BY DR. IZIAQ ADEKUNLE SALAKO, MINISTER OF STATE FOR HEALTH AND SOCIAL WELFARE DELIVERED AT THE HIMSS EURASIA HEALTHTECH CONFERENCE & EXHIBITION HELD AT THE SUSESI LUXURY RESORT, BELEK – ANTALYA, TURKEY ON THE 26TH NOVEMBER 2025 – Federal Ministry of Health and Social welfare

---

The design is coherent and materially stronger than the current workbook. One point deserves tightening before implementation: the linkage-token method and its governance, because a plain salted hash of NIN can be vulnerable and may create avoidable legal/operational risk. I’m checking the current Nigerian regulatory position before giving the build order.

---

I’m using the personal-context skill because this continues a workbook and design decisions from earlier work. I’ll reconcile the agreed changes, flag any remaining methodological or governance risks, and propose a practical build-and-test sequence.

---

**Context:** I'm developing the "N-MIND FNPH Data Extraction Workbook" (Excel), a multi-site data extraction template to assess whether Nigerian Federal Neuro-Psychiatric Hospital records (EHR, clinical, lab, pharmacy) can support a national psychiatric treatment-and-outcomes cohort, comparative-effectiveness studies, and target trial emulations. You helped me create the original workbook. I've since reviewed it with another assistant and need you to continue development from the decisions below.

**Design decisions agreed:**
- **ID scheme:** fixed-width, zero-padded, with delimiters so Excel never strips leading zeros or misparses: patient = `01-000001` (2-digit facility code + 6-digit serial), encounter = `01-000001-2025-02` (patient ID + year + within-year sequence). Facility codes (e.g., 01 = Maiduguri, 04 = Yaba) assigned from a central registry before extraction. IDs never reused or re-sequenced. Never mix ID lengths.
- **Hospital numbers:** sites may enter their existing hospital numbers (e.g., "MDH/2019/4471") only in a **Key Log sheet** that derives the study ID and is retained/deleted on site before return — hospital numbers never travel. Site Setup block with the facility code pre-filled and locked by the coordinating center before distribution.
- **Transfers between facilities:** first study ID is for life; add a `transferred_from_id` field; central crosswalk reconciles suspected duplicates at merge.
- **Future linkage/interoperability:** add `birth_year` (stronger than age_at_discharge), and an optional `linkage_token` (salted SHA-256 hash of NIN, salt held centrally) for privacy-preserving deterministic linkage; probabilistic fallback = sex + birth_year + state + date sequence. Schema is close to OMOP-CDM — note this in Read Me for future EHR-based submissions.
- **Governance:** pseudonymized data is still personal data under the Nigeria Data Protection Act; each site needs HREC approval with consent waiver + a data-sharing agreement. Tiered sharing: Tier 1 aggregates only (feasibility metrics), Tier 2 deidentified row-level, Tier 3 + linkage variables. Hard rule for free-text fields (extractor_notes, discharge_regimen_text): no names, addresses, relationships, employers. Suppress cells <5 in reports.

**Agreed but not yet built (the to-do list):**
1. Dropdown data validation from Lists on all categorical columns; range rules (no future dates, non-negative costs/quantities/days)
2. Logic QC flags (soft, not blocking): stockout_end < stockout_start; Administered without dose; patient-level event without patient ID (and vice versa for stock events); delayed injection without days_delayed; ID prefix ≠ facility code
3. Cross-module check: patient IDs in Pharmacy/Outcomes/etc. must exist in Records
4. Auto-generated `pharmacy_event_id`; duplicate-highlighting on all ID columns
5. Site Setup + Key Log sheets with ID-derivation formulas and format-enforcing validation
6. New fields: `birth_year`, `linkage_token`, `transferred_from_id` (+ Codebook entries with governance caveats)
7. Computed instead of hand-entered: days_delayed, readmission_within_90d/365d, length_of_stay_days, followup_day, mono/polypharmacy from discharge_antipsychotic_count — styled as "derived, do not type"
8. Read Me additions: ID assignment convention, transfer rule, free-text rule, data-governance/tiered-sharing section
9. Codebook clarifications: study_patient_id conditionally required (blank for stock events); quantity_units unit convention; whether days_delayed is entered or computed

**Please let me your thoughts on the above and possible next steps

---

https://health.gov.ng/inaugural-address-by-dr-iziaq-adekunle-salako-the-honourable-minister-of-state-for-health-and-social-welfare-delivered-at-the-2nd-day-of-2025-joint-annual-review-meeting-jar/

---

The realistic revenue potential is:

- **N‑MIND/FNPH network alone:** roughly **$300,000–$1 million annually**
- **Expanded Nigerian tertiary-care platform:** approximately **$3–$5 million annually**
- **National multi-level health-data infrastructure:** potentially **$10 million+ annually**

These are planning estimates—not established Nigerian market prices.

## Revenue streams

| Product | Indicative pricing |
|---|---:|
| EHR integration and implementation | $10,000–$30,000 per tertiary facility |
| Annual platform, support and security | $8,000–$25,000 per facility |
| Advanced analytics/AI modules | $5,000–$20,000 per facility annually |
| Multicentre research study infrastructure | $100,000–$500,000 per study |
| Ministry or donor network deployment | $250,000–$2 million per contract |
| Payer, claims or quality analytics | $100,000–$1 million annually |
| PHC deployment under bulk contracts | $500–$2,000 per facility annually |

Individual PHCs are unlikely to be viable direct-paying customers. PHC deployments would need to be purchased centrally by government, insurers or donors.

## Five-year scenarios

| Revenue component | Conservative | Base case | Strong national growth |
|---|---:|---:|---:|
| Annual facility subscriptions | $250,000 | $1.5M | $5M |
| New integrations | $150,000 | $500,000 | $1.25M |
| Research contracts | $300,000 | $1M | $2.4M |
| Government/payer contracts | $250,000 | $750,000 | $2M |
| AI and additional modules | — | $250,000 | $750,000 |
| **Annual revenue** | **$950,000** | **$4M** | **$11.4M** |

The base case assumes approximately 100 tertiary and large secondary facilities, not merely psychiatric hospitals.

Nigeria’s immediate federal tertiary market includes **33 teaching hospitals, 22 specialty hospitals and 24 Federal Medical Centres**. [Federal Ministry of Health](https://health.gov.ng/) Beyond these, NHIA reports more than **15,000 accredited providers**, although only a fraction would initially have the size, readiness and budget for this platform. [NHIA](https://www.nhia.gov.ng/about-us/) The NDHI itself aspires to digitize more than 720 facilities, providing a credible initial addressable market. [NDHI](https://www.digitalhealth.gov.ng/)

## What N‑MIND itself could generate

Across 10 FNPHs, a mature network might produce:

- $100,000–$250,000 in initial integration fees.
- $100,000–$200,000 in annual subscriptions and support.
- $200,000–$750,000 annually from research, implementation and pharmaceutical-outcomes contracts.
- Additional ministry or donor contracts for expansion.

Therefore, N‑MIND is more valuable as **proof of capability and entry into the national system** than as the entire market.

## Where the most money is

The largest revenue will probably not come from selling dashboards to hospitals. It will come from:

1. Government-funded network deployments.
2. Research and real-world evidence contracts.
3. Claims and quality infrastructure for NHIA, SSHIAs and HMOs.
4. Long-term support and interoperability contracts.
5. Expansion from psychiatry into maternal health, PHCs and chronic diseases.

## Important commercial reality

Early revenue would be service-heavy and irregular. Hospitals may have limited discretionary software budgets and slow procurement cycles. The company should therefore:

- Use research or donor funding to finance initial implementation.
- Convert successful sites into annual support contracts.
- Charge integration fees separately.
- Require milestone-based payments.
- Price Nigerian contracts in naira with inflation or currency-adjustment provisions.
- Avoid giving away perpetual support because the pilot was grant-funded.

A credible trajectory would be:

- **Year 1:** $75,000–$200,000, primarily funded pilot work.
- **Year 2:** $200,000–$600,000.
- **Year 3:** $600,000–$1.5 million.
- **Year 5:** $3–$5 million in the base case.

The strategic upside is significant, but only if the company moves from bespoke research-data extraction to a repeatable interoperability product with recurring contracts.

---

I’ll separate realistic near-term revenue from the larger national upside. The business will likely earn first from implementation and research contracts—not from hospital software subscriptions alone.

---

https://nigeriahealthwatch.com/articles/thought-leadership/another-office-or-a-stronger-system-the-institutional-test-for-nigerias-digital-health-agenda/

---

https://www.researchgate.net/publication/408249359_DIGITALIZING_NIGERIA%27S_NHIS_FINTECH_LESSONS_FROM_NHS_UK_AND_US_HIT_ECOSYSTEM_FOR_INCLUSIVE_HEALTH_DATA_GOVERNANCE_A_PROJECT_REPORT

---

It aligns very strongly—approximately **8.5/10**—if positioned as an interoperability, governance and AI-readiness layer. It would align poorly if it became another closed EHR or exported Nigerian patient data into a privately controlled foreign repository.

| National priority | Alignment |
|---|---|
| Fixing fragmented clinical data | Very strong |
| National interoperability | Very strong |
| Data sovereignty | Strong, with the right architecture |
| Data protection | Strong, but operationally demanding |
| Responsible indigenous AI | Very strong |
| Replacing existing EHRs | Weak and unnecessary |

## 1. The current gap

The Federal Ministry of Health explicitly identifies fragmented services and poor data infrastructure as central problems. The Nigeria Digital in Health Initiative, or NDHI, is developing:

- Open, modular and connected digital tools.
- A national Health Information Exchange.
- A Health Claims Exchange.
- Integration of existing EMRs, DHIS2, SORMAS, NHIA and logistics systems.

The government describes the resulting national data space as infrastructure for clinical decisions, surveillance, resource planning and innovation by startups. [Federal Ministry of Health](https://health.gov.ng/fg-rallies-stakeholders-to-build-national-digital-health-backbone/)

N‑MIND fills a gap the national architecture will not solve automatically: **turning inconsistent specialty clinical records into standardized, longitudinal and analytically useful data**.

## 2. Alignment with digital-health policy

The startup should become a **certified specialty-data node** within the emerging national architecture.

It would:

- Integrate with existing hospital EHRs.
- Standardize psychiatric diagnoses, medications, laboratory results and outcomes.
- Maintain longitudinal linkage.
- expose approved interoperability interfaces.
- Send permitted indicators to national systems.
- Return useful clinical and operational dashboards to hospitals.

This fits the NDHI’s stated emphasis on EMRs, efficient data exchange, local health enterprises and data-driven decision-making. [Nigeria Digital in Health Initiative](https://www.digitalhealth.gov.ng/)

The main risk is building an isolated “N‑MIND database.” The product must be designed from the start to connect to the National Digital Health Architecture, whose formal architecture document is already publicly available for stakeholder review. [NDHI documents](https://www.digitalhealth.gov.ng/relevant-documents)

## 3. Data sovereignty

Data sovereignty should mean that Nigeria retains effective control over:

- Where identifiable data are held.
- Who authorizes access.
- What purposes data can serve.
- Which algorithms are trained on the data.
- Whether benefits return to Nigerian hospitals and patients.

Recommended architecture:

- Identifiable data remain at the hospital or in approved Nigerian infrastructure.
- Hospitals remain data controllers.
- The startup functions as a contracted processor.
- N‑MIND uses deidentified or pseudonymized research data.
- Multicentre analyses use a governed national repository or federated analysis.
- WashU receives only approved, deidentified datasets—not a copy of the operational database.
- Commercial access requires a Nigerian data-access committee and benefit-sharing rules.

The Data Protection Act permits regulated cross-border transfers; therefore, sovereignty should not be misrepresented as an absolute legal prohibition on overseas processing. Nevertheless, local control and storage of identifiable health data would be strategically and politically stronger.

## 4. Data Protection Act

Health information is classified as sensitive personal data under the Nigeria Data Protection Act. [Nigeria Data Protection Act](https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf)

The product would therefore need:

- Privacy by design.
- A documented lawful basis for each processing purpose.
- Data-protection impact assessments.
- Data minimization.
- Role-based access.
- Encryption in transit and at rest.
- Immutable audit logs.
- Separation of clinical, research and commercial uses.
- Retention and deletion schedules.
- Breach-detection and response procedures.
- Contracts defining controller and processor responsibilities.
- Specific governance for cross-border access.
- Mechanisms for patient information and applicable rights.

This is not merely a compliance burden. If implemented properly, it becomes a competitive advantage over informal hospital databases and loosely governed digital-health pilots.

## 5. AI disruption

AI makes this startup more timely, but the company should not begin as an “AI diagnostic company.”

AI models are increasingly commoditized. The scarce asset is reliable, longitudinal, locally governed clinical data connected to real workflows.

N‑MIND could initially use AI for lower-risk functions:

- Converting clinical text into proposed ICD codes for human verification.
- Matching duplicate patient records.
- Extracting medication histories.
- Detecting missing or inconsistent data.
- Forecasting pharmacy demand and stock-outs.
- Identifying patients overdue for injections or follow-up.
- Preparing research cohorts.
- Generating draft clinical summaries.
- Flagging potential adverse-effect monitoring gaps.

Later, properly evaluated models could support:

- Relapse-risk estimation.
- Treatment-disengagement prediction.
- Adverse-effect prediction.
- Individualized follow-up intensity.
- Clinical decision support.

Every clinical output should remain reviewable by a clinician. The National AI Strategy emphasizes foundational infrastructure, indigenous expertise, sector transformation, responsible AI and governance. It also explicitly anticipates AI startups and joint research-commercialization ecosystems. [Nigeria National AI Strategy](https://ncair.nitda.gov.ng/wp-content/uploads/2024/08/National-AI-Strategy_01082024-copy.pdf)

## Strategic position

The strongest positioning is:

> **A Nigerian health-data infrastructure company that makes existing hospital systems interoperable, research-ready and safely usable for locally governed AI.**

Its competitive advantage would not be ownership of Nigerian patient data. It would be the ability to:

1. Make fragmented data usable.
2. Keep control with Nigerian institutions.
3. Enable national research and quality improvement.
4. Connect hospitals to the emerging national architecture.
5. Build and validate AI using Nigerian clinical realities.

That sits almost exactly at the intersection of Nigeria’s current digital-health, data-sovereignty and AI agendas.

---

Artificial Intelligence-Enabled Accounting Information Systems and Fraud Detection in Nigeria's Financial Services Sector: The Moderating Role of Natural Language Processing

---

I’ll test the model against four current policy forces: Nigeria’s digital-health architecture, the Data Protection Act, data-sovereignty expectations and the country’s AI strategy. The important question is whether the startup fills a policy-defined infrastructure gap—not merely whether it sounds compatible.

---

How much does it align with the current gap, Nigerias digital health policy and data protection act, calls for data sovereignty, and the current AI disruption

---

Not necessarily. If the hospital’s EHR already captures the required data well, building another clinical system would be wasteful.

The first step is to determine what the existing EHR can do.

## Three possible scenarios

| EHR situation | What we should build |
|---|---|
| Comprehensive and exportable | Only the N‑MIND common data model, extraction pipeline and research analytics |
| Good clinical EHR but pharmacy/labs are separate | Integration layer linking the systems |
| Incomplete EHR with important paper processes | Small supplementary modules for missing functions |

The startup could therefore become an **interoperability and analytics company**, rather than an EHR company.

### Minimum product in an EHR-enabled hospital

- Connect to the existing database or approved exports.
- Standardize ICD-10/11, medications and laboratory results.
- Link pharmacy, clinical and encounter records.
- Identify treatment initiation, switching and discontinuation.
- Construct research-ready cohorts.
- Generate hospital quality and operational dashboards.
- Produce deidentified N‑MIND datasets.

We should only add data-entry interfaces for information the EHR does not collect—for example injection administration, symptom scales, reasons for treatment selection, outside medication purchases or functioning.

## Decision questions

Ask the EHR team:

1. Can data be exported through an API, SQL query or CSV?
2. Does every patient have a permanent identifier?
3. Are diagnoses, medications and laboratory results structured?
4. Can prescriptions be distinguished from dispensing and administration?
5. Are repeated admissions and outpatient encounters linkable?
6. Can pharmacy and laboratory systems be linked?
7. Are audit trails and role-based permissions available?
8. Who owns the software and database?
9. Does the hospital have authority to permit third-party integration?
10. Can the vendor provide documentation and a test environment?

If most answers are yes, the startup should **integrate, standardize and analyze**. If the EHR vendor blocks access, that becomes a contractual problem rather than a technical reason to build another EHR.

The strongest startup position may be:

> “We do not replace hospital EHRs. We convert fragmented clinical systems into interoperable, research-ready and decision-ready health-data networks.”

That model is cheaper, less disruptive and more scalable across hospitals using different EHR products.

---

N‑MIND could seed a **health-data infrastructure company**, not simply a mental-health research company or another EHR vendor.

The startup’s initial product would solve the infrastructure problems necessary for N‑MIND: linking encounters, medications, pharmacy stocks, laboratory results and outcomes across fragmented hospital systems.

## The startup wedge

Build an offline-capable **Psychiatric Treatment and Outcomes Platform** that sits alongside existing hospital EHRs.

Its first version would provide:

- A persistent patient master index.
- Pharmacy dispensing and injection-administration records.
- Medication initiation, switching and discontinuation tracking.
- Missed-injection and missed-appointment alerts.
- Admission, discharge and readmission tracking.
- Clozapine and lithium monitoring.
- Drug-stock and affordability dashboards.
- Standardized ICD-10/11 clinical data.
- One-click export into the N‑MIND common data model.

It should complement existing EHRs rather than attempt to replace them initially.

## What each party owns

This must be established before software development:

| Asset | Appropriate owner |
|---|---|
| Identifiable patient data | Hospital |
| N‑MIND research dataset | Research consortium under data-use agreements |
| Software code and product | Startup |
| Data-entry workflows and interoperability tools | Startup |
| Research protocols and manuscripts | Academic investigators/institutions |
| Hospital-specific dashboards | Hospital licence |
| Deidentified multicentre analyses | Governed by N‑MIND data-access committee |

The company should **never claim ownership of patient records**. Its valuable assets are the software, common data model, interoperability layer, implementation capability and trusted network.

Because health information constitutes sensitive personal data under Nigeria’s Data Protection Act, hospitals would generally be data controllers and the startup would operate as a processor under explicit contracts and safeguards. [Nigeria Data Protection Act](https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf)

## First commercial products

1. **Facility operations platform**  
   Medication tracking, appointments, readmissions, laboratory monitoring and pharmacy inventory.

2. **Quality and population-health dashboard**  
   Treatment continuity, stock-outs, prescribing quality, geographic access and hospital benchmarking.

3. **Research network platform**  
   Cohort creation, recruitment, pragmatic trials, target trial emulation and standardized multicentre data extraction.

4. **Payer and claims infrastructure**  
   Documentation that can support NHIA claims, treatment authorization and quality reporting.

The same infrastructure could subsequently support BIRTH, PHC decision support and other clinical areas.

## Business model

Revenue could come from:

- Hospital implementation and integration fees.
- Annual software and support subscriptions.
- Ministry or donor-funded network deployment.
- Research data-harmonization and study-management contracts.
- Pharmaceutical post-marketing or health-outcomes studies—with strict independent governance.
- NHIA and state-insurance quality or claims analytics.
- Custom population-health dashboards.

The company should sell **infrastructure and governed analysis**, not patient-level data.

## Minimum viable product

Start in one FNPH with only five functions:

1. Import or link the hospital patient identifier.
2. Record prescriptions, dispensing and administration.
3. Track appointments, admissions and readmissions.
4. Track drug stock-outs.
5. Produce the standardized N‑MIND dataset and hospital dashboard.

The immediate value proposition to the hospital would be:

> “We help you know who is receiving treatment, who has disengaged, what medicines are unavailable, and what outcomes your patients experience.”

That is more compelling than asking a hospital merely to contribute data to a study.

## Development pathway

### First 3 months

- Conduct the EHR and pharmacy feasibility assessment.
- Select one technically cooperative FNPH.
- Establish the Nigerian company and IP arrangements.
- Separate startup contracts from N‑MIND research governance.
- Build a clickable prototype and common data model.
- Secure a hospital letter of collaboration.

### Months 4–9

- Deploy the MVP.
- Link 500–1,000 historical patients.
- Prospectively track new treatment initiations.
- Demonstrate reduced manual extraction and better follow-up visibility.
- Obtain feedback from clinicians, pharmacists and records staff.

### Months 10–18

- Expand to three FNPHs.
- Publish the national data-feasibility or medication-access paper.
- Obtain the first paid implementation contract.
- Add interoperability connectors for different EHRs.
- Demonstrate that the platform can support a multicentre comparative-effectiveness study.

### Years 2–3

- Expand across the federal psychiatric network.
- Add teaching hospitals.
- Introduce BIRTH and PHC modules.
- Position the company as Nigeria’s infrastructure for governed clinical data networks and embedded research.

## The moat

The defensible advantage would not be the software interface alone. It would be:

- A harmonized Nigerian clinical-data model.
- Proven integration with heterogeneous hospital systems.
- Longitudinal patient linkage.
- Pharmacy and outcomes data unavailable in ordinary EHRs.
- Relationships with federal hospitals.
- Research credibility and publications.
- Capacity to run pragmatic trials and real-world evidence studies.
- Trustworthy Nigerian data governance.

The key strategic separation is this: **N‑MIND produces the evidence and establishes the network; the startup builds and maintains the infrastructure that makes that network possible.** This also protects the startup’s future independence while allowing collaboration with WashU researchers.

---

I’m going to frame N‑MIND as a credible startup wedge—starting with the hospital data infrastructure we genuinely need for the study, then identifying what can become a repeatable product without compromising research governance or patient trust.

---

Updated. It now includes:

- General treatment context.
- Repeated encounter events.
- Clinical outcomes.
- Laboratory results.
- Clozapine, polypharmacy, high-dose treatment, mood stabilizers and benzodiazepines.
- Non-pharmacological treatments.
- A feasibility matrix comparing 10 candidate study questions.
- Updated codebook and instructions.

[N-MIND FNPH Data Extraction Workbook.xlsx](sandbox:/workspace/scratch/3a956ac2f1d0/outputs/nmind_fnph_extraction/N-MIND_FNPH_Data_Extraction_Workbook.xlsx)

---

bash -lc /bin/bash -lc "printf '%s\\n' '[{\"name\":\"user.library-file-version\",\"value\":\"1\"}]' | python3 /root/.codex/plugins/cache/openai-curated-remote/openai-library/0.1.41/skills/library/scripts/library_file_transfer.py apply-xattrs /workspace/scratch/3a956ac2f1d0/outputs/nmind_fnph_extraction/N-MIND_FNPH_Data_Extraction_Workbook.xlsx libfile_b4a58f46cc748191b93b2f0f8da7220e"

---

I’ll broaden the workbook into a general N‑MIND extraction system while preserving the LAI fields. The update will add reusable encounter, laboratory, clinical-outcome and non-pharmacological treatment modules, plus a feasibility matrix for selecting the strongest primary study.

---

Yes, before circulating it. The current workbook is too LAI-centered.

We should update it to:

- Capture all psychiatric medications and non-pharmacological treatments.
- Add separate encounter, laboratory and clinical-outcome fields.
- Capture clozapine eligibility and monitoring.
- Record monotherapy, polypharmacy and high-dose treatment.
- Include lithium/valproate and benzodiazepine exposure.
- Capture psychotherapy, rehabilitation and post-discharge follow-up.
- Add adverse effects, metabolic outcomes, relapse, functioning, suicide-related outcomes and mortality.
- Replace the LAI-specific feasibility criteria with a matrix evaluating every candidate study question.

LAI administration and stock data should remain as one module within the broader N‑MIND platform.

---

No. **LAI should be one candidate flagship analysis—not the entire N‑MIND study.** We should build an exposure-agnostic national psychiatric treatment cohort.

The extraction system should capture every psychotropic medication, service exposure and outcome. Then we select the strongest target trial after seeing data availability and treatment variation.

## Potential treatment comparisons

| Clinical question | Exposure strategies | Guideline relevance |
|---|---|---|
| LAI effectiveness | LAI versus oral antipsychotic | Relapse prevention and early use |
| Antipsychotic polypharmacy | Monotherapy versus two or more antipsychotics | Highly controversial practice |
| Treatment-resistant schizophrenia | Clozapine versus continued non-clozapine treatment/polypharmacy | Very high |
| Antipsychotic generation | First-generation versus second-generation initiation | Effectiveness, affordability and adverse effects |
| Antipsychotic dose | Standard-dose versus high-dose treatment | Safety and prescribing quality |
| Bipolar maintenance | Lithium versus valproate | Relapse and hospitalization |
| Benzodiazepine exposure | Short-term versus prolonged co-prescribing | Dependence, mortality and prescribing safety |
| Post-discharge continuity | Follow-up within 7–14 days versus later/no follow-up | Continuity-of-care guidelines |
| Medication access | Continuous availability versus stock-out exposure | Health-system and global-health relevance |
| Insurance | Insured/subsidized versus out-of-pocket treatment | Adherence and treatment continuity |

## Outcomes to capture

We should not restrict outcomes to readmission:

- Time to psychiatric readmission.
- Recurrent admissions.
- Emergency presentations.
- Relapse.
- Medication discontinuation or switching.
- Missed appointments and disengagement from care.
- Treatment adherence.
- Symptom remission.
- Functioning.
- Suicide attempt and mortality.
- Extrapyramidal symptoms.
- Weight, glucose and lipid abnormalities.
- Hyperprolactinaemia.
- Length of stay.
- Patient expenditure.

## Most promising flagship alternatives

Three questions could potentially have more guideline importance than LAI alone:

1. **Clozapine versus continued polypharmacy among treatment-resistant schizophrenia.**  
   Strongest clinical-guideline relevance, but feasible only if previous treatment trials, clozapine initiation, blood monitoring and outcomes are documented.

2. **Antipsychotic monotherapy versus polypharmacy.**  
   Probably the most immediately feasible because polypharmacy is common in Nigerian psychiatric hospitals. However, severity and treatment resistance must be measured carefully.

3. **Early post-discharge follow-up versus delayed/no follow-up.**  
   Highly feasible if appointments and attendance are recorded, although confounding from patient engagement would require careful handling.

## Recommended structure

N‑MIND should have:

- A **core national cohort** containing all eligible psychiatric patients.
- A **medication-events table** containing every prescription, dispensing and administration.
- An **encounters table** containing admissions, discharges, outpatient visits and emergencies.
- Additional modules for laboratory results, symptom scales, adverse effects, functioning and mortality.

The workbook already allows any medication through `medication_generic_name`, `event_type`, formulation and dose fields. However, its feasibility criteria currently emphasize LAIs. We should revise it into a **general N‑MIND data feasibility workbook**, with separate modules for LAI, clozapine, polypharmacy, lithium/valproate, follow-up and stock-outs.

The best strategy is to collect broadly, then rank candidate questions using five criteria: sample size, treatment variation, time-zero clarity, confounder completeness and outcome ascertainment. We should only choose the primary target trial after examining these data.

---

Created the workbook with:

- Records extraction sheet.
- Pharmacy extraction sheet.
- ICD-10/11 fields.
- Standardized dropdown options.
- Shared identifiers for record linkage.
- Codebook and rapid feasibility criteria.
- Space for 250 initial records, expandable in Excel.

[N-MIND FNPH Data Extraction Workbook.xlsx](sandbox:/workspace/scratch/3a956ac2f1d0/outputs/nmind_fnph_extraction/N-MIND_FNPH_Data_Extraction_Workbook.xlsx)

---

bash -lc /bin/bash -lc 'setfattr -n user.library-file-version -v 0 /workspace/scratch/3a956ac2f1d0/outputs/nmind_fnph_extraction/N-MIND_FNPH_Data_Extraction_Workbook.xlsx 2>/dev/null || true'

---

The workbook will use two different observation levels: one row per index hospitalization/discharge in Records, and one row per medication transaction or injection in Pharmacy. That structure is essential for reconstructing treatment initiation and follow-up accurately.

---

I’ll create a practical Excel workbook with two separate extraction tabs—Records and Pharmacy—using ICD-10/11 fields and a shared patient identifier so the datasets can be linked. I’m using the spreadsheet workflow for validation and the file-saving workflow so you can download and circulate it.

---

Let’s create two data extraction sheets one for the records department and the other for the pharmacy. I have confirmed that they are using ICD 10/11.

---

That equals approximately **167 ampoules per month** or **2,000 annually**. It suggests meaningful LAI use, but probably represents fewer than 167 patients monthly.

Assuming one ampoule per injection:

- Dosing every 4 weeks: approximately 150–170 active patients.
- Dosing every 2 weeks: approximately 75–85 active patients.
- If some patients receive two ampoules per dose, the number would be lower.

So this centre may have approximately **50–170 regular fluphenazine patients**, but we still do not know how many are new initiators.

Ask for a six-month patient-level extract containing:

- Anonymous patient ID.
- Diagnosis.
- Date of each injection.
- Number of ampoules administered.
- Dose.
- First known fluphenazine date.
- Previous oral treatment.
- Admission and discharge dates.
- Subsequent readmission or clinic attendance.

The key number is:

> **How many unique patients received these 1,000 ampoules, and how many received their first injection during those six months?**

If the centre had at least 50–75 new initiators over six months, that would be a strong signal. Across several FNPHs, we could plausibly assemble the required national cohort. If most ampoules went to longstanding patients, the data would support a prevalent-user cohort but not the stronger new-user target trial without additional historical medication records.

---

That is encouraging, but **1,000 ampoules does not equal 1,000 patients or 1,000 treatment initiations**.

We need to clarify:

1. **Period:** 1,000 per month, quarter or year?
2. **Dose:** How many ampoules were used per administration?
3. **Patients:** How many unique patients received them?
4. **Initiators:** How many received their first-ever or first-in-12-months injection?
5. **Documentation:** Were these ampoules dispensed, administered or merely issued from pharmacy stock?
6. **Linkage:** Can each administration be linked to a patient ID, date, diagnosis and subsequent encounters?

### Possible interpretation

If the centre consumed **1,000 ampoules annually**, that is about 83 ampoules monthly. Depending on dose and injection frequency, this might represent only approximately 30–80 continuing patients and relatively few new initiators.

If it consumed **1,000 ampoules monthly**, it could support several hundred regularly treated patients and make a single-centre study plausible.

The most important question for the pharmacist is:

> “For the last 12 months, how many unique patients received fluphenazine decanoate, how many were new initiators, and how many administrations did each patient receive?”

Also request the corresponding number of patients receiving oral antipsychotics. If one centre has **100–150 genuine new LAI initiators annually**, and several FNPHs have similar volumes, the national target trial emulation becomes much more feasible.

---

For a rapid call, focus on whether we can reconstruct **who was eligible, what treatment they actually received, when they received it and what happened afterward**.

Ask them to show the data if possible—not simply confirm that it exists.

## Questions for the EHR lead

### Patient identification

- Can patients be linked across admissions, outpatient visits and pharmacy records using one permanent identifier?
- Does the identifier remain unchanged across years?
- Can duplicate patient records be identified?
- Can patients be linked across different FNPHs?

### Diagnoses and eligibility

- Are psychiatric diagnoses recorded using ICD-10/ICD-11 codes or free text?
- Can we identify schizophrenia-spectrum disorders?
- Can we distinguish first admission or first recorded psychotic episode from established illness?
- How many years of electronic data are available?
- What percentage of encounters are entirely electronic?

### Time zero

- Are admission and discharge dates reliably recorded?
- Are prescription dates and medication start dates recorded?
- Can we identify the discharge medication separately from medications used during admission?
- Can we determine whether a patient was newly initiating, switching or continuing treatment?

### Treatment data

- Are medication name, dose, route, frequency and duration structured fields?
- Can oral and depot formulations be distinguished?
- Are medication discontinuation and switching dates recorded?
- Does the EHR record prescribing only, or can it confirm dispensing and administration?
- Are missed injections documented?

### Baseline confounders

Ask whether the EHR contains:

- Age and sex.
- Duration of illness.
- Previous hospitalizations.
- Substance-use diagnosis.
- Medical comorbidities.
- Previous medications.
- Reason for admission.
- Symptom-severity scales.
- Aggression, suicidality and functioning.
- Adherence history.
- Employment, education, residence and insurance status.

### Outcomes

- Can we identify psychiatric readmissions?
- Emergency visits?
- Outpatient attendance and missed appointments?
- Medication discontinuation or switching?
- Deaths or suicide attempts?
- Can admissions outside the originating hospital be identified?

## Questions for the pharmacist

### LAI availability

- Which LAIs have been stocked during the past three years?
- Specifically: fluphenazine decanoate, haloperidol decanoate, risperidone LAI, paliperidone and aripiprazole.
- In which months was each product available?
- How frequently and for how long did stock-outs occur?
- Are inventory records electronic or paper-based?

### Utilization

- How many unique patients received each LAI monthly?
- How many were new initiators?
- How many doses were dispensed?
- Can dispensing be distinguished from actual administration?
- Where are injections administered, and is there a depot-clinic register?
- Are missed or delayed injections recorded?

### Oral comparator

- Can the pharmacy identify patients receiving oral antipsychotics?
- Are quantities and refill dates recorded?
- Can we identify patients starting oral treatment at discharge?
- Can oral and LAI records be linked using the same hospital number?

### Costs

- What does the hospital pay for each medication?
- What does the patient pay?
- Are medications covered by NHIA or another subsidy?
- Can patients purchase prescribed medication outside the hospital?
- If so, is that external purchase documented?

## Ask for these four counts

For the most recent complete 12 or 24 months:

1. Number of patients discharged with schizophrenia-spectrum diagnoses.
2. Number prescribed an LAI at discharge.
3. Number who actually received at least one LAI dose.
4. Number discharged on oral-only antipsychotic treatment.

Then ask:

- How many were readmitted within 6 or 12 months?
- How many had identifiable follow-up visits?
- How many LAI patients had at least three documented injections?

## Rapid feasibility decision

**Green light**

- Stable unique patient identifiers.
- Diagnosis, discharge date and medication route are structured.
- LAI administration—not merely prescription—is recorded.
- At least 100–150 new LAI initiators annually at the hospital.
- A substantial oral comparator group.
- Readmissions and follow-up visits can be linked.
- Pharmacy and EHR records share the same identifier.

**Possible, but requires prospective supplementation**

- LAI use is adequate, but symptom severity, adherence or functioning is missing.
- Administration is kept in a separate paper register.
- Pharmacy linkage is possible but requires manual reconciliation.
- Readmissions are captured, but outpatient outcomes are incomplete.

**Not feasible for retrospective TTE**

- Medications appear only as free text.
- No reliable medication initiation date.
- Prescriptions cannot be distinguished from dispensing or administration.
- Patient identifiers change across encounters.
- Very few LAI initiators.
- Most patients purchase medications externally with no documentation.
- Readmissions cannot be linked to the index discharge.

The most useful closing request would be: **“Can you produce a deidentified 20-patient sample showing diagnosis, admission/discharge dates, prescriptions, pharmacy dispensing, injections and subsequent encounters?”** That sample will reveal more about feasibility than a long verbal description.

---

In a rapid call with the EHR guy and the pharmacy, pharmacist, what type of data should we ask, whether it's available or not, and what would give us an idea of whether this is feasible or not?

---

“Adequate” means more than having LAIs somewhere in the hospital system. We need adequate **volume, continuity and treatment overlap**.

## Practical thresholds

For a 24-month recruitment period:

| Criterion | Adequate target |
|---|---:|
| New LAI initiators | At least 400–600 |
| Comparable oral initiators | At least 800–1,200 |
| Participating FNPHs | At least 6, preferably all 10 |
| Sites regularly initiating both strategies | At least 4–6 |
| LAI stock availability | Available during ≥80% of study months |
| Verified medication initiation | ≥90% |
| Outcome ascertainment | ≥80% at 12 months; ≥70% at 24 months |
| Concentration | No single hospital contributing >40% of LAI initiators |

These numbers would likely provide approximately 1,200–1,800 participants and sufficient treatment-failure events to detect a clinically meaningful relative reduction of approximately 25%, subject to a formal power analysis.

Equally important is **positivity**: patients with similar clinical characteristics must have a realistic chance of receiving either treatment. If one hospital almost exclusively uses LAIs and another almost exclusively uses oral medication, hospital characteristics could become inseparable from treatment effects.

## Who holds the data?

We would obtain different components from each FNPH:

- **Chief pharmacist:** dispensing records, formulations, quantities and dates.
- **Procurement department:** purchase orders, suppliers and stock deliveries.
- **Pharmacy inventory system:** monthly stock levels and stock-out periods.
- **Depot/injection clinic or nursing unit:** injections administered and missed appointments.
- **Health information/medical records department:** diagnoses, admissions, discharges and patient identifiers.
- **EMR team:** electronic prescriptions and longitudinal encounters.
- **Finance and NHIA desk:** patient prices, insurance claims and subsidies.
- **Clinical services/psychiatry department:** prescribing policies and clinician practices.

The CMD and Head of Clinical Services would authorize institutional participation. A Federal Ministry of Health endorsement could facilitate access across the network, but each hospital would still require a data-use agreement and ethics approval.

## Could the feasibility study itself be published?

Yes—if it was designed as a national health-system study rather than an informal audit.

A strong paper could be:

**“Availability, affordability and utilization of long-acting injectable antipsychotics across Nigeria’s federal neuropsychiatric hospital network: a national mixed-methods study.”**

It should include:

- All 10 FNPHs.
- Monthly procurement, stock and dispensing data over 24–36 months.
- LAI initiations and administrations.
- Patient prices relative to income or minimum wage.
- Insurance coverage.
- Geographic differences.
- Stock-out frequency and duration.
- Interviews with pharmacists, psychiatrists and patients.
- Reasons for prescribing, declining or discontinuing LAIs.
- Associations between availability and prescribing.

This could be competitive for **Lancet Regional Health–Africa, BMJ Global Health, International Journal of Mental Health Systems**, or a short report/commentary in **Lancet Psychiatry**. On its own, it would be less likely to reach JAMA Psychiatry. Its greater value would be as the first paper from a national platform, followed by the comparative-effectiveness cohort.

The first request to each FNPH should therefore be a **standardized aggregate-data template**, not patient-level records. That would tell us within several weeks whether the flagship LAI study was genuinely viable.

---

https://cdn.who.int/media/docs/default-source/essential-medicines/2023-eml-expert-committee/expert-reviews/c3_cpz-flu-hal-sqb_rev1.pdf?sfvrsn=21b1953a_1

---

https://www.academia.edu/19604341/PMH46_ESTIMATING_THE_COSTS_OF_PSYCHIATRIC_HOSPITAL_SERVICES_IN_NIGERIA_A_CASE_STUDY_OF_FEDERAL_NEUROPSYCHIATRIC_HOSPITAL_ENUGU_SOUTH_EAST_NIGERIA

---

https://www.cureus.com/articles/250857-predictors-of-the-availability-of-long-acting-injectable-antipsychotics-in-us-mental-health-facilities-serving-older-adults

---

LAIs are probably available, but not uniformly enough to assume feasibility without an audit.

Nigeria’s 2025 Essential Medicines List includes two older depot formulations:

- Fluphenazine decanoate.
- Haloperidol decanoate.

It does not list newer LAIs such as injectable risperidone, paliperidone or aripiprazole. [Nigeria Essential Medicines List](https://health.gov.ng/wp-content/uploads/2025/08/Final-NEML-Adult-8th-Edition.pdf)

This suggests the realistic comparison would be **older, first-generation LAIs versus oral antipsychotics**. Inclusion on the national list does not guarantee continuous availability. Stock-outs, hospital procurement, patient affordability and clinician preferences would likely vary considerably.

## Should we pay for medication?

**Not for an observational target trial emulation.**

Paying for LAIs could:

- Determine who receives the exposure.
- Remove the real-world affordability mechanism we intend to study.
- Produce outcomes that do not reflect routine Nigerian practice.
- Make the study closer to an intervention trial without randomization.
- Create ethical problems when funding ends.

We should instead cover:

- Research assessments.
- Tests required solely for research.
- Transportation or telephone costs for follow-up.
- Modest compensation for participants’ time.

Patients would receive medications through normal clinical arrangements. We would measure:

- Medication price paid.
- Insurance coverage.
- Hospital and external-pharmacy availability.
- Stock-outs.
- Whether the prescription was actually obtained.
- Missed injections.
- Inability to pay.
- Distance and travel costs.

Importantly, prescribing an LAI is not the same as initiating one. Exposure should begin only when pharmacy dispensing or administration was verified.

## Feasibility study before committing

Each FNPH should provide 12 months of:

1. Numbers of patients receiving each LAI.
2. New LAI initiations.
3. Oral antipsychotic initiations.
4. Monthly pharmacy stock and stock-outs.
5. Acquisition and patient prices.
6. Percentage receiving treatment through insurance or subsidy.
7. Injection attendance and missed-dose records.

If fewer than approximately **300–500 new LAI initiators annually across the network** can be identified, the LAI target trial would be underpowered or highly selective.

## Alternative if we want to pay

If we fund medications, we should conduct a **pragmatic randomized clinical trial**, not an observational emulation:

- Eligible early-psychosis patients randomized to LAI or oral treatment.
- Both treatments supplied without charge.
- Follow-up embedded in routine FNPH care.
- Primary outcome: 24-month relapse or treatment failure.
- Include economic and implementation outcomes.

That design could have considerably greater guideline influence, but it would cost more and require a sustainable post-trial medication plan.

My recommendation is to conduct the pharmacy audit first. If routine LAI initiation is adequate, proceed with the observational national cohort. If availability is too restricted, either fund a pragmatic trial or choose a different flagship question.

---

These are decisive feasibility questions. I’ll separate older depot antipsychotics from newer LAIs and determine whether medication support would undermine the observational target-trial design.

---

Then we should move beyond a routine EMR study. **Existing EMR data alone would probably not carry sufficient clinical depth for these journals**, unless the records are unusually complete.

## Recommended flagship study

**The Nigeria National First-Episode Psychosis Treatment and Outcomes Study**

A nationwide, multicentre inception cohort across all participating Federal Neuropsychiatric Hospitals, designed around a target trial emulation.

### Primary clinical question

> Among people hospitalized with first-episode or early-phase schizophrenia-spectrum psychosis, what was the comparative effectiveness of initiating a long-acting injectable versus an oral antipsychotic in preventing treatment failure over 24 months?

This question has direct relevance to when clinicians should introduce LAIs. Trials and observational studies have produced different estimates, partly because conventional trials disproportionately retain adherent patients. A pragmatic trial found that LAIs delayed hospitalization in early-phase schizophrenia, while nationwide Scandinavian studies found lower rehospitalization during LAI treatment. However, comparable evidence from African health systems is extremely limited. [JAMA Psychiatry trial](https://jamanetwork.com/journals/jamapsychiatry/fullarticle/2768027), [JAMA Psychiatry nationwide cohort](https://jamanetwork.com/journals/jamapsychiatry/articlepdf/2629295/jamapsychiatry_tiihonen_2017_oi_170033.pdf)

### Population

Consecutive patients across the FNPH network who:

- Presented with first-episode psychosis or were within two years of treatment initiation.
- Had schizophrenia-spectrum or affective psychosis.
- Were initiating maintenance antipsychotic treatment.
- Had minimal previous antipsychotic exposure.
- Were discharged to community care.

### Treatment strategies

- Initiation of an LAI-containing regimen.
- Initiation of an oral-only antipsychotic regimen.

We should preferably compare oral and injectable formulations of the same or closely comparable drugs, where sample size permits.

### Outcomes

The primary outcome should be **24-month treatment failure**, comprising:

- Psychiatric readmission.
- Relapse requiring emergency or intensive treatment.
- Treatment discontinuation or major switching.
- Suicide attempt or death.

Secondary outcomes would include:

- Symptom remission.
- Functioning and return to work or education.
- Treatment adherence.
- Adverse effects.
- Metabolic outcomes.
- Quality of life.
- Family burden.
- Out-of-pocket expenditure.
- Loss to psychiatric care.

## Design needed for journal-level gravitas

I recommend an **ambispective national cohort**:

1. **Retrospective phase:** use EMRs to identify approximately five years of first admissions and establish national patterns, treatment variation and readmission.
2. **Prospective phase:** enroll a new inception cohort at discharge and collect the clinical, social and functional variables absent from EMRs.
3. **Target trial emulation:** estimate LAI versus oral comparative effectiveness using new-user, active-comparator methods.
4. **Within-person or hospital-preference analyses:** use these as sensitivity analyses to reduce confounding.
5. **Embedded health-system analysis:** examine medication availability, affordability and regional inequalities.

### Proposed scale

- All 10 FNPHs, subject to operational readiness.
- Approximately 2,500–4,000 participants.
- Twenty-four months of follow-up.
- Central coordinating centre and common data model.
- National patient identifier with telephone-based follow-up.
- Independent outcome adjudication where possible.

## Why this could matter internationally

The gravitas would not come from simply labeling it “national.” It would come from combining:

- A large underrepresented African clinical population.
- Early psychosis, when treatment choices have lifelong implications.
- A clear guideline-relevant treatment decision.
- Real-world medication access and affordability.
- Standardized clinical and functional outcomes.
- Rigorous causal analysis.
- A national psychiatric research infrastructure that could continue beyond one paper.

### Likely journal positioning

- **Lancet Psychiatry/JAMA Psychiatry:** comparative effectiveness and clinical outcomes.
- **Lancet Global Health:** treatment effectiveness under resource constraints, access, affordability and health-system implications.
- **BMJ Global Health:** national care pathways, inequalities and implementation findings.

I would retain **LAI versus oral treatment in early psychosis** as the primary flagship question. Antipsychotic polypharmacy, clozapine access, disengagement from care and geographic inequalities could become prespecified secondary papers rather than competing primary objectives.

---

That ambition changes the design. A national descriptive EMR paper would be useful, but it would probably not have enough causal or clinical weight for those journals. I’m checking where a Nigerian national cohort could answer a genuine international guideline question.

---

We want to conduct a study that can be published in Lancet psychiatry, or LGH, BMJ GH, JAMA Psychiatry and the likes. That would have the gravitas of a national study and have clinical guideline relevance.

---

Yes. **Target trial emulation would be challenging with existing FNPH EMR data**, although prospective data collection could make it feasible later.

The main challenges would be:

- Unclear treatment-initiation dates.
- Incomplete medication start, stop and switching dates.
- Limited standardized symptom-severity measures.
- Confounding by indication.
- Patients receiving care or being admitted elsewhere.
- Inconsistent identifiers across visits and hospitals.
- Missing adherence and socioeconomic information.
- Differences in EMR systems and coding between FNPHs.

TTE is an analytic framework, not the only study design available. We should first determine what the EMRs can reliably support.

## More feasible EMR-based designs

| Design | Example question | Feasibility |
|---|---|---|
| Retrospective cohort | What factors predicted readmission within 6 or 12 months after discharge? | Highest |
| Recurrent-event cohort | What predicted repeated psychiatric admissions? | High |
| Case-control | How did patients readmitted within 90 days differ from those not readmitted? | High |
| Cross-sectional study | What were national patterns of diagnoses, medications and comorbidities? | Very high |
| Interrupted time series | Did a policy, drug-stock change or service intervention affect admissions or prescribing? | Moderate, if dates are clear |
| New-user comparative-effectiveness cohort | What were outcomes after initiating two alternative medications? | Moderate, depending on medication dates |
| Survival analysis | What was the time to readmission, disengagement or treatment discontinuation? | High |
| Clinical prediction modelling | Could routinely recorded variables predict readmission or missed appointments? | Moderate to high |

## Best first study

I would begin with:

**Predictors of 90-day and 12-month psychiatric readmission among patients discharged from Federal Neuropsychiatric Hospitals in Nigeria: a multicentre retrospective cohort study.**

### Cohort

- All eligible psychiatric discharges over three to five years.
- Index date: first qualifying discharge during the study period.
- Outcomes: readmission within 90 days and 12 months.
- Secondary outcome: number of subsequent admissions.

### Likely EMR variables

- Age and sex.
- Diagnosis.
- Admission and discharge dates.
- Previous admissions.
- Length of stay.
- Substance-use diagnosis.
- Medical comorbidities.
- Discharge medications.
- Voluntary or involuntary admission, if recorded.
- Discharge disposition.
- Outpatient attendance.
- Hospital and calendar year.

This design would tolerate many limitations of the EMR while allowing us to evaluate record completeness, patient linkage and cross-hospital harmonization.

## Recommended sequence

1. **EMR feasibility audit:** determine available fields, completeness, coding and longitudinal linkage.
2. **Descriptive multicentre study:** characterize patients, diagnoses, admissions and prescribing.
3. **Retrospective readmission cohort:** establish longitudinal analytic capacity.
4. **Restricted TTE:** attempt it only for a treatment comparison with reliable eligibility, treatment-initiation and outcome data.
5. **Prospective N‑MIND cohort:** collect the missing confounders and outcomes necessary for stronger TTEs.

Therefore, we should not abandon TTE. We should treat it as the **advanced phase**, while the multicentre retrospective cohort becomes the most defensible first use of the FNPH EMRs.

---

Yes. I recommend **prospective enrollment with retrospective baseline abstraction**.

Patients would be enrolled consecutively at discharge, which would serve as **time zero**. We would then:

- Abstract pre-admission and hospitalization data from clinical records.
- Record the complete discharge regimen and baseline confounders.
- Follow patients prospectively at 1, 3, 6 and potentially 12 months.

This is best described as a **prospective, multicentre observational cohort designed to support target trial emulation**.

Prospective enrollment is necessary because routine FNPH records may not consistently capture symptom severity, treatment adherence, medication changes, functioning, relapse or admissions elsewhere. It also allows us to establish eligibility, treatment assignment and follow-up at the same point.

However, we should enroll patients **before the discharge prescription is finalized—or record all baseline variables before knowing the final regimen where possible**. This helps ensure that baseline measurements precede treatment assignment and are not influenced by it.

---

The most feasible first target trial emulation in Federal Neuropsychiatric Hospitals would be:

## Antipsychotic monotherapy versus polypharmacy at discharge among adults with schizophrenia

This is more feasible than long-acting injectable versus oral treatment because both strategies are common, immediately identifiable from prescriptions, and available without additional laboratory testing. A Nigerian FNPH study found antipsychotic polypharmacy in 70.4% of outpatients, confirming adequate exposure variation, although it also demonstrated substantial confounding by illness severity. [PubMed](https://pubmed.ncbi.nlm.nih.gov/28101318/)

### Emulated target trial

| Component | Proposed definition |
|---|---|
| Population | Adults hospitalized with schizophrenia-spectrum disorders |
| Eligibility | Clinically ready for discharge, receiving antipsychotic treatment, no clozapine |
| Time zero | Date of discharge |
| Strategy A | One antipsychotic at discharge |
| Strategy B | Two or more antipsychotics at discharge |
| Primary outcome | Psychiatric readmission within six months |
| Secondary outcomes | Relapse, emergency presentation, symptom severity, functioning, adverse effects and treatment discontinuation |
| Follow-up | 1, 3 and 6 months |
| Primary estimand | Effect of assigned discharge strategy, analogous to intention-to-treat |
| Secondary estimand | Per-protocol effect while remaining on the assigned strategy |

### Why discharge is the best time zero

At discharge, we can establish simultaneously:

- Eligibility.
- Clinical condition and symptom severity.
- Complete medication regimen.
- Previous admission history.
- Substance use.
- Physical comorbidity.
- Family involvement and discharge plan.

This avoids the major problem of enrolling prevalent outpatients whose treatment began months or years earlier.

### Essential baseline confounders

We would need to collect:

- PANSS or a shorter standardized symptom-severity measure.
- Duration of illness and untreated psychosis.
- Number and duration of previous admissions.
- Aggression, suicidality and reason for admission.
- Substance use and toxicology, where available.
- Medication history and previous treatment response.
- Adherence history.
- Extrapyramidal and other adverse effects.
- Functioning.
- Family support, employment, distance from hospital and ability to pay.
- Prescriber and hospital.

Severity measurement is essential because Nigerian evidence indicates that patients receiving polypharmacy had more negative symptoms, poorer functioning and greater side-effect burden. Without these baseline measurements, confounding by indication could make polypharmacy appear harmful even if clinicians preferentially prescribed it to sicker patients. [PubMed](https://pubmed.ncbi.nlm.nih.gov/28101318/)

### Practical sample

A realistic pilot would enroll approximately **600–1,000 consecutive discharges across three FNPHs** over 12 months. Follow-up could combine:

- Hospital records.
- Clinic attendance.
- Patient or caregiver telephone interviews.
- Verification of admissions at the recruiting hospital.

This first emulation would establish whether N‑MIND could maintain time-zero alignment, longitudinal follow-up and medication histories. The LAI-versus-oral antipsychotic question could then become the second target trial once we knew how frequently each strategy was initiated.

---

I’ll assess feasibility against what FNPHs routinely document, expected treatment variation, follow-up burden and the risk of confounding. The goal is a target trial that can actually be emulated—not simply an interesting comparison.

---

Then N‑MIND should be designed as a **target trial emulation platform**, not merely a psychiatric registry.

### Core design

For each causal question, we would explicitly define:

| Target-trial component | N‑MIND specification |
|---|---|
| Eligibility | Patients meeting prespecified diagnostic and clinical criteria |
| Time zero | Date the patient became eligible and initiated one of the compared treatments |
| Treatment strategies | Two clinically plausible alternatives |
| Assignment | Observed treatment initiation, adjusted for measured confounding |
| Follow-up | From treatment initiation to outcome, loss to follow-up, death or study end |
| Outcomes | Remission, symptom change, relapse, readmission, adverse effects, suicide attempt, functioning or mortality |
| Causal contrast | Intention-to-treat analogue and, where possible, per-protocol analogue |
| Analysis | Propensity-score weighting/matching, standardization or doubly robust estimation |

### Strong initial emulations

Examples include:

1. **Long-acting injectable versus oral antipsychotics**  
   Among eligible patients with schizophrenia initiating maintenance treatment, what was the effect on relapse or psychiatric readmission within 12 months?

2. **Antipsychotic monotherapy versus polypharmacy**  
   Among patients beginning treatment for schizophrenia, what was the effect on symptom improvement, adverse effects and hospitalization?

3. **First-line antidepressant strategies**  
   Among adults initiating treatment for major depressive disorder, what was the comparative effectiveness of SSRIs versus alternative antidepressants?

4. **Early versus delayed treatment initiation**  
   Among patients with first-episode psychosis, what was the effect of starting antipsychotic treatment within a defined period on remission and functioning?

5. **Integrated substance-use treatment versus usual psychiatric care**  
   Among patients with dual diagnoses, what was the effect on treatment retention, relapse and readmission?

### The critical requirement: identifiable time zero

We should preferentially enroll:

- Newly diagnosed patients.
- Patients initiating a treatment.
- Patients switching treatment.
- Patients discharged after an index hospitalization.

Patients already taking treatment without a documented initiation date could still enter the broader cohort, but they would be unsuitable for many target-trial emulations because eligibility, confounders and treatment assignment could not be aligned at time zero.

### Minimum longitudinal data

At baseline and each follow-up, N‑MIND would need:

- Diagnosis and diagnostic history.
- Previous treatment and hospitalization.
- Current symptoms and severity.
- Functioning and quality of life.
- Substance use and toxicology, where available.
- Physical comorbidities and laboratory results.
- Medication name, dose, formulation, start and stop dates.
- Reasons for treatment selection, switching or discontinuation.
- Adherence and medication availability.
- Socioeconomic factors, social support and distance from care.
- Outcomes at 1, 3, 6 and 12 months.

The multicentre design would provide sample size and treatment variation. However, **hospital should not be treated merely as another covariate**: prescribing preference and drug availability vary by facility. We should measure these explicitly and account for clustering, site-level confounding and possibly instrumental-variable analyses where defensible.

The best flagship target trial would likely be **long-acting injectable versus oral antipsychotic treatment and 12-month relapse/readmission among patients with schizophrenia**. It has clear treatment alternatives, clinically important outcomes and enough routine variation across Nigerian hospitals to support emulation.

---

https://health.gov.ng/work-visit-to-the-university-of-nigeria-teaching-hospital-federal-orthopaedic-hospital-federal-neuropsychiatric-hospital-and-the-federal-university-of-allied-health-sciences-all-in-the-coal-city-o/

---

### N‑MIND hospital network

Nigeria’s Federal Ministry of Health currently lists **10 federal neuropsychiatric hospitals**:

| Geopolitical zone | Federal neuropsychiatric hospital |
|---|---|
| North East | Maiduguri, Borno |
| North West | Kaduna; Kware, Sokoto; Dawanau, Kano |
| North Central | Budo-Egba, Kwara |
| South East | Enugu |
| South South | Calabar; Uselu–Benin |
| South West | Aro–Abeokuta; Yaba–Lagos |

The Budo-Egba and Dawanau hospitals appear to be newer additions, so their patient volume, staffing and research readiness would need verification. [Federal Ministry of Health directory](https://health.gov.ng/specialty-hospitals/)

### Why include teaching hospitals?

Psychiatric hospitals alone would disproportionately capture severe, chronic and recurrent illness. Psychiatry departments in teaching hospitals would add:

- First-episode and newly diagnosed patients.
- Psychiatric emergencies presenting through general emergency departments.
- Mental illness alongside neurological, obstetric, infectious and other medical conditions.
- Consultation-liaison psychiatry.
- Patients who might never attend a psychiatric hospital.
- Better access to laboratory testing, toxicology, CT/MRI and mortality records.

### Proposed structure

I would create **paired sites within each geopolitical zone**:

- One federal neuropsychiatric hospital.
- One teaching-hospital psychiatry department.
- Later, one secondary-level hospital or community mental-health service.

This would allow us to compare:

1. Specialist psychiatric care versus general tertiary care.
2. Referral versus less-selected patient populations.
3. Inpatient, outpatient and emergency presentations.
4. Regional differences in diagnosis, treatment and outcomes.

### Recommended first-stage network

For a manageable pilot, we could begin with **12 hospitals—two per geopolitical zone**:

| Zone | Neuropsychiatric site | Potential teaching-hospital partner |
|---|---|---|
| North East | FNPH Maiduguri | University of Maiduguri Teaching Hospital |
| North West | FNPH Kware or Kaduna | Usmanu Danfodiyo University Teaching Hospital or ABUTH |
| North Central | FNPH Budo-Egba* | University of Abuja Teaching Hospital |
| South East | FNPH Enugu | University of Nigeria Teaching Hospital |
| South South | FNPH Uselu–Benin or Calabar | University of Benin Teaching Hospital or UCTH |
| South West | FNPH Aro or Yaba | UCH Ibadan or LUTH |

\*If Budo-Egba was not yet operationally ready, a high-volume teaching hospital could temporarily serve as the North Central anchor.

The important methodological point is that **hospital type must be recorded and incorporated into sampling and analysis**. These hospitals would not represent Nigeria’s general population; they would constitute a national clinical cohort of people who reached specialist psychiatric care.

---

I’ll expand that component into a concrete national site network, separating federal neuropsychiatric hospitals from teaching-hospital psychiatry departments and clarifying their roles in N‑MIND.

---

Yes—the **N‑MIND study**, our proposed national multicentre study of patients receiving psychiatric care in Nigeria.

The concept included:

- Federal neuropsychiatric hospitals and psychiatric departments in teaching hospitals.
- Standardized clinical, diagnostic, treatment, laboratory and toxicology data.
- Longitudinal follow-up to study treatment response, relapse, readmission, suicide-related outcomes and mortality.
- A unique patient identifier using combinations of NIN, telephone number and study-generated IDs.
- A platform for pragmatic trials, target-trial emulation and other causal analyses.
- Potential future linkage with BIRTH and Nigeria’s emerging digital-health infrastructure.

We can now develop the **full protocol, minimum dataset, hospital sampling strategy, pilot plan, governance structure or budget**.

---

Are you referring to:

1. **MaRVIN** — the national study of violence, trauma, mental health, and resilience; or  
2. **N‑MIND** — the proposed multicentre hospital-based psychiatric study; or  
3. The **MaRVIN food insecurity and mental health paper** we recently discussed?

Tell me which one—or what you want to develop next.

---

I’ll reconnect this to our earlier Nigeria mental health work—particularly MaRVIN and the proposed N‑MIND study—so we can continue from the right point.