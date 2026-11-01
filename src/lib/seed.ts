import type { DB, Donation, Donor, Message, Registration, Subscriber, Volunteer } from "./types";

export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Curated, verified Unsplash photos
const P = {
  kidsSmile: "1488521787991-ed7bbaae773c",
  kidsClass: "1542810634-71277d95dcbb",
  kidsMonument: "1594708767771-a7502209ff51",
  kidsGroup: "1497486751825-1233686d5d80",
  kidsDesk: "1497375638960-ca368c7231e4",
  ruralSchool: "1490424660416-359912d314b3",
  kidsDrawing: "1588072432836-e10032774350",
  kidStudy: "1529390079861-591de354faf5",
  booksApple: "1503676260728-1c00da094a0b",
  books: "1456513080510-7bf3a84b82f8",
  vaccine: "1576765608535-5f04d1e3f289",
  holdHands: "1584515933487-779824d29309",
  clinic: "1551076805-e1869033e561",
  doctor: "1612531386530-97286d97c2d2",
  water: "1538300342682-cf57afb97285",
  foodBoxes: "1593113646773-028c64a8f1b8",
  donationBox: "1593113598332-cd288d649433",
  foodDrive: "1609139003551-ee40f5f73ec0",
  truck: "1593113630400-ea4288922497",
  sapling: "1542601906990-b4d3fb778b09",
  seedlings: "1466692476868-aef1dfb1e735",
  leaves: "1518531933037-91b2f5f229cc",
  farmer: "1535090467336-9501f96eef89",
  beach: "1618477461853-cf6ed80faba5",
  teamOrange: "1617450365226-9bf28c04e130",
  mentors: "1560252829-804f1aedf1be",
  volunteer: "1559027615-cd4628902d4a",
  handsCircle: "1531206715517-5c0ba140b2b8",
  handsHeart: "1469571486292-0ba58a3f068b",
  group: "1517486808906-6ca8b3f04846",
  reach: "1544027993-37dbfe43562a",
  coins: "1532629345422-7515f3d16bb6",
  heartSunset: "1516589178581-6cd7833ae3b2",
  sunsetGroup: "1511632765486-a01980e01a18",
  beachGroup: "1511895426328-dc8714191300",
  field: "1500382017468-9049fed747ef",
  kidsAfrica: "1509099836639-18ba1795216d",
  girlPaint: "1503454537195-1dcabb73ffb9",
  boyPeek: "1504159506876-f8338247a14a",
  sisters: "1607453998774-d533f65dac99",
  schoolWalk: "1594608661623-aa0bd3a69d98",
  futureLeader: "1536640712-4d4c36ff0e4e",
  oldMan: "1509059852496-f3822ae057bf",
  dad: "1609220136736-443140cffec6",
  produce: "1488459716781-31db52582fe9",
  // portraits
  w1: "1438761681033-6461ffad8d80",
  m1: "1472099645785-5658abf4ff4e",
  w2: "1494790108377-be9c29b29330",
  m2: "1500648767791-00dcc994a43e",
  m3: "1506794778202-cad84cf45f1d",
  w3: "1573496359142-b8d87734a5a2",
  w4: "1580489944761-15a19d654956",
  w5: "1544005313-94ddf0286df2",
  m4: "1519085360753-af0119f7cbe7",
};

// ── deterministic PRNG so the seeded CRM looks the same every time ──
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Aarav", "Diya", "Kabir", "Ananya", "Vihaan", "Ishita", "Arjun", "Meera", "Rohan", "Saanvi", "Aditya", "Kavya", "Nikhil", "Riya", "Siddharth", "Tara", "Rahul", "Neha", "Karan", "Pooja", "Imran", "Fatima", "Gurpreet", "Simran", "Joseph", "Anita", "Varun", "Lakshmi", "Dev", "Zoya"];
const LAST = ["Sharma", "Iyer", "Mehta", "Reddy", "Kapoor", "Nair", "Gupta", "Singh", "Khan", "Das", "Patel", "Bose", "Menon", "Joshi", "Rao", "D'Souza", "Verma", "Chatterjee"];
const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Kolkata", "Jaipur", "Lucknow", "Ahmedabad", "Indore", "Kochi"];
const CORPS = ["Northwind Tech Pvt Ltd", "Saffron Capital", "Banyan Foods", "Meridian Logistics", "Indigo Mills"];

