import type { CollectionKey } from "./types";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "image"
  | "images"
  | "select"
  | "toggle"
  | "date"
  | "tags"
  | "color"
  | "slug"
  | "url"
  | "email"
  | "repeater";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: (string | { value: string; label: string })[];
  optionsFrom?: { collection: CollectionKey; label: string; empty?: string };
  placeholder?: string;
  help?: string;
  full?: boolean; // span both columns
  rows?: number;
  from?: string; // slug source key
  fields?: Field[]; // repeater
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export type ColumnKind = "text" | "image" | "money" | "date" | "badge" | "toggle" | "progress" | "number" | "color" | "muted";
export interface Column {
  key: string;
  label: string;
  kind?: ColumnKind;
  hideOnMobile?: boolean;
}

export interface ResourceSchema {
  name: CollectionKey;
  title: string;
  singular: string;
  description: string;
  group: "CMS" | "Site" | "CRM";
  view: "table" | "grid";
  titleKey: string;
  subtitleKey?: string;
  imageKey?: string;
  reorderable?: boolean;
  searchKeys: string[];
  filter?: { key: string; label: string; options: string[] };
  columns: Column[];
  fields: Field[];
  defaults: Record<string, unknown>;
  previewHref?: (row: Record<string, unknown>) => string;
}

const STATUS: Field = { key: "status", label: "Status", type: "select", options: ["published", "draft"] };

