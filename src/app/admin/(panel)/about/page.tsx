import ContentForm, { type FormSection } from "@/components/admin/ContentForm";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";

const sections: FormSection[] = [
  {
    title: "Headline",
    description: "The opening of the About page.",
    fields: [
      { key: "headline", label: "Headline", type: "text", full: true },
      { key: "intro", label: "Intro paragraph", type: "textarea", rows: 4, full: true },
      { key: "image", label: "Hero image", type: "image" },
    ],
  },
  {
    title: "Mission & vision",
    fields: [
      { key: "mission", label: "Mission", type: "textarea", rows: 3 },
      { key: "vision", label: "Vision", type: "textarea", rows: 2 },
      { key: "story", label: "Our story", type: "textarea", rows: 7 },
    ],
  },
  {
    title: "Values",
    description: "The principles shown as cards.",
    fields: [{ key: "values", label: "Values", type: "repeater", fields: [{ key: "title", label: "Title", type: "text", full: true }, { key: "text", label: "Description", type: "textarea", rows: 2 }] }],
  },
  {
    title: "Milestones",
    description: "The timeline that animates on scroll.",
    fields: [
      {
        key: "milestones",
        label: "Milestones",
        type: "repeater",
        fields: [
          { key: "year", label: "Year", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Description", type: "textarea", rows: 2 },
        ],
      },
    ],
  },
];

export default async function Page() {
  const { about } = await getDb();
  return <ContentForm contentKey="about" initial={about as unknown as Record<string, unknown>} eyebrow="Content" title="About page" description="Your story, mission, values and timeline." sections={sections} previewHref="/about" />;
}
