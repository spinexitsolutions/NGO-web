import Footer from "@/components/site/Footer";
import SiteShell from "@/components/site/SiteShell";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const safeColor = (c: string) => (/^#[0-9a-fA-F]{3,8}$/.test(c) ? c : "#c6f24e");

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const db = await getDb();
  const { settings, intro, nav } = db;
  const live = db.campaigns.filter((c) => c.status === "active").sort((a, b) => Number(b.urgent) - Number(a.urgent))[0];
  const ticker = live ? { title: live.title, slug: live.slug, raised: live.raised, goal: live.goal } : null;
  const introScript = intro.enabled && intro.oncePerSession
    ? `try{if(sessionStorage.getItem('ummeed-intro-seen')==='1')document.documentElement.setAttribute('data-intro-seen','')}catch(e){}`
    : "";
  return (
    <>
      <style>{`:root{--accent:${safeColor(settings.accent)}}`}</style>
      {introScript && <script dangerouslySetInnerHTML={{ __html: introScript }} />}
      <SiteShell
        settings={{
          name: settings.name,
          shortName: settings.shortName,
          email: settings.email,
          phone: settings.phone,
          socials: settings.socials,
          donateLabel: settings.donateLabel,
          announcement: settings.announcement,
        }}
        intro={intro}
        nav={nav}
        ticker={ticker}
      >
        <main className="relative z-10 min-h-dvh bg-paper pb-0">{children}</main>
        <Footer settings={settings} nav={nav} />
      </SiteShell>
    </>
  );
}
