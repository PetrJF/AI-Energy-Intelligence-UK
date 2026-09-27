# UK Data Centre Tracker — evidence audit

Generated from the live register. No figures in this document are estimated.

## Record counts (19 August 2026, after research pass 4)

| | Published | Draft (not public) |
|---|---|---|
| Records | 33 | 5 |
| Flagged `verified` | 29 | 0 |
| Linked to a source-register record | 10 | 0 |
| Carrying inline JSON sources | 26 | 1 |
| Holding a planning reference | 21 | 1 |
| Last-verified date recorded | 29 | 4 |
| **Any capacity figure of any type** | **7** | **0** |

Published records by type: 28 data centres, 5 AI Growth Zones.

## Findings

1. **Verified-without-visible-source (fixed in code).** 10 published records were linked to a
   primary planning source through `primary_source_id`, but the profile page only rendered the
   `sources` JSON column, so those pages displayed "No public source is recorded" while also
   showing a "Verified" badge. Both source paths are now merged, de-duplicated on URL, and
   labelled primary or secondary.
2. **Verified flag no longer self-certifies.** The badge now requires at least one displayable
   source. On current data that means **17 of 23** published records show as verified; the
   remaining 5 show as "Provisional — evidence incomplete" until a source is attached. The
   underlying `verified` column was not changed.
3. **No capacity data exists.** Every record has null IT load, grid connection, stated demand and
   campus capacity. The tracker previously advertised a "Disclosed capacity" total, which was
   summing nothing. Capacity totals are now stated per measurement type with their denominator,
   and read "No comparable figures are available" when empty. Filling these fields requires
   sourcing each figure from planning or operator documents — it has not been done and must not
   be estimated.
4. **Capacity types were conflated.** A single `capacity_mw` column held whatever number a source
   published. Figures are now classified as IT load, grid connection, stated electrical demand,
   campus build-out, or "definition not published". Unclassified figures are shown on the profile
   but excluded from every total, and totals of different types are never added together.
5. **Growth Zones counted as facilities.** 5 of the 23 published records are designated AI Growth
   Zones, which are areas rather than buildings. They are now excluded from facility counts and
   capacity totals and reported separately.
6. **Coverage was implied to be complete.** The landing page now carries an explicit statement that
   the register is evidence-led and not a census.

## Research pass 1 (18 August 2026)

Capacity was sourced from primary planning documents where it exists. Nothing was estimated.

| Record | Result | Primary source |
|---|---|---|
| Cambois campus | 720 MW IT load (10 buildings x ~72 MW each) | Northumberland CC committee report, 24/04112/OUTES |
| Manor Farm, Slough | 72 MW IT load | SoS recovered appeal decision + Inspector's Report, APP/J0350/W/25/3366043, para 5.5 |
| Rover Way, Cardiff | No DC capacity published; 50,400 sqm floor area recorded | Cardiff Council committee report, 24/00624/FUL |
| DC01UK, South Mimms | No MW published; 400 MVA reservation noted only | Developer statement via Hertsmere/NCE |
| Vantage Bridgend | No capacity published; status corrected proposed to approved (2 Oct 2025) | Bridgend CBC committee pack, P/25/247/HYB |
| Hayes Bridge / Heathrow Interchange | No capacity figure found in the published application documents | Hillingdon planning register |

Two conflicts worth recording:

- Trade press reported Manor Farm as a "147 MW" scheme. The decision letter and Inspector's
  Report state 72 MW of IT capacity. The primary figure is used.
- Rover Way's widely reported "1,000 MW" is battery storage capacity, not data-centre load. It is
  explicitly excluded and explained in the record.

## Research pass 2 (18 August 2026)

Nineteen further published records were worked through. Only four yielded a figure that any
publisher actually states; nothing was estimated or converted.

