import datetime
import logging
from database import SessionLocal, init_db
from models import User, Document, Tag, DocumentTag, SearchHistory
from auth import hash_password

logger = logging.getLogger("archiveai_seed")

SAMPLE_USERS = [
    {
        "email": "journalist@archiveai.org",
        "full_name": "Alex Morgan",
        "password": "archive2024",
        "role": "Senior Investigative Journalist"
    },
    {
        "email": "researcher@archiveai.org",
        "full_name": "Dr. Elena Rostova",
        "password": "researcher2024",
        "role": "Director of Media Research"
    },
    {
        "email": "admin@example.com",
        "full_name": "Sarah Jenkins",
        "password": "admin123",
        "role": "Chief Archive Curator"
    }
]

SAMPLE_DOCUMENTS = [
    {
        "archive_id": "ARCH-8821",
        "title": "EU Renewable Energy Directive 2023 Revisions and Grid Modernization",
        "content_type": "article",
        "author": "Dr. Elena Rostova",
        "source": "European Energy Policy Journal",
        "publication_date": "2023-10-12",
        "summary": "Comprehensive breakdown of the new subsidy structures for decentralized grids and statutory requirements for cross-border solar transmission across member states.",
        "content": """The revised European Union Renewable Energy Directive (RED III) establishes binding targets to raise the share of renewable energy in overall consumption to 42.5% by 2030. 

A central bottleneck identified in regional reporting is the severe administrative friction in permitting processes. Historically, utility-scale solar and onshore wind installations experienced permitting delays averaging 18 to 36 months. Under the new statutory guidelines, designated 'go-to renewable acceleration zones' will require environmental impact assessments to be concluded within 12 months.

Furthermore, the directive mandates significant investment in cross-border grid interconnectors to balance volatile load profiles between northern offshore wind corridors and southern photovoltaic hubs. Member states must establish synchronized transmission protocols and eliminate tariff penalties on decentralized peer-to-peer energy trading.""",
        "tags": ["Renewable Energy", "Policy", "EU Directive", "Solar Grid", "Infrastructure"]
    },
    {
        "archive_id": "ARCH-9104",
        "title": "Transcript: Ministry of Energy Policy Summit & Infrastructure Roundtable",
        "content_type": "interview",
        "author": "James Cole (Interviewer)",
        "interviewee": "Commissioner Marcus Vance",
        "location": "Brussels Convention Center",
        "source": "Continental Broadcasting Newsroom",
        "publication_date": "2023-11-04",
        "summary": "High-level interview detailing friction points in cross-border high-voltage direct current (HVDC) transmission lines and municipal battery storage subsidies.",
        "content": """COLE: Commissioner Vance, thank you for joining ArchiveAI Broadcast. Let's address the persistent delays in connecting Baltic wind farms to central distribution grids.

VANCE: The technical engineering isn't the primary barrier; rather, it is regulatory fragmentation across national borders. Each regional operator maintains divergent safety buffer thresholds and frequency regulation rules.

COLE: What about municipal battery storage projects funded under the 2022 emergency package?

VANCE: We have observed a 15% increase in funding requests from Baltic states and eastern municipalities. However, procurement cycles for high-density lithium iron phosphate cells have lengthened due to global supply chain constraints. We are recommending streamlined fast-track grants for facilities capable of 4-hour discharge capacity.""",
        "tags": ["Interview", "Energy Summit", "Transmission", "Battery Storage", "Policy"]
    },
    {
        "archive_id": "ARCH-8755",
        "title": "Legislative Proposals for Decentralized Wind Subsidies and Community Cooperatives",
        "content_type": "article",
        "author": "Policy Institute Brussels",
        "source": "Euro-Atlantic Economic Review",
        "publication_date": "2023-09-28",
        "summary": "Analysis of the 15% increase in municipal funding requests from Baltic states for community-owned micro-turbines and grid resilience.",
        "content": """Community energy cooperatives have emerged as a cornerstone of national energy independence strategies. Legislative proposals introduced in the European Parliament aim to allocate direct matching funds to citizen-led renewable initiatives.

The economic model demonstrates that localized power generation reduces transmission losses by up to 8.4% compared to centralized thermal generation. Several pilot projects in Denmark and northern Germany show that civic co-ownership dramatically reduces local opposition to turbine siting while ensuring revenues circulate within municipal economies.""",
        "tags": ["Wind Energy", "Subsidies", "Legislation", "Community Grid"]
    },
    {
        "archive_id": "ARCH-78412",
        "title": "Urban Renewal and Municipal Housing Reform Archive Notes",
        "content_type": "article",
        "author": "Mara Chen",
        "source": "Urban Policy Institute & Media Archive",
        "publication_date": "2023-09-12",
        "summary": "Emergency operations teams coordinated rapid response with local agencies, prioritizing housing support, transportation recovery, and public communication.",
        "content": """A longitudinal review of urban redevelopment in metropolitan zones reveals the critical importance of multi-agency alignment during crisis recovery. Emergency operations teams coordinated with municipal housing authorities to establish temporary modular shelters while restoring public transit corridors.

Key findings show that open communication protocols and centralized citizen dashboards improved public trust by 34% compared to fragmented municipal responses. The report highlights zoning amendments that incentivize mixed-income development and green public spaces.""",
        "tags": ["Urban Planning", "Housing Reform", "Crisis Response", "Public Infrastructure"]
    },
    {
        "archive_id": "ARCH-6320",
        "title": "Global AI Safety Summit: Ministerial Debates on Frontier Foundation Models",
        "content_type": "interview",
        "author": "Sarah Lin",
        "interviewee": "Prof. David Thorne & Dr. Amanda Sterling",
        "location": "Bletchley Park Conference Hall",
        "source": "International Tech Policy Archive",
        "publication_date": "2024-02-18",
        "summary": "Expert dialogue on open-weight risk assessments, synthetic data watermarking, and international audit standards for AI models.",
        "content": """LIN: Professor Thorne, how can independent auditors effectively evaluate closed proprietary models without compromising commercial trade secrets?

THORNE: We need sandboxed evaluation environments where verified third-party research consortia can execute automated red-teaming benchmarks and compute-level audits under strict cryptographic non-disclosure frameworks.

STERLING: I agree, and watermarking synthetic media at generation time must become a mandatory baseline. As synthetic voice and video reach indistinguishable fidelity, newsrooms and journalists must be equipped with verifiable provenance chains and C2PA cryptographic metadata.""",
        "tags": ["AI Regulation", "Safety Summit", "Interview", "Synthetic Media", "Tech Policy"]
    },
    {
        "archive_id": "ARCH-5519",
        "title": "Deep Sea Hydrothermal Vent Exploration Footage Notes",
        "content_type": "footage_notes",
        "author": "Oceanographic Research Expedition Alpha",
        "location": "Mariana Trench Basin (Lat 11.35 N, Long 142.20 E)",
        "source": "Global Marine Archive",
        "publication_date": "2024-01-20",
        "duration_seconds": 1840,
        "media_url": "https://example.com/footage/mariana_expedition_2024.mp4",
        "summary": "High-definition ROV footage logs documenting extremophile biodiversity, methane plumes, and mineral chimney formations at 6,200m depth.",
        "content": """[00:00:15] ROV Submersible descent reached 4,500m depth. Water temperature 2.1 C. External telemetry nominal.
[00:08:45] Visual contact with black smoker chimney field. Active hydrothermal effluent venting at 340 C.
[00:14:20] Specimen collection: Dense colony of Alvinella pompejana worms and symbiotic sulfur-oxidizing bacteria.
[00:22:10] Methane bubble plume detected via acoustic sonar. Camera zoomed to 4K resolution on basaltic pillow lava formations.
[00:28:50] Autonomous sensor pod deployed on seafloor for 6-month continuous seismic and acoustic monitoring.""",
        "tags": ["Marine Biology", "Footage Notes", "Oceanography", "Deep Sea", "Exploration"]
    },
    {
        "archive_id": "ARCH-4412",
        "title": "Central Bank Digital Currency (CBDC) Pilot Assessment and Privacy Protocols",
        "content_type": "article",
        "author": "Finance & Monetary Policy Board",
        "source": "International Journal of Central Banking",
        "publication_date": "2023-12-05",
        "summary": "Technical and legal evaluation of zero-knowledge proofs for offline retail CBDC transactions and sovereign reserve settlement.",
        "content": """The deployment of wholesale and retail Central Bank Digital Currencies requires balancing anti-money laundering (AML) compliance with civil liberty protections.

This paper outlines a two-tiered architectural framework: tier-one zero-knowledge cryptographic proofs allow low-value offline consumer payments without centralized ledger tracking, while tier-two settlement channels between registered commercial banks maintain full regulatory auditability.""",
        "tags": ["Economics", "CBDC", "Cryptographic Privacy", "Banking", "Monetary Policy"]
    },
    {
        "archive_id": "ARCH-3390",
        "title": "COP28 Climate Agreement Negotiations: Behind Closed Doors",
        "content_type": "interview",
        "author": "Rachel Vance",
        "interviewee": "Chief Climate Delegate Helena Sorensen",
        "location": "Dubai Media Center",
        "source": "Global Climate Reporting Network",
        "publication_date": "2023-12-14",
        "summary": "Detailed commentary on the loss-and-damage fund capitalization, methane emissions reduction timelines, and renewable tripling targets.",
        "content": """VANCE: Was the final phrasing on 'transitioning away from fossil fuels in energy systems' sufficient to drive real capital reallocation?

SORENSEN: It was an unprecedented compromise. For the first time in 28 years of COP declarations, the core text explicitly identifies fossil fuels as the primary driver of climate disruption.

VANCE: What are the binding financial commitments for developing island nations?

SORENSEN: The initial capitalization of $700 million for the Loss and Damage Fund represents an essential first deposit, but independent financial modeling estimates annual requirements of at least $100 billion by 2030.""",
        "tags": ["Climate Change", "COP28", "Interview", "Environmental Policy", "Global Accord"]
    },
    {
        "archive_id": "ARCH-2877",
        "title": "Arctic Permafrost Thaw and Methane Release Field Observations",
        "content_type": "footage_notes",
        "author": "Polar Science Observation Wing",
        "location": "Siberian Yamal Peninsula / Arctic Circle",
        "source": "Polar Research Institute",
        "publication_date": "2023-08-19",
        "duration_seconds": 2400,
        "media_url": "https://example.com/footage/arctic_permafrost_2023.mp4",
        "summary": "Drone and ground-level multispectral thermal imaging tracking thermokarst lake expansion, sinkhole craters, and atmospheric methane spikes.",
        "content": """[00:02:10] Drone aerial survey over sector B-12. Significant expansion of thermokarst lake perimeter by 18m since prior year.
[00:09:30] Laser absorption spectrometer indicates atmospheric methane concentration elevated at 2,450 ppb near crater rims.
[00:15:00] Soil core extraction at 3.5m depth revealing active biological microbial decomposition of pleistocene organic matter.
[00:27:40] Infrared thermal camera highlights rapid permafrost cliff slumping along riverbank.""",
        "tags": ["Arctic", "Climate", "Footage Notes", "Permafrost", "Methane"]
    },
    {
        "archive_id": "ARCH-1920",
        "title": "Biotechnology in Agriculture: CRISPR Gene-Editing for Drought Resilience",
        "content_type": "article",
        "author": "Dr. Tariq Al-Mansoor",
        "source": "Agronomic Innovations Quarterly",
        "publication_date": "2024-03-01",
        "summary": "Field trial results of targeted gene edits in cereal crops showing 28% higher yield retention under extreme water stress conditions.",
        "content": """Climate-driven precipitation volatility threatens global staple cereal production. Using CRISPR-Cas9 targeted genome editing, researchers deactivated specific negative regulatory transcription factors governing stomatal closure efficiency.

Over two successive trial seasons in semi-arid test plots, edited wheat and sorghum variants exhibited 28% higher grain yield and 19% improved root biomass development compared to wild-type controls, without altering protein nutritional profiles.""",
        "tags": ["Biotechnology", "Agriculture", "CRISPR", "Food Security", "Science"]
    },
    {
        "archive_id": "ARCH-1250",
        "title": "Emergency Response and Public Infrastructure Resilience Post-Flood",
        "content_type": "footage_notes",
        "author": "Civil Defense Taskforce & Disaster Media Unit",
        "location": "Rhine-Meuse Delta River Basin",
        "source": "Disaster Relief Visual Archive",
        "publication_date": "2023-07-16",
        "duration_seconds": 1260,
        "media_url": "https://example.com/footage/rhine_flood_response.mp4",
        "summary": "Field recording of mobile barrier deployment, levee stabilization, emergency satellite uplink activation, and evacuation logistics.",
        "content": """[00:01:00] Rapid deployment of demountable aluminum flood barriers along low-lying embankment sectors.
[00:05:30] High-capacity submersible diesel pumps discharging water at 5,000 cubic meters per hour back to main river channel.
[00:11:45] Emergency satellite Starlink terminal established at regional triage headquarters for civilian emergency dispatch.
[00:18:20] Structural engineering team inspects railway viaduct foundations using underwater ultrasonic sonar.""",
        "tags": ["Disaster Relief", "Footage Notes", "Infrastructure", "Flood Management", "Civil Defense"]
    },
    {
        "archive_id": "ARCH-0980",
        "title": "Investigation: Cross-Border Digital Surveillance and Spyware Procurement",
        "content_type": "article",
        "author": "Consortium of Investigative Reporters",
        "source": "Global Press Watchdog",
        "publication_date": "2024-01-10",
        "summary": "Forensic examination of zero-click exploit delivery chains targeting journalists, civil rights advocates, and legal professionals.",
        "content": """A seven-month forensic investigation reveals the proliferation of mercenary zero-click exploit kits sold to foreign intelligence agencies.

By analyzing mobile device network telemetry and memory dumps, security analysts identified zero-day vulnerabilities in MMS and image rendering subsystems. The investigation documents 42 verified cases of illicit device infiltration, calling for stringent export controls on commercial offensive cyber tools.""",
        "tags": ["Cybersecurity", "Investigative Journalism", "Surveillance", "Human Rights", "Tech Policy"]
    }
]

