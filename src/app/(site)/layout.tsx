import Footer from "@/components/site/Footer";
import SiteShell from "@/components/site/SiteShell";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const safeColor = (c: string) => (/^#[0-9a-fA-F]{3,8}$/.test(c) ? c : "#ff4d1c");

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const db = await getDb();
  const { settings, intro, nav } = db;
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
      >
        <main className="relative z-10 min-h-dvh bg-paper">{children}</main>
        <Footer settings={settings} nav={nav} />
      </SiteShell>
    </>
  );
}
