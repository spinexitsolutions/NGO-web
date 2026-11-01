import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { getDb } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getDb();
  return {
    title: { default: settings.seoTitle, template: `%s — ${settings.shortName}` },
    description: settings.seoDescription,
    openGraph: { title: settings.seoTitle, description: settings.seoDescription, type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
