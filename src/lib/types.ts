// ─────────────────────────────────────────────────────────────
//  Ummeed — data model shared by the public site, CMS and CRM
// ─────────────────────────────────────────────────────────────

export type Status = "published" | "draft";

export interface SiteSettings {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  accent: string; // hex — drives the whole site's accent colour
  email: string;
  phone: string;
  address: string;
  hours: string;
  mapQuery: string;
  socials: { instagram: string; x: string; facebook: string; linkedin: string; youtube: string };
  legal: { reg80G: string; fcra: string; csr: string; pan: string };
  announcement: { enabled: boolean; text: string; link: string };
  donateLabel: string;
  footerNote: string;
  seoTitle: string;
  seoDescription: string;
}

export interface IntroSettings {
  enabled: boolean;
  words: string[];
  duration: number; // ms
  oncePerSession: boolean;
  tagline: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  image: string; // preview image in the expanded menu
}

export interface HomeSection {
  id: "hero" | "manifesto" | "stats" | "programs" | "campaigns" | "impact" | "stories" | "events" | "testimonials" | "gallery" | "partners" | "cta";
  label: string;
  visible: boolean;
}

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  titleLine2: string;
  subtitle: string;
  image: string;
  sideImages: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  manifesto: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  prefix: string;
  suffix: string;
}

export interface AboutContent {
  headline: string;
  intro: string;
  mission: string;
  vision: string;
  story: string;
  image: string;
  values: { title: string; text: string }[];
  milestones: { year: string; title: string; text: string }[];
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  image: string;
  color: string;
  beneficiaries: number;
  locations: number;
  featured: boolean;
  status: Status;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  summary: string;
  story: string;
  image: string;
  goal: number;
  raised: number;
  donors: number;
  endDate: string;
  urgent: boolean;
  programId: string;
  status: "active" | "completed" | "draft";
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  date: string; // ISO date
  time: string;
  location: string;
  capacity: number;
  status: Status;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // paragraphs separated by blank lines; "## " for headings, "> " for quotes
  cover: string;
  author: string;
  category: string;
  readTime: number;
  publishedAt: string;
  featured: boolean;
  status: Status;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  group: "leadership" | "board" | "field";
  order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  caption: string;
  category: string;
}

export interface Partner {
  id: string;
  name: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Report {
  id: string;
  title: string;
  year: string;
  kind: string;
  size: string;
  url: string;
}

export interface Allocation {
  id: string;
  label: string;
  value: number; // percent
}

// ───────────── CRM ─────────────

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  pan: string;
  type: "individual" | "corporate";
  tags: string[];
  notes: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  email: string;
  amount: number;
  frequency: "one-time" | "monthly";
  campaignId: string;
  campaignTitle: string;
  method: "UPI" | "Card" | "NetBanking";
  status: "completed" | "pending" | "failed" | "refunded";
  receiptNo: string;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  interests: string[];
  availability: string;
  message: string;
  status: "new" | "contacted" | "onboarded" | "inactive";
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  seats: number;
  createdAt: string;
}

export interface DB {
  settings: SiteSettings;
  intro: IntroSettings;
  nav: NavItem[];
  sections: HomeSection[];
  hero: HeroContent;
  stats: Stat[];
  about: AboutContent;
  programs: Program[];
  campaigns: Campaign[];
  events: EventItem[];
  posts: Post[];
  team: TeamMember[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  partners: Partner[];
  faqs: FAQ[];
  reports: Report[];
  allocation: Allocation[];
  donors: Donor[];
  donations: Donation[];
  volunteers: Volunteer[];
  messages: Message[];
  subscribers: Subscriber[];
  registrations: Registration[];
}

export const SINGLETONS = ["settings", "intro", "hero", "about"] as const;
export type SingletonKey = (typeof SINGLETONS)[number];

export const COLLECTIONS = [
  "nav",
  "sections",
  "stats",
  "programs",
  "campaigns",
  "events",
  "posts",
  "team",
  "testimonials",
  "gallery",
  "partners",
  "faqs",
  "reports",
  "allocation",
  "donors",
  "donations",
  "volunteers",
  "messages",
  "subscribers",
  "registrations",
] as const;
export type CollectionKey = (typeof COLLECTIONS)[number];
