import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import GalleryGrid from "@/components/site/GalleryGrid";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const { gallery } = await getDb();
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Seen" accent="on the ground." text="Photographs from our learning centres, clinics, kitchens and villages — shared with consent, never staged." />
      <GalleryGrid items={gallery} />
    </>
  );
}
