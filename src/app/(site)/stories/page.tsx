import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import StoriesGrid from "@/components/site/StoriesGrid";

export const metadata: Metadata = { title: "Stories" };

export default async function StoriesPage() {
  const { posts } = await getDb();
  const published = posts.filter((p) => p.status === "published").sort((a, b) => Number(b.featured) - Number(a.featured) || b.publishedAt.localeCompare(a.publishedAt));
  return (
    <>
      <PageHeader eyebrow="Stories" title="Notes from" accent="the field." text="Long reads, short updates and the people who make the work possible — written by our team on the ground." />
      <StoriesGrid posts={published} />
    </>
  );
}