function buildCrm() {
  const rnd = mulberry32(2026);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
  const now = new Date("2026-11-01T10:00:00+05:30").getTime();
  const day = 86400000;

  const donors: Donor[] = [];
  for (let i = 0; i < 42; i++) {
    const corporate = i < CORPS.length;
    const name = corporate ? CORPS[i] : `${pick(FIRST)} ${pick(LAST)}`;
    const slug = name.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "");
    donors.push({
      id: `dnr_${(i + 1).toString().padStart(3, "0")}`,
      name,
      email: corporate ? `csr@${slug.split(".")[0]}.in` : `${slug}@mail.com`,
      phone: `+91 9${Math.floor(100000000 + rnd() * 899999999)}`,
      city: pick(CITIES),
      pan: `${String.fromCharCode(65 + Math.floor(rnd() * 26))}${String.fromCharCode(65 + Math.floor(rnd() * 26))}${corporate ? "C" : "P"}${"AB"[Math.floor(rnd() * 2)]}K${Math.floor(1000 + rnd() * 8999)}${String.fromCharCode(65 + Math.floor(rnd() * 26))}`,
      type: corporate ? "corporate" : "individual",
      tags: corporate ? ["CSR", "Major donor"] : rnd() > 0.7 ? ["Monthly"] : rnd() > 0.85 ? ["Major donor"] : [],
      notes: corporate ? "Annual CSR partner — send quarterly impact report." : "",
      createdAt: new Date(now - Math.floor(rnd() * 400) * day).toISOString(),
    });
  }

  const campaigns = [
    { id: "cmp_1", title: "Monsoon Classrooms" },
    { id: "cmp_2", title: "1 Lakh Meals This Winter" },
    { id: "cmp_3", title: "Clean Water for Barmer" },
    { id: "cmp_4", title: "Her First Cycle" },
    { id: "", title: "General Fund" },
  ];
  const donations: Donation[] = [];
  for (let i = 0; i < 180; i++) {
    const d = pick(donors);
    const c = pick(campaigns);
    const daysAgo = Math.floor(Math.pow(rnd(), 1.25) * 365);
    const base = d.type === "corporate" ? 50000 + Math.floor(rnd() * 20) * 25000 : [500, 1000, 1500, 2500, 5000, 10000, 2000, 3000][Math.floor(rnd() * 8)];
    const statusRoll = rnd();
    donations.push({
      id: `don_${(i + 1).toString().padStart(4, "0")}`,
      donorId: d.id,
      donorName: d.name,
      email: d.email,
      amount: base,
      frequency: d.tags.includes("Monthly") ? "monthly" : "one-time",
      campaignId: c.id,
      campaignTitle: c.title,
      method: (["UPI", "UPI", "Card", "NetBanking"] as const)[Math.floor(rnd() * 4)],
      status: statusRoll > 0.95 ? "failed" : statusRoll > 0.9 ? "pending" : statusRoll > 0.885 ? "refunded" : "completed",
      receiptNo: `UMF/26-27/${(1000 + i).toString()}`,
      createdAt: new Date(now - daysAgo * day - Math.floor(rnd() * day)).toISOString(),
    });
  }
  donations.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const interests = ["Teaching", "Healthcare camps", "Food drives", "Tree plantation", "Fundraising", "Photography", "Tech & design", "Mentorship"];
  const volunteers: Volunteer[] = [];
  const vStatus: Volunteer["status"][] = ["new", "new", "contacted", "onboarded", "onboarded", "inactive"];
  for (let i = 0; i < 24; i++) {
    const name = `${pick(FIRST)} ${pick(LAST)}`;
    volunteers.push({
      id: `vol_${(i + 1).toString().padStart(3, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@mail.com`,
      phone: `+91 8${Math.floor(100000000 + rnd() * 899999999)}`,
      city: pick(CITIES),
      interests: [pick(interests), pick(interests)].filter((v, idx, a) => a.indexOf(v) === idx),
      availability: pick(["Weekends", "Weekdays (evening)", "2–4 hrs / week", "Full-time for a month", "Remote only"]),
      message: pick([
        "I have taught maths for 6 years and would love to help with the learning centres.",
        "Doctor by profession — happy to join health camps twice a month.",
        "Student at IIT, can help with your website and data dashboards.",
        "I run a small bakery and can help with the winter meal drive.",
        "Photographer, would love to document your field work.",
      ]),
      status: pick(vStatus),
      createdAt: new Date(now - Math.floor(rnd() * 120) * day).toISOString(),
    });
  }
  volunteers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const subjects: [string, string][] = [
    ["CSR partnership for FY 26-27", "We are a mid-size IT company in Pune looking to commit our CSR budget towards education. Could we set up a call next week?"],
    ["80G receipt not received", "I donated ₹5,000 last week via UPI but haven't received my 80G receipt yet. Transaction ref attached."],
    ["School visit with students", "Our school would like to bring 30 Class 9 students to visit one of your learning centres in Thane."],
    ["Media interview request", "I'm a journalist with a national daily writing about grassroots education models. Would your founder be available?"],
    ["Donating books", "We have about 400 children's books (Hindi + English) to donate. Do you accept book donations?"],
    ["Corporate volunteering day", "Looking to bring 50 employees for a one-day volunteering activity in December."],
    ["Thank you!", "My daughter's school was part of Monsoon Classrooms. The new roof made such a difference. Thank you."],
  ];
  const messages: Message[] = subjects.map(([subject, message], i) => {
    const name = `${pick(FIRST)} ${pick(LAST)}`;
    return {
      id: `msg_${(i + 1).toString().padStart(3, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@mail.com`,
      subject,
      message,
      status: (["unread", "unread", "unread", "read", "replied", "read", "archived"] as const)[i],
      createdAt: new Date(now - i * 1.7 * day).toISOString(),
    };
  });

  const subscribers: Subscriber[] = Array.from({ length: 64 }, (_, i) => {
    const name = `${pick(FIRST)}.${pick(LAST)}`.toLowerCase().replace(/[^a-z.]+/g, "");
    return {
      id: `sub_${(i + 1).toString().padStart(3, "0")}`,
      email: `${name}${i}@mail.com`,
      status: rnd() > 0.92 ? "unsubscribed" : "active",
      createdAt: new Date(now - Math.floor(rnd() * 300) * day).toISOString(),
    };
  });

  const registrations: Registration[] = Array.from({ length: 38 }, (_, i) => {
    const name = `${pick(FIRST)} ${pick(LAST)}`;
    const ev = pick([
      { id: "evt_1", title: "Run for Ummeed — 10K" },
      { id: "evt_2", title: "Winter Blanket Drive" },
      { id: "evt_3", title: "Annual Gala: Stories of Hope" },
    ]);
    return {
      id: `reg_${(i + 1).toString().padStart(3, "0")}`,
      eventId: ev.id,
      eventTitle: ev.title,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@mail.com`,
      phone: `+91 7${Math.floor(100000000 + rnd() * 899999999)}`,
      seats: 1 + Math.floor(rnd() * 3),
      createdAt: new Date(now - Math.floor(rnd() * 30) * day).toISOString(),
    };
  });

  return { donors, donations, volunteers, messages, subscribers, registrations };
}

export function createSeed(): DB {
  return {
    settings: {
      name: "Ummeed Foundation",
      shortName: "Ummeed",
      tagline: "Hope, built by hand.",
      description:
        "Ummeed is an Indian non-profit working across 14 states to put children in classrooms, food on plates, clean water in villages and dignity back into everyday life.",
      accent: "#FF4D1C",
      email: "hello@ummeed.org",
      phone: "+91 22 4012 7788",
      address: "3rd Floor, Kamala Mills Compound, Lower Parel, Mumbai 400013",
      hours: "Mon – Sat, 10:00 – 18:30 IST",
      mapQuery: "Kamala Mills Compound, Lower Parel, Mumbai",
      socials: {
        instagram: "https://instagram.com",
        x: "https://x.com",
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com",
        youtube: "https://youtube.com",
      },
      legal: { reg80G: "AAATU1234F/80G/2024-25", fcra: "083781234", csr: "CSR00012345", pan: "AAATU1234F" },
      announcement: { enabled: true, text: "Winter is here — help us serve 1 lakh warm meals", link: "/campaigns/one-lakh-meals" },
      donateLabel: "Donate",
      footerNote: "Every donation is eligible for 50% tax exemption under Section 80G of the Income Tax Act.",
      seoTitle: "Ummeed Foundation — Hope, built by hand",
      seoDescription: "Education, health, food security, water and climate programmes across India. Donate, volunteer or partner with Ummeed.",
    },
    intro: {
      enabled: true,
      words: ["Hope", "उम्मीद", "Dignity", "Care", "Ummeed"],
      duration: 2600,
      oncePerSession: true,
      tagline: "Since 2011 · 14 states · 2.4M lives",
    },
    nav: [
      { id: "nav_1", label: "About", href: "/about", visible: true, image: img(P.handsCircle, 900) },
      { id: "nav_2", label: "Programs", href: "/programs", visible: true, image: img(P.kidsClass, 900) },
      { id: "nav_3", label: "Campaigns", href: "/campaigns", visible: true, image: img(P.foodDrive, 900) },
      { id: "nav_4", label: "Impact", href: "/impact", visible: true, image: img(P.field, 900) },
      { id: "nav_5", label: "Stories", href: "/stories", visible: true, image: img(P.kidsMonument, 900) },
      { id: "nav_6", label: "Events", href: "/events", visible: true, image: img(P.sunsetGroup, 900) },
      { id: "nav_7", label: "Gallery", href: "/gallery", visible: true, image: img(P.schoolWalk, 900) },
      { id: "nav_8", label: "Volunteer", href: "/volunteer", visible: true, image: img(P.volunteer, 900) },
      { id: "nav_9", label: "Contact", href: "/contact", visible: true, image: img(P.reach, 900) },
    ],
    sections: [
      { id: "hero", label: "Hero", visible: true },
      { id: "manifesto", label: "Manifesto (scroll-reveal text)", visible: true },
      { id: "stats", label: "Impact numbers", visible: true },
      { id: "programs", label: "Programs (horizontal scroll)", visible: true },
      { id: "campaigns", label: "Live campaigns", visible: true },
      { id: "impact", label: "Where your ₹100 goes", visible: true },
      { id: "stories", label: "Stories", visible: true },
      { id: "testimonials", label: "Testimonials", visible: true },
      { id: "events", label: "Upcoming events", visible: true },
      { id: "gallery", label: "Gallery strip", visible: true },
      { id: "partners", label: "Partners marquee", visible: true },
      { id: "cta", label: "Final call-to-action", visible: true },
    ],
    hero: {
      eyebrow: "Ummeed Foundation · Est. 2011",
      titleLine1: "Every child",
      titleAccent: "deserves",
      titleLine2: "a tomorrow.",
      subtitle:
        "We work shoulder to shoulder with communities across India — classrooms, clinics, kitchens and clean water — so hope is not a privilege, but a promise.",
      image: img(P.kidsSmile, 2400),
      sideImages: [img(P.kidsClass, 900), img(P.water, 900), img(P.sapling, 900)],
      ctaPrimary: "Give hope today",
      ctaSecondary: "See our work",
      manifesto:
        "We believe change doesn't arrive in grand gestures. It arrives as a mid-day meal, a mended roof, a nurse who shows up on time, a girl who cycles to school. Small, stubborn acts of care — repeated until they become the way things are.",
    },
    stats: [
      { id: "st_1", label: "Lives touched", value: 2.4, prefix: "", suffix: "M+" },
      { id: "st_2", label: "Villages reached", value: 1860, prefix: "", suffix: "" },
      { id: "st_3", label: "Learning centres", value: 312, prefix: "", suffix: "" },
      { id: "st_4", label: "Of every ₹ goes to the field", value: 87, prefix: "", suffix: "%" },
    ],
    about: {
      headline: "A small promise, kept at scale.",
      intro:
        "Ummeed began in 2011 with a borrowed room, eleven children and one blackboard in Dharavi. Today we are 640 people strong, working in 14 states — but we still measure ourselves one child, one family, one village at a time.",
      mission:
        "To build lasting, community-owned systems for education, health, nutrition and climate resilience in India's most underserved regions.",
      vision: "An India where where you're born never decides how far you go.",
      story:
        "Our founder, Meera Iyer, was a schoolteacher who noticed that the brightest girl in her class stopped coming after Class 6. The reason was a 9 km walk and no toilet at school. Meera raised ₹40,000 from neighbours, bought cycles, and built a toilet. The girl — Sunita — is now a civil engineer. That is the Ummeed model: find the real barrier, remove it, and stay until the community can carry it forward on its own.",
      image: img(P.teamOrange, 1800),
      values: [
        { title: "Community first", text: "Every programme is co-designed with the people it serves. We listen before we build." },
        { title: "Radical transparency", text: "Audited accounts, public dashboards and a receipt for every rupee — no exceptions." },
        { title: "Stay the course", text: "We commit to a village for at least seven years. Change that lasts takes time." },
        { title: "Dignity always", text: "No pity photos, no saviour stories. Partners, not beneficiaries." },
      ],
      milestones: [
        { year: "2011", title: "One room in Dharavi", text: "11 children, a blackboard and a borrowed room." },
        { year: "2014", title: "First 50 learning centres", text: "Expanded across Mumbai's informal settlements." },
        { year: "2017", title: "Health & nutrition", text: "Launched mobile clinics and mid-day kitchens in Maharashtra." },
        { year: "2020", title: "Pandemic response", text: "Served 4.2 million meals and set up 120 oxygen beds." },
        { year: "2023", title: "Water & climate", text: "Revived 340 traditional water bodies in Rajasthan and MP." },
        { year: "2026", title: "2.4 million lives", text: "14 states, 1,860 villages, and still growing." },
      ],
    },
    programs: [
      {
        id: "prg_1", slug: "education", title: "Education", category: "Learning",
        summary: "312 learning centres bridging the gap between school and real understanding.",
        body: "Our learning centres run after school hours in community spaces. Trained local tutors — 70% of them women — work with small groups using activity-based methods in the child's home language.\n\nWe track every child's reading and numeracy level each quarter, and work with government schools to share what works. Since 2011, 1.1 lakh children have completed our foundational literacy programme.\n\n## What your support funds\n\nTutor stipends, learning kits, digital libraries, and scholarships for girls to continue into secondary school.",
        image: img(P.kidsDesk, 1800), color: "#FF4D1C", beneficiaries: 112000, locations: 312, featured: true, status: "published",
      },
      {
        id: "prg_2", slug: "health", title: "Health", category: "Care",
        summary: "Mobile clinics and trained health workers bringing primary care to the last mile.",
        body: "Twenty-two mobile clinics travel to villages more than 15 km from the nearest health centre. Each van carries a doctor, a nurse, essential medicines and diagnostics.\n\nWe also train ASHA workers in maternal care, nutrition counselling and early detection of anaemia and TB.\n\n## What your support funds\n\nClinic operations, medicines, maternal health kits and health-worker training.",
        image: img(P.vaccine, 1800), color: "#2F6BFF", beneficiaries: 640000, locations: 410, featured: true, status: "published",
      },
      {
        id: "prg_3", slug: "nutrition", title: "Nutrition", category: "Food",
        summary: "Community kitchens and ration support so no child learns on an empty stomach.",
        body: "Our 48 community kitchens are run by women's self-help groups who are paid fairly for their work. Meals are planned with nutritionists using local, seasonal produce.\n\nDuring emergencies, our ration network can reach 50,000 families within 72 hours.\n\n## What your support funds\n\nHot meals, dry ration kits, kitchen equipment and SHG wages.",
        image: img(P.foodDrive, 1800), color: "#F2A007", beneficiaries: 980000, locations: 48, featured: true, status: "published",
      },
      {
        id: "prg_4", slug: "water", title: "Water", category: "Climate",
        summary: "Reviving traditional johads, wells and step-wells in drought-hit districts.",
        body: "Working with village water committees, we desilt and restore traditional water structures, install rooftop rainwater harvesting in schools and test water quality.\n\nEvery restored johad recharges groundwater for an average of 1,200 people.\n\n## What your support funds\n\nExcavation, masonry, water testing kits and committee training.",
        image: img(P.water, 1800), color: "#0FA3B1", beneficiaries: 410000, locations: 340, featured: true, status: "published",
      },
      {
        id: "prg_5", slug: "climate", title: "Climate", category: "Climate",
        summary: "Community forests and climate-smart farming for a greener, fairer future.",
        body: "We have planted 1.8 million native saplings with a 78% survival rate, maintained by local youth who are paid as forest guardians.\n\nOur farmer field schools teach low-cost, climate-resilient methods to smallholder farmers.\n\n## What your support funds\n\nSaplings, guardian stipends, seed banks and farmer training.",
        image: img(P.sapling, 1800), color: "#1F9D55", beneficiaries: 150000, locations: 220, featured: true, status: "published",
      },
      {
        id: "prg_6", slug: "women", title: "Women", category: "Livelihood",
        summary: "Skills, savings groups and cycles — so women lead their own futures.",
        body: "Our women's collectives run savings groups, learn market-linked skills and access micro-credit. Girls in our programme receive cycles, menstrual health support and mentorship.\n\n## What your support funds\n\nSkill training, cycles for girls, seed capital and mentorship.",
        image: img(P.teamOrange, 1800), color: "#C2378B", beneficiaries: 86000, locations: 190, featured: true, status: "published",
      },
    ],
    campaigns: [
      {
        id: "cmp_1", slug: "monsoon-classrooms", title: "Monsoon Classrooms",
        summary: "Fix 120 leaking school roofs before the next monsoon so learning never stops.",
        story: "Every monsoon, thousands of children in rural Maharashtra lose up to 40 school days because their classroom roofs leak or collapse. ₹25,000 repairs one classroom for a decade.\n\nWe work with the school management committee, local masons and the block education office to complete repairs in the dry months.",
        image: img(P.ruralSchool, 1800), goal: 3000000, raised: 2140000, donors: 1284, endDate: "2027-03-31", urgent: false, programId: "prg_1", status: "active",
      },
      {
        id: "cmp_2", slug: "one-lakh-meals", title: "1 Lakh Meals This Winter",
        summary: "Hot, nutritious meals for families sleeping rough in North India's coldest months.",
        story: "When temperatures drop below 5°C, daily-wage families face an impossible choice between food and warmth. Our community kitchens in Delhi, Lucknow and Jaipur will serve 1,00,000 hot meals between December and February.\n\n₹40 feeds one person a full, hot meal.",
        image: img(P.foodBoxes, 1800), goal: 4000000, raised: 2860000, donors: 2310, endDate: "2027-02-28", urgent: true, programId: "prg_3", status: "active",
      },
      {
        id: "cmp_3", slug: "clean-water-barmer", title: "Clean Water for Barmer",
        summary: "Restore 40 traditional johads and bring safe water to 48,000 people in the Thar.",
        story: "In Barmer, women walk an average of 6 km a day for water. Restoring the village johad cuts that walk to under 500 metres and recharges wells for years.\n\nEach johad is maintained by a trained village water committee.",
        image: img(P.water, 1800), goal: 6000000, raised: 1950000, donors: 860, endDate: "2027-05-15", urgent: false, programId: "prg_4", status: "active",
      },
      {
        id: "cmp_4", slug: "her-first-cycle", title: "Her First Cycle",
        summary: "5,000 cycles for girls who would otherwise drop out because school is too far.",
        story: "Distance is the number one reason girls drop out after Class 8 in rural India. A ₹4,500 cycle cuts a 90-minute walk to 25 minutes — and keeps her in school.",
        image: img(P.schoolWalk, 1800), goal: 2250000, raised: 2250000, donors: 1710, endDate: "2026-08-15", urgent: false, programId: "prg_6", status: "completed",
      },
    ],
    events: [
      {
        id: "evt_1", slug: "run-for-ummeed-10k", title: "Run for Ummeed — 10K",
        summary: "A sunrise run along Marine Drive. Every kilometre funds a week of school for a child.",
        description: "Join 3,000 runners for our annual charity run along Mumbai's Queen's Necklace. Choose 5K or 10K, or walk the 3K family route.\n\nRegistration includes a race tee, medal and breakfast. All proceeds go to the Education programme.",
        image: img(P.sunsetGroup, 1800), date: "2026-12-14", time: "05:45 AM", location: "Marine Drive, Mumbai", capacity: 3000, status: "published",
      },
      {
        id: "evt_2", slug: "winter-blanket-drive", title: "Winter Blanket Drive",
        summary: "Spend an evening distributing blankets and hot meals across Old Delhi.",
        description: "Volunteers meet at our Daryaganj kitchen, pack kits and head out in small teams with our field staff. Warm clothing recommended. Ages 16+.",
        image: img(P.truck, 1800), date: "2026-12-21", time: "07:00 PM", location: "Daryaganj, New Delhi", capacity: 120, status: "published",
      },
      {
        id: "evt_3", slug: "annual-gala-stories-of-hope", title: "Annual Gala: Stories of Hope",
        summary: "An evening of music, film and the people behind 15 years of Ummeed.",
        description: "Our annual gala brings together donors, partners and community leaders. Featuring a short documentary premiere, a live performance and a dinner prepared by our community kitchen chefs.",
        image: img(P.heartSunset, 1800), date: "2027-01-24", time: "07:30 PM", location: "NCPA, Mumbai", capacity: 400, status: "published",
      },
      {
        id: "evt_4", slug: "plant-a-forest-day", title: "Plant-a-Forest Day",
        summary: "Help plant 10,000 native saplings with village youth in Nashik.",
        description: "A full-day outing with transport from Mumbai and Pune. Lunch provided. Bring a cap and a water bottle.",
        image: img(P.seedlings, 1800), date: "2027-02-08", time: "07:00 AM", location: "Igatpuri, Nashik", capacity: 250, status: "published",
      },
    ],
    posts: [
      {
        id: "pst_1", slug: "sunita-cycles-to-school", title: "Sunita cycles 9 km to school. Now she builds bridges.",
        excerpt: "The girl who inspired Ummeed is now a civil engineer. We went back to her village to see what changed.",
        content: "When Sunita was eleven, the walk to school took ninety minutes each way. By Class 6, she had stopped going.\n\nOur founder Meera was her teacher. She noticed the empty bench, walked to Sunita's home, and asked a question no one had asked before: what would it take for you to come back?\n\n> \"A cycle. And a toilet at school.\"\n\n## Fifteen years later\n\nToday Sunita designs rural bridges for the state PWD. The school she went to now has 4 toilets, a library and 60% girls in Class 10.\n\nHer story is the reason we start every programme by asking, not telling.",
        cover: img(P.schoolWalk, 1800), author: "Meera Iyer", category: "Education", readTime: 5, publishedAt: "2026-10-18", featured: true, status: "published",
      },
      {
        id: "pst_2", slug: "the-johad-that-came-back", title: "The johad that came back",
        excerpt: "How one village in Barmer revived a 200-year-old water body — and its future.",
        content: "For twenty years, the johad in Kawas village was a dry, cracked depression in the earth.\n\nIn 2023, the village water committee — eight women and four men — decided to revive it. Ummeed provided engineering support and funding; the village provided labour and leadership.\n\n## The first monsoon\n\nThe johad filled in 11 days. Wells within a 2 km radius rose by 4 metres. Women's daily walk for water fell from 6 km to 400 metres.\n\n> \"Now my daughter goes to school in the morning, not to the well.\"",
        cover: img(P.water, 1800), author: "Arjun Mehta", category: "Water", readTime: 4, publishedAt: "2026-09-30", featured: false, status: "published",
      },
      {
        id: "pst_3", slug: "a-day-in-a-mobile-clinic", title: "A day inside a mobile clinic",
        excerpt: "142 patients, 7 villages, one van. We rode along with Dr. Farah Khan.",
        content: "The van leaves at 6:40 AM. By 8:00, there's already a queue at the first stop.\n\nDr. Farah sees 142 patients today — mostly fevers, a few pregnancies, one suspected TB case that will now get tested and treated.\n\n## Why the last mile matters\n\nFor these villages, the nearest public health centre is 22 km away. The clinic visits every 10 days, like clockwork.",
        cover: img(P.vaccine, 1800), author: "Diya Nair", category: "Health", readTime: 6, publishedAt: "2026-09-12", featured: false, status: "published",
      },
      {
        id: "pst_4", slug: "kitchens-run-by-women", title: "The kitchens run by women, for everyone",
        excerpt: "Our community kitchens pay fair wages to 600 women — and feed 30,000 people a day.",
        content: "Every Ummeed kitchen is run by a women's self-help group. They plan the menu, buy local produce and are paid a fair monthly wage.\n\n## More than a meal\n\nFor many of the women, it's their first ever bank account and first salary in their own name.",
        cover: img(P.foodDrive, 1800), author: "Kavya Reddy", category: "Nutrition", readTime: 4, publishedAt: "2026-08-21", featured: false, status: "published",
      },
      {
        id: "pst_5", slug: "18-lakh-trees-later", title: "18 lakh trees later",
        excerpt: "What we learned planting native forests with village youth — and why survival rate matters more than count.",
        content: "Planting is easy. Keeping a sapling alive for three summers is the real work.\n\nThat's why we pay local youth as forest guardians for three years after planting. Our survival rate is 78% — nearly double the national average.",
        cover: img(P.sapling, 1800), author: "Rohan Das", category: "Climate", readTime: 5, publishedAt: "2026-07-08", featured: false, status: "published",
      },
    ],
    team: [
      { id: "tm_1", name: "Meera Iyer", role: "Founder & CEO", bio: "Former schoolteacher. Started Ummeed with 11 children in Dharavi.", image: img(P.w3, 900), group: "leadership", order: 1 },
      { id: "tm_2", name: "Arjun Mehta", role: "Director, Programmes", bio: "15 years in rural development across Rajasthan and MP.", image: img(P.m2, 900), group: "leadership", order: 2 },
      { id: "tm_3", name: "Farah Khan", role: "Head of Health", bio: "MBBS, MPH. Leads our 22 mobile clinics.", image: img(P.w4, 900), group: "leadership", order: 3 },
      { id: "tm_4", name: "Rohan Das", role: "Head of Climate", bio: "Ecologist. Has planted more trees than he can count.", image: img(P.m3, 900), group: "leadership", order: 4 },
      { id: "tm_5", name: "Kavya Reddy", role: "Head of Partnerships", bio: "Ex-consultant who now builds CSR partnerships that last.", image: img(P.w2, 900), group: "leadership", order: 5 },
      { id: "tm_6", name: "Vikram Rao", role: "Chair, Board of Trustees", bio: "Former banker and lifelong education advocate.", image: img(P.m1, 900), group: "board", order: 6 },
      { id: "tm_7", name: "Ananya Bose", role: "Trustee", bio: "Chartered accountant, chairs our audit committee.", image: img(P.w1, 900), group: "board", order: 7 },
      { id: "tm_8", name: "Kabir Singh", role: "Field Lead, Rajasthan", bio: "Grew up in Barmer. Leads our water work.", image: img(P.m4, 900), group: "field", order: 8 },
    ],
    testimonials: [
      { id: "ts_1", quote: "Ummeed didn't come to save us. They came to work with us. That is why the johad is still full.", name: "Kamla Devi", role: "Water committee head, Kawas", image: img(P.w5, 600) },
      { id: "ts_2", quote: "Our CSR partnership with Ummeed is the only one where I can see every rupee on a dashboard.", name: "Rahul Kapoor", role: "CSR Head, Northwind Tech", image: img(P.m1, 600) },
      { id: "ts_3", quote: "I came for one weekend of teaching. Three years later, I still haven't left.", name: "Tara Menon", role: "Volunteer, Pune", image: img(P.w2, 600) },
    ],
    gallery: [
      { id: "gl_1", src: img(P.kidsClass, 1400), caption: "Morning assembly, Thane learning centre", category: "Education" },
      { id: "gl_2", src: img(P.water, 1400), caption: "First water from the restored johad", category: "Water" },
      { id: "gl_3", src: img(P.kidsMonument, 1400), caption: "Play is learning too", category: "Education" },
      { id: "gl_4", src: img(P.foodDrive, 1400), caption: "Ration kits ready for dispatch", category: "Nutrition" },
      { id: "gl_5", src: img(P.sapling, 1400), caption: "Sapling #1,800,000", category: "Climate" },
      { id: "gl_6", src: img(P.vaccine, 1400), caption: "Vaccination day, Nandurbar", category: "Health" },
      { id: "gl_7", src: img(P.teamOrange, 1400), caption: "The field team, Nashik", category: "People" },
      { id: "gl_8", src: img(P.kidsDrawing, 1400), caption: "Art class at the centre", category: "Education" },
      { id: "gl_9", src: img(P.beach, 1400), caption: "Versova beach clean-up", category: "Climate" },
      { id: "gl_10", src: img(P.mentors, 1400), caption: "Mentor circles for girls", category: "People" },
      { id: "gl_11", src: img(P.foodBoxes, 1400), caption: "Winter meal drive", category: "Nutrition" },
      { id: "gl_12", src: img(P.handsCircle, 1400), caption: "Volunteer orientation", category: "People" },
    ],
    partners: ["Northwind Tech", "Saffron Capital", "Banyan Foods", "Meridian", "Indigo Mills", "Kite Foundation", "Lotus Bank", "Monsoon Labs"].map((name, i) => ({ id: `pt_${i + 1}`, name })),
    faqs: [
      { id: "fq_1", question: "Is my donation tax-deductible?", answer: "Yes. Ummeed is registered under Section 80G, so Indian donors get a 50% tax deduction. Your 80G receipt is emailed automatically within 24 hours.", category: "Donations" },
      { id: "fq_2", question: "Can I donate from outside India?", answer: "Yes. We are FCRA registered and accept international donations via card. US donors can give tax-efficiently through our partner fund.", category: "Donations" },
      { id: "fq_3", question: "How much of my money reaches the field?", answer: "87% of every rupee goes directly to programmes. 8% goes to fundraising and 5% to administration. Our audited accounts are published every year.", category: "Transparency" },
      { id: "fq_4", question: "Can I cancel a monthly donation?", answer: "Anytime, with one email. No questions asked.", category: "Donations" },
      { id: "fq_5", question: "How do I become a volunteer?", answer: "Fill in the volunteer form. Our team will call you within a week to match you with a role based on your skills and availability.", category: "Volunteering" },
      { id: "fq_6", question: "Does my company qualify for CSR with Ummeed?", answer: "Yes. We are CSR-1 registered and work with 40+ companies. Write to partners@ummeed.org for a proposal.", category: "Partnerships" },
    ],
    reports: [
      { id: "rp_1", title: "Annual Report 2025–26", year: "2026", kind: "Annual report", size: "8.4 MB", url: "#" },
      { id: "rp_2", title: "Audited Financials FY 2025–26", year: "2026", kind: "Financials", size: "2.1 MB", url: "#" },
      { id: "rp_3", title: "Annual Report 2024–25", year: "2025", kind: "Annual report", size: "7.9 MB", url: "#" },
      { id: "rp_4", title: "Audited Financials FY 2024–25", year: "2025", kind: "Financials", size: "1.9 MB", url: "#" },
      { id: "rp_5", title: "Water Programme Impact Study", year: "2025", kind: "Research", size: "3.2 MB", url: "#" },
    ],
    allocation: [
      { id: "al_1", label: "Education", value: 34 },
      { id: "al_2", label: "Health", value: 22 },
      { id: "al_3", label: "Nutrition", value: 17 },
      { id: "al_4", label: "Water & climate", value: 14 },
      { id: "al_5", label: "Fundraising", value: 8 },
      { id: "al_6", label: "Administration", value: 5 },
    ],
    ...buildCrm(),
  };
}