| Record | Result | Source |
|---|---|---|
| VIRTUS LONDON1, Enfield | 4.3 MW IT load | VIRTUS 2025 specification sheet (operator) |
| Global Switch London | 87 MW, definition not published — excluded from totals | Global Switch corporate site |
| 1 Redheughs Avenue, Edinburgh | 212.42 MW, definition not published — excluded from totals | Press coverage of the application |
| Lanarkshire AI Growth Zone | 500 MW operator claim, area-wide, excluded from totals | DataVita site |
| Tudor Works, Hayes | Trade press cites 50 MW; not in the Hillingdon application documents. Not recorded. | Hillingdon planning register |
| Digital Realty Woking | 84 MW appears only on broker aggregators, undefined and undated. Not recorded. | — |
| Carlton Park, Narborough | Only figure found is labelled an estimate by its own publisher. Not recorded. | — |
| Equinix LD8, Slough | Permit states 64 MWth of standby generator thermal input. That is not capacity. Not recorded. | EA permit EPR/DP3906BE |
| Atlantic Hub, Derry; Haspielaw Farm; White's Reclamation, Eccles; VIRTUS Stockley Park; Digital Realty Crawley; Rover Way; Vantage Bridgend; Hayes Bridge; Culham, North East, North Wales and South Wales Growth Zones | No published capacity figure of any kind found | Various primary registers |

No UK Government AI Growth Zone designation announcement states a power figure for any of the
five zones. Government releases quote jobs and investment only.

## Data-quality issues: resolution (18 August 2026)

1. **Equinix LD8 permit reference — resolved, record corrected.** The GOV.UK entry for permit
   EPR/DP3906BE/A001 is titled "E14 9GE, Equinix (UK) Limited" and names the site as Equinix LD8,
   London. The permit was correct; the record was wrong. The facility has been moved from Slough
   and Slough Borough Council to London Docklands (E14 9GE), London Borough of Tower Hamlets,
   London region, and the page address is now `equinix-ld8-london-docklands`. The previously cited
   GOV.UK URL had 404'd and has been replaced with the live one. No capacity is recorded: the only
   figure in the permit is 64 MWth of standby generator heat input.
2. **White's Reclamation Site, Eccles — resolved, no change needed.** The Salford City Council
   register records status "Decision Made", decision "Approve with Conditions", dated 23 July 2025
   (PA/2024/1810, Planning Panel). The "approved" status is correct. Press-reported floorspace is
   not on the register and remains unrecorded.
3. **1 Redheughs Avenue — resolved as documented.** Status stays "refused" (the February 2026
   council decision) with the live, undetermined DPEA appeal PPA-230-2794 and the 30 July 2026 EIA
   direction described in the record notes. Status will change only when the appeal is decided.
4. **Atlantic Hub, Derry — resolved.** Verified on the Northern Ireland Planning Portal
   (LA11/2023/1729/RM, reserved matters granted 9 October 2024) with no capacity figure on the
   register. The separate GreenScale record is held unpublished as a duplicate of the same campus,
   and the circulating "100 MW / 300 MW" figure remains unattached to either record.

## Research pass 3 — the 15 unpublished draft records (18 August 2026)

Eight records were published with sources attached; seven remain unpublished with the missing
evidence recorded on each. No capacity figure was recorded anywhere the published figure lacked a
stated definition, so the headline IT-load total is unchanged at 796.3 MW from 3 projects.

**Published (evidence attached)**

| Record | Evidence | Status recorded |
| --- | --- | --- |
| Bedford Ampthill Road campus | MHCLG s35 direction and decision letter, 15 June 2026 | Proposed, verified |
| Premier Park, Park Royal | OPDC committee report and minutes, 26 Feb 2026, ref 25/0196/FUMOPDC, 25,281 sq m GEA | Approved, verified |
| Kao Data Stockport | Stockport committee report DC/090411, meeting 4 Mar 2024, 25,900 sq m | Approved, verified |
| Equinix Wexham Road, Slough | Slough BC committee minutes, 26 Nov 2025, ref P/00072/108 | Approved, verified |
| Kao Data Harlow Plot F | Submitted LDO confirmation-of-compliance report, March 2025 | Proposed, unverified |
| AWS Maylands Avenue, Hemel | Applicant Energy and Sustainability Statement, 28 Jan 2026 | Proposed, unverified |
| Skelton Grange, Leeds | Harworth Group regulatory announcement, 27 Apr 2026 (resolution to grant only) | Proposed, unverified |
| Imperial Park, Newport (Vantage/NGD) | InfraVia investor disclosure 2020, operating campus | Operational, unverified |