SAMPLE_SEARCHES = [
    {"query": "Renewable energy policy interview", "filters": "type:all", "results_count": 3},
    {"query": "EU Renewable Energy Directive", "filters": "type:article", "results_count": 2},
    {"query": "AI regulations safety summit", "filters": "type:interview", "results_count": 1},
    {"query": "Climate summit footage notes", "filters": "type:footage_notes", "results_count": 2},
    {"query": "Urban housing reform disaster response", "filters": "type:article", "results_count": 2},
    {"query": "Deep sea marine biology exploration", "filters": "type:footage_notes", "results_count": 1},
]

def seed_database():
    init_db()
    db = SessionLocal()
    try:
        # 1. Seed Users
        created_users = []
        for u_data in SAMPLE_USERS:
            existing = db.query(User).filter(User.email == u_data["email"]).first()
            if not existing:
                new_user = User(
                    email=u_data["email"],
                    full_name=u_data["full_name"],
                    password_hash=hash_password(u_data["password"]),
                    role=u_data["role"]
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                created_users.append(new_user)
                logger.info(f"Created sample user: {new_user.email}")
            else:
                created_users.append(existing)

        # 2. Seed Tags
        all_tag_names = set()
        for doc in SAMPLE_DOCUMENTS:
            for tag in doc.get("tags", []):
                all_tag_names.add(tag)

        tag_map = {}
        for tag_name in all_tag_names:
            tag_obj = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag_obj:
                tag_obj = Tag(name=tag_name)
                db.add(tag_obj)
                db.commit()
                db.refresh(tag_obj)
            tag_map[tag_name] = tag_obj

        # 3. Seed Documents
        for doc_data in SAMPLE_DOCUMENTS:
            existing_doc = db.query(Document).filter(Document.archive_id == doc_data["archive_id"]).first()
            tags_list = doc_data.get("tags", [])
            tags_str = ", ".join(tags_list)

            if not existing_doc:
                doc = Document(
                    archive_id=doc_data["archive_id"],
                    title=doc_data["title"],
                    content_type=doc_data["content_type"],
                    author=doc_data.get("author"),
                    interviewee=doc_data.get("interviewee"),
                    location=doc_data.get("location"),
                    source=doc_data.get("source", "Archive Collection"),
                    publication_date=doc_data.get("publication_date"),
                    summary=doc_data["summary"],
                    content=doc_data["content"],
                    media_url=doc_data.get("media_url"),
                    duration_seconds=doc_data.get("duration_seconds"),
                    language=doc_data.get("language", "en"),
                    tags_string=tags_str
                )
                db.add(doc)
                db.commit()
                db.refresh(doc)

                # Link tags
                for tag_name in tags_list:
                    if tag_name in tag_map:
                        doc_tag = DocumentTag(document_id=doc.id, tag_id=tag_map[tag_name].id)
                        db.add(doc_tag)
                db.commit()
                logger.info(f"Created sample document: {doc.archive_id} - {doc.title[:40]}...")

        # 4. Seed Searches
        first_user = created_users[0] if created_users else None
        for s in SAMPLE_SEARCHES:
            existing_search = db.query(SearchHistory).filter(SearchHistory.query == s["query"]).first()
            if not existing_search:
                search_entry = SearchHistory(
                    user_id=first_user.id if first_user else None,
                    query=s["query"],
                    filters=s["filters"],
                    results_count=s["results_count"],
                    created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=len(s["query"]))
                )
                db.add(search_entry)
        db.commit()
        logger.info("Sample searches populated successfully.")

        print("Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