export const SCHEMAS: Partial<Record<string, ResourceSchema>> = {
  programs: {
    name: "programs",
    title: "Programs",
    singular: "Program",
    description: "The core areas of work shown on /programs and the home page scroller.",
    group: "CMS",
    view: "grid",
    titleKey: "title",
    subtitleKey: "summary",
    imageKey: "image",
    reorderable: true,
    searchKeys: ["title", "category", "summary"],
    filter: { key: "status", label: "Status", options: ["published", "draft"] },
    columns: [
      { key: "image", label: "", kind: "image" },
      { key: "title", label: "Program" },
      { key: "category", label: "Category", kind: "muted" },
      { key: "beneficiaries", label: "Beneficiaries", kind: "number" },
      { key: "status", label: "Status", kind: "badge" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "slug", from: "title" },
      { key: "category", label: "Category", type: "text" },
      { key: "color", label: "Theme colour", type: "color" },
      { key: "summary", label: "Summary", type: "textarea", rows: 2, full: true },
      { key: "body", label: "Body", type: "textarea", rows: 10, full: true, help: "Blank line = new paragraph. Start a line with “## ” for a heading, “> ” for a quote." },
      { key: "image", label: "Cover image", type: "image", full: true },
      { key: "beneficiaries", label: "Beneficiaries", type: "number" },
      { key: "locations", label: "Locations", type: "number" },
      { key: "featured", label: "Featured on home", type: "toggle" },
      STATUS,
    ],
    defaults: { title: "", slug: "", category: "", color: "#FF4D1C", summary: "", body: "", image: "", beneficiaries: 0, locations: 0, featured: true, status: "draft" },
    previewHref: (r) => `/programs/${r.slug}`,
  },
  campaigns: {
    name: "campaigns",
    title: "Campaigns",
    singular: "Campaign",
    description: "Fundraising campaigns with goals, progress and deadlines.",
    group: "CMS",
    view: "grid",
    titleKey: "title",
    subtitleKey: "summary",
    imageKey: "image",
    searchKeys: ["title", "summary"],
    filter: { key: "status", label: "Status", options: ["active", "completed", "draft"] },
    columns: [
      { key: "image", label: "", kind: "image" },
      { key: "title", label: "Campaign" },
      { key: "raised", label: "Progress", kind: "progress" },
      { key: "endDate", label: "Ends", kind: "date", hideOnMobile: true },
      { key: "status", label: "Status", kind: "badge" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "slug", from: "title" },
      { key: "summary", label: "Summary", type: "textarea", rows: 2, full: true },
      { key: "story", label: "Story", type: "textarea", rows: 8, full: true },
      { key: "image", label: "Cover image", type: "image", full: true },
      { key: "goal", label: "Goal (₹)", type: "number", step: 1000 },
      { key: "raised", label: "Raised (₹)", type: "number", step: 1000 },
      { key: "donors", label: "Donor count", type: "number" },
      { key: "endDate", label: "End date", type: "date" },
      { key: "programId", label: "Linked program", type: "select", optionsFrom: { collection: "programs", label: "title", empty: "— None —" } },
      { key: "status", label: "Status", type: "select", options: ["active", "completed", "draft"] },
      { key: "urgent", label: "Mark as urgent", type: "toggle" },
    ],
    defaults: { title: "", slug: "", summary: "", story: "", image: "", goal: 1000000, raised: 0, donors: 0, endDate: "", urgent: false, programId: "", status: "draft" },
    previewHref: (r) => `/campaigns/${r.slug}`,
  },
  events: {
    name: "events",
    title: "Events",
    singular: "Event",
    description: "Runs, drives and galas. Registrations land in CRM → Registrations.",
    group: "CMS",
    view: "table",
    titleKey: "title",
    subtitleKey: "location",
    imageKey: "image",
    searchKeys: ["title", "location"],
    filter: { key: "status", label: "Status", options: ["published", "draft"] },
    columns: [
      { key: "image", label: "", kind: "image" },
      { key: "title", label: "Event" },
      { key: "date", label: "Date", kind: "date" },
      { key: "location", label: "Location", kind: "muted", hideOnMobile: true },
      { key: "capacity", label: "Capacity", kind: "number", hideOnMobile: true },
      { key: "status", label: "Status", kind: "badge" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "slug", from: "title" },
      { key: "summary", label: "Summary", type: "textarea", rows: 2, full: true },
      { key: "description", label: "Description", type: "textarea", rows: 6, full: true },
      { key: "image", label: "Cover image", type: "image", full: true },
      { key: "date", label: "Date", type: "date" },
      { key: "time", label: "Time", type: "text", placeholder: "07:00 PM" },
      { key: "location", label: "Location", type: "text" },
      { key: "capacity", label: "Capacity", type: "number" },
      STATUS,
    ],
    defaults: { title: "", slug: "", summary: "", description: "", image: "", date: "", time: "", location: "", capacity: 100, status: "draft" },
    previewHref: (r) => `/events/${r.slug}`,
  },
  posts: {
    name: "posts",
    title: "Stories",
    singular: "Story",
    description: "Blog posts and field stories.",
    group: "CMS",
    view: "table",
    titleKey: "title",
    subtitleKey: "excerpt",
    imageKey: "cover",
    searchKeys: ["title", "author", "category"],
    filter: { key: "status", label: "Status", options: ["published", "draft"] },
    columns: [
      { key: "cover", label: "", kind: "image" },
      { key: "title", label: "Title" },
      { key: "author", label: "Author", kind: "muted", hideOnMobile: true },
      { key: "category", label: "Category", kind: "muted", hideOnMobile: true },
      { key: "publishedAt", label: "Published", kind: "date", hideOnMobile: true },
      { key: "status", label: "Status", kind: "badge" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, full: true },
      { key: "slug", label: "URL slug", type: "slug", from: "title" },
      { key: "category", label: "Category", type: "text" },
      { key: "excerpt", label: "Excerpt", type: "textarea", rows: 2, full: true },
      { key: "content", label: "Content", type: "textarea", rows: 14, full: true, help: "Blank line = new paragraph. “## ” heading, “> ” pull-quote." },
      { key: "cover", label: "Cover image", type: "image", full: true },
      { key: "author", label: "Author", type: "text" },
      { key: "readTime", label: "Read time (min)", type: "number" },
      { key: "publishedAt", label: "Publish date", type: "date" },
      STATUS,
      { key: "featured", label: "Featured", type: "toggle" },
    ],
    defaults: { title: "", slug: "", excerpt: "", content: "", cover: "", author: "", category: "", readTime: 4, publishedAt: new Date().toISOString().slice(0, 10), featured: false, status: "draft" },
    previewHref: (r) => `/stories/${r.slug}`,
  },
  team: {
    name: "team",
    title: "Team",
    singular: "Team member",
    description: "Leadership, board and field team on the About page.",
    group: "CMS",
    view: "grid",
    titleKey: "name",
    subtitleKey: "role",
    imageKey: "image",
    reorderable: true,
    searchKeys: ["name", "role"],
    filter: { key: "group", label: "Group", options: ["leadership", "board", "field"] },
    columns: [
      { key: "image", label: "", kind: "image" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role", kind: "muted" },
      { key: "group", label: "Group", kind: "badge" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "text" },
      { key: "group", label: "Group", type: "select", options: ["leadership", "board", "field"] },
      { key: "order", label: "Sort order", type: "number" },
      { key: "bio", label: "Short bio", type: "textarea", rows: 3, full: true },
      { key: "image", label: "Portrait", type: "image", full: true },
    ],
    defaults: { name: "", role: "", bio: "", image: "", group: "leadership", order: 99 },
  },
  testimonials: {
    name: "testimonials",
    title: "Testimonials",
    singular: "Testimonial",
    description: "Voices from communities, partners and volunteers.",
    group: "CMS",
    view: "table",
    titleKey: "name",
    subtitleKey: "quote",
    imageKey: "image",
    reorderable: true,
    searchKeys: ["name", "quote", "role"],
    columns: [
      { key: "image", label: "", kind: "image" },
      { key: "name", label: "Name" },
      { key: "quote", label: "Quote", kind: "muted", hideOnMobile: true },
      { key: "role", label: "Role", kind: "muted", hideOnMobile: true },
    ],
    fields: [
      { key: "quote", label: "Quote", type: "textarea", rows: 4, full: true, required: true },
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role / place", type: "text" },
      { key: "image", label: "Photo", type: "image", full: true },
    ],
    defaults: { quote: "", name: "", role: "", image: "" },
  },
  gallery: {
    name: "gallery",
    title: "Gallery",
    singular: "Photo",
    description: "Photos for the gallery page and the home page strip.",
    group: "CMS",
    view: "grid",
    titleKey: "caption",
    subtitleKey: "category",
    imageKey: "src",
    reorderable: true,
    searchKeys: ["caption", "category"],
    columns: [
      { key: "src", label: "", kind: "image" },
      { key: "caption", label: "Caption" },
      { key: "category", label: "Category", kind: "badge" },
    ],
    fields: [
      { key: "src", label: "Image", type: "image", full: true, required: true },
      { key: "caption", label: "Caption", type: "text", full: true },
      { key: "category", label: "Category", type: "select", options: ["Education", "Health", "Nutrition", "Water", "Climate", "People"] },
    ],
    defaults: { src: "", caption: "", category: "People" },
  },
  partners: {
    name: "partners",
    title: "Partners",
    singular: "Partner",
    description: "Names shown in the partners marquee.",
    group: "CMS",
    view: "table",
    titleKey: "name",
    reorderable: true,
    searchKeys: ["name"],
    columns: [{ key: "name", label: "Partner" }],
    fields: [{ key: "name", label: "Name", type: "text", full: true, required: true }],
    defaults: { name: "" },
  },
  faqs: {
    name: "faqs",
    title: "FAQs",
    singular: "FAQ",
    description: "Frequently asked questions.",
    group: "CMS",
    view: "table",
    titleKey: "question",
    subtitleKey: "answer",
    reorderable: true,
    searchKeys: ["question", "answer", "category"],
    filter: { key: "category", label: "Category", options: ["Donations", "Transparency", "Volunteering", "Partnerships"] },
    columns: [
      { key: "question", label: "Question" },
      { key: "category", label: "Category", kind: "badge", hideOnMobile: true },
    ],
    fields: [
      { key: "question", label: "Question", type: "text", full: true, required: true },
      { key: "answer", label: "Answer", type: "textarea", rows: 5, full: true },
      { key: "category", label: "Category", type: "select", options: ["Donations", "Transparency", "Volunteering", "Partnerships", "General"] },
    ],
    defaults: { question: "", answer: "", category: "General" },
  },
  reports: {
    name: "reports",
    title: "Reports",
    singular: "Report",
    description: "Annual reports and audited financials on the Impact page.",
    group: "CMS",
    view: "table",
    titleKey: "title",
    subtitleKey: "kind",
    searchKeys: ["title", "kind", "year"],
    columns: [
      { key: "title", label: "Title" },
      { key: "kind", label: "Type", kind: "badge" },
      { key: "year", label: "Year", kind: "muted" },
      { key: "size", label: "Size", kind: "muted", hideOnMobile: true },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", full: true, required: true },
      { key: "kind", label: "Type", type: "select", options: ["Annual report", "Financials", "Research", "Policy"] },
      { key: "year", label: "Year", type: "text" },
      { key: "size", label: "File size", type: "text", placeholder: "2.4 MB" },
      { key: "url", label: "File URL", type: "url", full: true },
    ],
    defaults: { title: "", kind: "Annual report", year: String(new Date().getFullYear()), size: "", url: "#" },
  },
  allocation: {
    name: "allocation",
    title: "Fund allocation",
    singular: "Allocation line",
    description: "How every ₹100 is spent — shown on the home page and Impact page.",
    group: "CMS",
    view: "table",
    titleKey: "label",
    reorderable: true,
    searchKeys: ["label"],
    columns: [
      { key: "label", label: "Label" },
      { key: "value", label: "Share", kind: "number" },
    ],
    fields: [
      { key: "label", label: "Label", type: "text", required: true },
      { key: "value", label: "Percent", type: "number", min: 0, max: 100 },
    ],
    defaults: { label: "", value: 0 },
  },
  stats: {
    name: "stats",
    title: "Impact numbers",
    singular: "Stat",
    description: "Animated counters on the home page.",
    group: "CMS",
    view: "table",
    titleKey: "label",
    reorderable: true,
    searchKeys: ["label"],
    columns: [
      { key: "value", label: "Value", kind: "number" },
      { key: "label", label: "Label" },
      { key: "suffix", label: "Suffix", kind: "muted" },
    ],
    fields: [
      { key: "label", label: "Label", type: "text", full: true, required: true },
      { key: "prefix", label: "Prefix", type: "text", placeholder: "₹" },
      { key: "value", label: "Value", type: "number", step: 0.1 },
      { key: "suffix", label: "Suffix", type: "text", placeholder: "M+ / % / K" },
    ],
    defaults: { label: "", prefix: "", value: 0, suffix: "" },
  },
  nav: {
    name: "nav",
    title: "Navigation",
    singular: "Menu link",
    description: "Links in the navbar and the full-screen menu. Drag order with the arrows; hover image shows in the expanded menu.",
    group: "Site",
    view: "table",
    titleKey: "label",
    subtitleKey: "href",
    imageKey: "image",
    reorderable: true,
    searchKeys: ["label", "href"],
    columns: [
      { key: "image", label: "", kind: "image" },
      { key: "label", label: "Label" },
      { key: "href", label: "Link", kind: "muted" },
      { key: "visible", label: "Visible", kind: "toggle" },
    ],
    fields: [
      { key: "label", label: "Label", type: "text", required: true },
      { key: "href", label: "Link", type: "text", placeholder: "/about" },
      { key: "visible", label: "Visible", type: "toggle" },
      { key: "image", label: "Menu preview image", type: "image", full: true },
    ],
    defaults: { label: "", href: "/", visible: true, image: "" },
  },
};

// map URL segment → schema key
export const RESOURCE_ROUTES: Record<string, string> = {
  programs: "programs",
  campaigns: "campaigns",
  events: "events",
  stories: "posts",
  team: "team",
  testimonials: "testimonials",
  gallery: "gallery",
  partners: "partners",
  faqs: "faqs",
  reports: "reports",
  allocation: "allocation",
  stats: "stats",
  navigation: "nav",
};