**Held unpublished, with the specific gap recorded**

- AtlasEdge Salford — no Salford City Council reference or decision notice.
- Teledata/Datum Wythenshawe — only a demolition prior-approval reference found; full permission reference missing.
- Deep Green Bradford — no Bradford MDC reference; reported 5/5.6 MW carries no definition.
- Northtree Hemel Hempstead — no Dacorum reference; conflicting reported decision dates.
- Stellium Cobalt Park — 24/01678/FULM is plant replacement only; campus capacity claims conflict (32 MW vs 80/180 MW).
- Ratcliffe-on-Soar LDO — a policy and site record, not a project; no scheme or operator.
- GreenScale Foyle — duplicate of Atlantic Hub, Derry.

## Research pass 4 — the seven held drafts (19 August 2026)

Two of the seven were confirmed against a council planning register and published. Five remain
unpublished: three because the relevant council register could not be reached at all, and two
because they are not projects.

**Published (primary register entry retrieved and quoted)**

| Record | Reference | Decision | Register |
| --- | --- | --- | --- |
| Deep Green Bradford, Listerhills Road | 25/02212/MAF (PP-14024495) | Grant subject to Unilateral Undertaking, issued 13 May 2026 | City of Bradford MDC |
| Cobalt Data Centre Campus (Stellium), Wallsend | 24/01678/FULM (PP-13590574) | Application Permitted, issued 8 May 2025 | North Tyneside Council |

Two points of record:

- Bradford's register shows the application received 6 June 2025 and validated 23 July 2025. The
  widely reported "filed 31 July 2025" date does not match the register. The reported 5 MW / 5.6 MW
  figures appear nowhere on the register entry and carry no stated definition, so no capacity is
  recorded.
- The Stellium consent is a plant-replacement scheme at an operating campus, not new capacity. The
  operator publishes 80 MW "available" (scaling to 180 MW) with 15 MW allocated to Stellium 1 and
  "3MW IT data halls"; Colo-X publishes 32 MW across three 8 MW buildings. Neither states a
  definition and the two conflict, so 80 MW is recorded as definition-unclear and excluded from
  every total. No planning reference for the original halls was found.

**Still held, with the specific blocker recorded**

| Record | Blocker |
| --- | --- |
| AtlasEdge Colombus Way, Salford | `publicaccess.salford.gov.uk` returns 502; no reference in Place North West or DCD coverage. |
| Teledata/Datum Wythenshawe | `pa.manchester.gov.uk` times out; only the demolition prior-approval 137327/DEM/2023 located, via an aggregator. |
| Northtree, 45 Maylands Avenue, Hemel Hempstead | `planning.dacorum.gov.uk` refuses TLS connections; reported decision dates still conflict (4 vs 29 Aug 2025). |
| Ratcliffe-on-Soar LDO | Policy and site record, not a project. LDO revisions supporting data centre uses approved by Cabinet 12 May 2026; no scheme, operator or capacity. |
| GreenScale Foyle | Duplicate of Atlantic Hub, Derry (LA11/2023/1729/RM). |

The register now holds 33 published and 5 unpublished records. Seven published records carry a
capacity figure of any type; the IT-load total is unchanged at 796.3 MW from 3 projects, because
neither figure added in this pass has a published definition.

## Outstanding work (not done, requires sourced research)

- Sources for the published records still showing as provisional.
- Planning references for the published records without one.
- Salford, Manchester and Dacorum register entries for the three held drafts above — all three
  council portals were unreachable from this environment and need a direct browser lookup.
- Defined capacity figures across the tracker: 31 of 38 records still carry no recordable MW figure.



