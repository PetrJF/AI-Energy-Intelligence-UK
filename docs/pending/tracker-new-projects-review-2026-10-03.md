# Missing tracker projects: draft records (3 October 2026, reviewed)

Fifteen projects from the October 2026 research review that are not in the live tracker. None of them has been inserted. The SQL file `tracker-new-projects-drafts-2026-10-03.sql` adds them as **drafts** (`status_publication = 'draft'`), so they stay off the public site until each one is published in the admin. Run STEP 1 first: it is read-only and lists any possible duplicates.

## Review corrections (3 October 2026, second pass)

| Record | Correction | Evidence |
|---|---|---|
| google-waltham-cross | Announced date 19 → **18 January 2024**; summary adds that the site was bought in October 2020; Google's 2024 post added as a source | [Google](https://blog.google/company-news/inside-google/around-the-globe/google-europe/united-kingdom/google-1-billion-investment-in-a-new-uk-data-centre/), [Reuters](https://www.reuters.com/technology/google-invest-1-billion-uk-data-centre-2024-01-18/) |
| google-north-weald-airfield | The 780 jobs come from a report to the planning committee, not a council projection | [BBC](https://www.bbc.com/news/articles/cx2552z9p1lo) |
| aws-thorney-lane-iver | PL/22/1775/FA is a **hybrid** permission (one detailed building plus outline for more), granted to the **previous site owner**; it is not a full permission held by Amazon | [IVRA](https://www.ivra.org.uk/PlanningApplications/pl-22-1775-fa-hybrid-application-to-be-delivered-in-phases-and-to-comprise-demolition-of-existing-buildings-and-structures-and-preparatory-works-detailed-application-for-construction-of-commercial/), [EA permit papers](https://consult.environment-agency.gov.uk/psc/sl0-9ee-amazon-data-services-uk-limited/supporting_documents/application-bespoke-appendix-d-part-a1-of-17-desk-study-pra-main-text-epr-mp3824mg-a001-020326pdf) |
| cyrusone-lon6-iver-heath | Floor area 30,000 → **63,000 sq m** gross (30,000 is technical space only); facility type colocation → **hyperscale**; green belt location added | [Bucks Free Press](https://www.bucksfreepress.co.uk/news/24477240.m25-big-new-data-centre-planned-next-motorway/), [CyrusOne](https://www.cyrusone.com/resources/press-releases/cyrusone-plans-pioneering-new-london-facility-with-sustainability-at-its-core) |
| ada-docklands-west-silvertown | Adds the resolution to grant on **20 June 2024**, with permission issued December 2024 (the draft gave only December). The hybrid permission gave detailed consent for Building 1 | [Ada, June 2024](https://adainfrastructure.com/en-US/insights/news/ada-infrastructure-approved-to-develop-210-mw-data-center-campus-in-east-londons-royal-docks), [Royal Docks](https://royaldocks.london/articles/docklands-data-centre-campus-update) |
| west-sleekburn-data-centre | Sources disagree on the site: BBC says farmland, Place North East says the former GSK site. Reworded as agricultural land on part of the former GSK site (about 28 ha), matching LBC and DCD | [BBC](https://www.bbc.com/news/articles/cwyek0jl80xo), [DCD](https://www.datacenterdynamics.com/en/news/plans-filed-for-three-building-data-center-campus-in-northumberland-uk/) |
| tbc-partners-factory-road-cambois | The screening opinion's date is not stated; now reads "reported in September 2026" | [Place North East](https://www.placenortheast.co.uk/tbc-partners-explores-second-cambois-data-centre/) |
| microsoft-eggborough | Adds the 1.2m sq ft size given by North Yorkshire Council. The 2025 Eggborough applications are Core 62's other plots, not a Microsoft data centre | [North Yorkshire Council](https://edemocracy.northyorks.gov.uk/documents/s30325/Executive%20Mewmber%20for%20Open%20to%20Business%20-%20Councillor%20Derek%20Bastiman.pdf), [Public Notice Portal](https://publicnoticeportal.uk/notice/planning/68cbde8a69f6fc0f32348095) |
| vantage-lhr2-park-royal | The source only says it was "due to open"; summary now separates that from later trade reports that it is operating | [Vantage](https://vantage-dc.com/news/vantage-data-centers-announces-opening-of-second-london-campus-with-landmark-public-art-installation/) |
| aws-didcot-north, cloudhq-lhr-didcot | Admin notes only: postcode mismatch (OX11 7BF vs 7HA); check whether CloudHQ's consent is under the Didcot Technology Park LDO | — |

Checked with no change needed: google-arena-essex-thurrock, elsham-tech-park, anthropic-teesworks-redcar, thames-valley-park-earley. Court Lane, Iver (Affinius Capital, already in the tracker) is a different site from CyrusOne LON6 and Amazon Thorney Lane.

## Draft records

| # | Proposed slug | Status | Confidence | Planning ref | Key figures | Main source |
|---|---|---|---|---|---|---|
| 1 | `google-waltham-cross` | Operational | high | — | — | [Google (PR Newswire)](https://www.prnewswire.com/news-releases/google-opens-waltham-cross-data-centre-as-part-of-two-year-5-billion-investment-in-the-uk-to-help-power-its-ai-economy-302556707.html) |
| 2 | `google-north-weald-airfield` | Approved | medium | — | — | [BBC News](https://www.bbc.com/news/articles/cx2552z9p1lo) |
| 3 | `google-arena-essex-thurrock` | Proposed | medium | 25/00573/OUT | 130,500 sq m | [Thurrock Council](https://www.thurrock.gov.uk/public-notices/town-and-country-planning-422) |
| 4 | `aws-didcot-north` | Approved | high | P22/V1857/O; P25/V2197/RM | 197,000 sq m | [PlanIndex (Vale of White Horse register data)](https://planindex.co.uk/planning-applications/vale-of-white-horse/p25-v2199-s73) |
| 5 | `aws-thorney-lane-iver` | Approved | medium | PL/22/1775/FA | — | [Environment Agency](https://www.gov.uk/government/publications/sl0-9ee-amazon-data-services-uk-limited-environmental-permit-application-advertisement-eprmp3824mga001) |
| 6 | `cloudhq-lhr-didcot` | Approved | medium | — | 101 MW IT, £1.9bn, 209,032 sq m | [DSIT (GOV.UK)](https://www.gov.uk/government/news/tech-secretary-welcomes-foreign-investment-in-uk-data-centres-which-will-spur-economic-growth-and-ai-innovation-in-britain) |
| 7 | `cyrusone-lon6-iver-heath` | Approved | medium | — | 90 MW IT, £1.2bn, 63,000 sq m | [CyrusOne](https://www.cyrusone.com/resources/press-releases/cyrusone-plans-pioneering-new-london-facility-with-sustainability-at-its-core) |
| 8 | `ada-docklands-west-silvertown` | Under construction | medium | — | — | [Ada Infrastructure](https://adainfrastructure.com/en-US/insights/news/ada-infrastructure-celebrates-groundbreaking-of-its-210-megawatt-docklands-data-center-campus-in-london) |
| 9 | `elsham-tech-park` | Approved | medium | PA/2025/643 | 1000 MW IT, 1,500,000 sq m | [North Lincolnshire Council](https://www.northlincs.gov.uk/news/billions-of-pounds-of-ai-investment-could-bring-hundreds-of-skilled-jobs-to-north-lincolnshire/) |
| 10 | `west-sleekburn-data-centre` | Proposed | medium | 26/02160/OUTES | £3.8bn, 356,500 sq m | [BBC News](https://www.bbc.co.uk/news/articles/cwyek0jl80xo) |
| 11 | `tbc-partners-factory-road-cambois` | Proposed | low | — | — | [Place North East](https://www.placenortheast.co.uk/tbc-partners-explores-second-cambois-data-centre/) |
| 12 | `anthropic-teesworks-redcar` | Proposed | indicative | — | — | [North East Bylines](https://northeastbylines.co.uk/business/ben-houchen-responds-to-teesworks-deal-of-the-century/) |
| 13 | `microsoft-eggborough` | Proposed | low | — | — | [Microsoft Local](https://local.microsoft.com/blog/eggborough-datacentre-project-updates/) |
| 14 | `thames-valley-park-earley` | Proposed | low | — | 72 MW IT, £200m | [Project team](https://www.tvpdc.co.uk/) |
| 15 | `vantage-lhr2-park-royal` | Operational | medium | — | 20 MW IT, £250m, 18,000 sq m | [Vantage Data Centers](https://vantage-dc.com/news/vantage-data-centers-announces-opening-of-second-london-campus-with-landmark-public-art-installation/) |

## Records to hold back

- **anthropic-teesworks-redcar**: indicative only. Based on Private Eye reporting; the deal was unsigned as of June 2026.
- **microsoft-eggborough**: no data centre application traced since the 2024 consultation.
- **tbc-partners-factory-road-cambois**: EIA screening stage only.
- **thames-valley-park-earley**: developer not named; Microsoft is not involved (BBC, 2 July 2026).

## Not added as new records

- **CoreWeave Crawley and Docklands** are CoreWeave deployments inside Digital Realty Crawley and Global Switch London, which the tracker already lists ([DCD](https://www.datacenterdynamics.com/en/news/coreweave-launches-first-two-uk-data-center-locations/)). Add them as tenant notes on those records.

### Google Waltham Cross data centre

Google's first UK data centre, on a 33-acre site at Waltham Cross, Hertfordshire, which Google bought in October 2020. Construction of the $1bn (about £790m) facility was announced on 18 January 2024. It was opened by the Chancellor on 16 September 2025 as part of Google's two-year £5bn UK investment, to support Google Cloud, Workspace, Search and Maps, including AI services. Google gives no capacity figure.

Admin note: Held for review. Planning reference not retrieved; announcement date is Google's 18 January 2024 $1bn announcement. The $1bn is not stored in investment_gbp because it is in US dollars. Check that the index region assignment matches other Hertfordshire records.

Sources: [Google opens Waltham Cross data centre as part of two-year £5 billion investment in the UK](https://www.prnewswire.com/news-releases/google-opens-waltham-cross-data-centre-as-part-of-two-year-5-billion-investment-in-the-uk-to-help-power-its-ai-economy-302556707.html); [Waltham Cross data center](https://datacenters.google/locations/waltham-cross/); [Our $1 billion investment in a new UK data centre](https://blog.google/company-news/inside-google/around-the-globe/google-europe/united-kingdom/google-1-billion-investment-in-a-new-uk-data-centre/)

### Google data centre, North Weald Airfield

Outline plans for a Google data centre on 52 acres (21 ha) of North Weald Airfield, Essex, approved by Epping Forest District Council's planning committee on 10 December 2025. Google bought the site for £88.2m in January 2024. A report to the planning committee estimated up to 780 local jobs, including around 200 direct jobs. No capacity figure has been published.

Admin note: Held for review. Need the EFDC application reference and decision notice.

Sources: [North Weald Airfield Google data centre is approved](https://www.bbc.com/news/articles/cx2552z9p1lo); [Google Data Centre](https://www.northweald-pc.gov.uk/google-data-centre/)

### Google data centre campus, Arena Essex, Purfleet-on-Thames

Hybrid application 25/00573/OUT to Thurrock Council for the former Arena Essex raceway and fishing lake, Arterial Road, Purfleet-on-Thames: full permission for demolition, remediation and access, and outline permission for up to four data centre buildings (up to 130,500 sq m GEA) plus an office building. Plans were submitted for Google by Global Infrastructure UK Ltd, which bought the 129-acre site in 2023. The site is a local wildlife site; Essex Wildlife Trust objects over habitat for rare bees and plants. Undecided as of September 2026.

Admin note: Held for review. Floor area is GEA of data centre buildings only.

Sources: [Town and Country Planning public notice (25/00573/OUT)](https://www.thurrock.gov.uk/public-notices/town-and-country-planning-422); [Thurrock data centre could harm rare bees, says Essex charity](https://www.bbc.com/news/articles/c24jrm0v8j4o)

### Amazon Didcot North Data Centre Campus (former Didcot A Power Station)

Data centre campus on the former Didcot A Power Station site. RWE obtained hybrid permission (P22/V1857/O) in July 2025 for up to 197,000 sq m of data centre floorspace. Reserved matters for a four-building campus with gatehouse and plant (P25/V2197/RM) were granted on 17 February 2026, and the Environment Agency granted Amazon Data Services UK Limited a permit for standby generation (EPR/GP3127LV/A001) on 27 July 2026. Amazon has not given a site-specific investment or capacity figure; it forms part of AWS's £8bn UK data centre investment for 2024 to 2028.

Admin note: Held for review. Decision dates come from PlanIndex; confirm against the Vale of White Horse register. The permit uses postcode OX11 7BF; the planning register uses OX11 7HA. Construction start not confirmed.

Sources: [P25/V2199/S73 and related applications, Land at former Didcot A Power Station](https://planindex.co.uk/planning-applications/vale-of-white-horse/p25-v2199-s73); [OX11 7BF, Amazon Data Services UK Limited: environmental permit issued](https://www.gov.uk/government/publications/ox11-7bf-amazon-data-services-uk-limited-environmental-permit-issued-eprgp3127lva001); [Amazon plans data centre at former power plant site](https://www.bbc.com/news/articles/cg7y5g429jko); [Delivering Didcot Data Campus](https://deliveringdidcotdatacampus.co.uk/)

### Amazon Thorney Lane data centre, Thorney Business Park, Iver

Amazon Data Services UK Limited applied to the Environment Agency for a permit (EPR/MP3824MG/A001, advertised 3 June 2026) for emergency back-up generation at a data centre on Thorney Business Park, Iver: 36 main generators of up to 7.57 MWth thermal input each, plus two house generators. The permit documents cite an extant hybrid planning permission (PL/22/1775/FA), granted by Buckinghamshire Council on 29 May 2024 to the previous site owner: full permission for a first data centre building with backup generators and outline permission for further data centre buildings. Amazon will seek design changes through a new full application. Generator thermal input is not an IT-load figure and is not recorded as capacity.

Admin note: Held for review. The previous owner who obtained PL/22/1775/FA is not named in the permit papers, and the new full application's reference is not yet known. Developer field shows Amazon as the current applicant. Check for overlap with existing Iver records before publishing.

Sources: [SL0 9EE, Amazon Data Services UK Limited: environmental permit application advertisement](https://www.gov.uk/government/publications/sl0-9ee-amazon-data-services-uk-limited-environmental-permit-application-advertisement-eprmp3824mga001); [Thorney Lane Data Centre Emergency Back-Up Generation Facility: non-technical summary](https://consult.environment-agency.gov.uk/psc/sl0-9ee-amazon-data-services-uk-limited/supporting_documents/application-bespoke-sp3224lp-app-nts-non-technical-summary-final-2026-02-23-epr-mp3824mg-a001-020326pdf)

### CloudHQ LHR Campus, Didcot

A £1.9bn data centre campus by Washington DC-based CloudHQ on 37.5 acres of the former Didcot A power station grounds, welcomed by the Technology Secretary in October 2024. CloudHQ describes it as fully permitted and powered, with 101 MW of critical IT load, expandable to 300 MW, and 2.25m sq ft of space. The BBC reported 1,500 construction jobs and 100 permanent roles. Separate from Amazon's Didcot North campus on the same former power station site.

Admin note: Held for review. Planning authority and reference not retrieved; check whether consent came through the Vale of White Horse's Didcot Technology Park Local Development Order. The 101 MW figure is CloudHQ's own marketing figure for critical IT load. Construction status not confirmed.

Sources: [Tech Secretary welcomes foreign investment in UK data centres](https://www.gov.uk/government/news/tech-secretary-welcomes-foreign-investment-in-uk-data-centres-which-will-spur-economic-growth-and-ai-innovation-in-britain); [LHR Campus](https://cloudhq.com/campus/lhr-campus-2/); [Didcot £1.9bn data centre campus confirmed](https://www.bbc.com/news/articles/cn4znj8k29ro)

### CyrusOne LON6, Iver Heath

CyrusOne's sixth UK data centre: a 63,000 sq m hyperscale facility with 90 MW of IT capacity and 30,000 sq m of technical space, on a 41-acre former landfill site in the green belt between Denham Road, Seven Hills Road and the M25, opposite Pinewood Studios. CyrusOne is owned by US investors KKR and Global Infrastructure Partners. Full planning permission was reported in July 2025. CyrusOne states investment of more than £1.2bn, about 580 construction jobs and 540 operational roles. It planned to break ground in Q3 2026 with first capacity in early 2028; John F Hunt was reported in July 2026 to have won a £20m enabling and remediation package.

Admin note: Held for review. Need the Buckinghamshire application reference and decision date; the permission is reported only by the planning consultant (Montagu Evans). Floor area: 63,000 sq m gross (Bucks Free Press); CyrusOne quotes 30,000 sq m of technical space. Change status to under construction once enabling works are confirmed to have started.

Sources: [CyrusOne plans pioneering new London facility with sustainability at its core](https://www.cyrusone.com/resources/press-releases/cyrusone-plans-pioneering-new-london-facility-with-sustainability-at-its-core); [Massive new data centre planned on Green Belt by M25 in South Buckinghamshire](https://www.bucksfreepress.co.uk/news/24477240.m25-big-new-data-centre-planned-next-motorway/); [John F Hunt bags £20m enabling works deal at giant data centre](https://www.constructionenquirer.com/2026/07/17/john-f-hunt-bags-20m-enabling-works-deal-at-giant-data-centre/)

### Ada Docklands Data Campus, Royal Docks

A three-building data centre campus on a former paint factory site next to Tate & Lyle in the Royal Docks, Newham's Strategic Development Committee resolved to grant the hybrid application on 20 June 2024, with detailed consent for Building 1, and permission was issued in December 2024. All three reserved matters applications were approved by May 2026, giving detailed permission for the whole site. Ada Infrastructure, part of US-based Ares Management's digital infrastructure business, broke ground on 26 February 2026 and is building the first of three 70 MW buildings (210 MW in total, measure not defined), with the first due in mid-2028. The project expects 524 construction jobs.

Admin note: Held for review. The 210 MW figure is not defined as IT load, so capacity_mw is left blank. Need the Newham application references.

Sources: [Ada Infrastructure celebrates groundbreaking of its 210-megawatt Docklands data center campus in London](https://adainfrastructure.com/en-US/insights/news/ada-infrastructure-celebrates-groundbreaking-of-its-210-megawatt-docklands-data-center-campus-in-london); [Ada Infrastructure approved to develop 210 MW data center campus in East London's Royal Docks](https://adainfrastructure.com/en-US/insights/news/ada-infrastructure-approved-to-develop-210-mw-data-center-campus-in-east-londons-royal-docks); [Docklands Data Campus](https://www.adadocklands.co.uk/docklands-data-campus/); [Latest news](https://www.adadocklands.co.uk/latest-news/)

### Elsham Tech Park, former RAF Elsham Wolds

Outline permission (PA/2025/643) for an AI data centre campus of up to 1 GW of IT load on 176 ha of the former RAF Elsham Wolds airfield near Scunthorpe, approved unanimously by North Lincolnshire Council's planning committee in March 2026. The scheme has more than 1.5m sq m of floorspace in 15 data halls, battery storage, a 49.9 MW on-site energy centre and heat reuse for greenhouses. The council cites up to £10bn of private investment and 900 to 1,200 permanent jobs; the build cost is estimated at about £7.5bn. Construction is expected from 2027, with the first phase open in 2029. No operator is named.

Admin note: Held for review. Committee decision date not confirmed (council news 11 March 2026). Not US-led; the developer is UK-based Greystoke.

Sources: ['Billions of pounds' of AI investment could bring hundreds of skilled jobs to North Lincolnshire](https://www.northlincs.gov.uk/news/billions-of-pounds-of-ai-investment-could-bring-hundreds-of-skilled-jobs-to-north-lincolnshire/); [UK's biggest AI data centre plan approved](https://www.constructionenquirer.com/2026/03/12/uks-biggest-ai-data-centre-plan-approved/)

### West Sleekburn Data Centre

Outline application 26/02160/OUTES (all matters reserved except access), submitted in June 2026 by Wansbeck Regeneration Ltd, for a data centre campus of up to 356,500 sq m GIA in three buildings on about 70 acres (28 ha) of agricultural land on part of the former GlaxoSmithKline site at West Sleekburn, south of the River Wansbeck. It includes up to 49.9 MW of gas generation as a bridging supply. Proposed operational capacity is reported as 384 MW (measure not defined). Investment is put at £3.8bn, with up to 785 direct jobs (Lichfields). The site is less than two miles from QTS's Cambois campus. No operator is named.

Admin note: Held for review. The 384 MW figure comes from Place North East (22 Sep 2026) and its measure is not defined.

Sources: [Plans for Northumberland's second AI data centre submitted](https://www.bbc.co.uk/news/articles/cwyek0jl80xo); [Plans in for West Sleekburn Data Centre](https://www.placenortheast.co.uk/plans-in-for-west-sleekburn-data-centre/); [Plans filed for three-building data center campus in Northumberland, UK](https://www.datacenterdynamics.com/en/news/plans-filed-for-three-building-data-center-campus-in-northumberland-uk/); [Northumberland's power-first campus test](https://data-central.co.uk/northumberlands-power-first-campus-test/)

### TBC Partners data centre, Factory Road, Cambois

An early-stage proposal by TBC Partners for one or two data centre buildings, up to 30m high, on a 30-acre site at Factory Road, Cambois, between QTS's campus and the West Sleekburn scheme. Northumberland County Council's screening opinion, reported in September 2026, found that a full environmental impact assessment is required, citing cumulative traffic, protected-site and generator-emission impacts. Construction would take about 24 months, with operation expected between 2030 and 2035. No application has been submitted.

Admin note: Held for review. Pre-application only; consider tracking without publishing.

Sources: [TBC Partners explores second Cambois data centre](https://www.placenortheast.co.uk/tbc-partners-explores-second-cambois-data-centre/)

### Anthropic data centre, Teesworks (former Redcar steelworks)

Private Eye reported in June 2026 that Anthropic had agreed in principle to buy 222 acres of the Teesworks site for £1m an acre, plus £40m for an electricity link, with further payments if 1,400 MW of power is supplied by 31 December 2029. Tees Valley Mayor Ben Houchen said the deal had not yet been signed. Anthropic has not confirmed it. No planning application has been made, and the land and power figures are deal terms, not facility capacity.

Admin note: Held: unconfirmed land deal based on Private Eye reporting. Do not publish until Anthropic or Teesworks confirms, or a planning application appears. The Teesworks AI Growth Zone status is not confirmed on GOV.UK.

Sources: [Ben Houchen responds to Teesworks 'deal of the century'](https://northeastbylines.co.uk/business/ben-houchen-responds-to-teesworks-deal-of-the-century/)

### Microsoft Eggborough datacentre (former Eggborough Power Station)

Microsoft consulted on a new datacentre on part of the former Eggborough Power Station site in February 2024; North Yorkshire Council described it as a 1.2m sq ft data centre. At the time it said it aimed to apply to North Yorkshire Council in mid-2024, clear the site by late 2026 and start construction in early 2027. No data centre planning application or later update has been traced. The 2025 applications on the wider power station site are for other employment plots by Core 62 (Eggborough) Ltd.

Admin note: Held: search the North Yorkshire Council register for a planning application before publishing.

Sources: [Eggborough datacentre project updates](https://local.microsoft.com/blog/eggborough-datacentre-project-updates/); [Executive Member for Open to Business report](https://edemocracy.northyorks.gov.uk/documents/s30325/Executive%20Mewmber%20for%20Open%20to%20Business%20-%20Councillor%20Derek%20Bastiman.pdf); [Microsoft ramps up UK data center expansion with plans for new Yorkshire site](https://www.itpro.com/infrastructure/data-centres/microsoft-ramps-up-uk-data-center-expansion-with-plans-for-new-yorkshire-site)

### Thames Valley Park Data Centre, Earley

A proposal for a data centre of about 72 MW IT load on about 5.3 ha at Thames Valley Park, Earley, replacing three office buildings occupied by Microsoft. The project team consulted in July 2026 and planned to apply to Wokingham Borough Council in autumn 2026. It cites more than £200m of construction investment, up to 245 construction jobs and at least 115 operational roles. The BBC reports Microsoft is not involved. A petition against it has more than 4,000 signatures.

Admin note: Held: developer not named. Check whether the application has been lodged.

Sources: [Thames Valley Park Data Centre](https://www.tvpdc.co.uk/); [Thousands sign petition against proposed data centre](https://www.bbc.com/news/articles/cly4vqzkwzyo); [Data centre planned for Microsoft UK HQ at Thames Valley Park](https://www.bbc.co.uk/news/articles/cpv3xremevlo)

### Vantage Data Centers LHR2, Park Royal

Vantage Data Centers' second London campus, a £250m, 20 MW IT facility with 18,000 sq m (194,000 sq ft) in Park Royal. Vantage, headquartered in Denver, announced on 11 September 2025 that it would open at the end of that month; trade reports since describe it as operating.

Admin note: Held for review. Local planning authority (Ealing, Brent or OPDC) and opening date not confirmed. Check for overlap with premier-park-park-royal (SEGRO) before publishing.

Sources: [Vantage Data Centers announces opening of second London campus with landmark public art installation](https://vantage-dc.com/news/vantage-data-centers-announces-opening-of-second-london-campus-with-landmark-public-art-installation/)
