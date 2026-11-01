import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const { settings } = await getDb();
  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-[1.05fr_1fr]" style={{ ["--accent" as string]: settings.accent }}>
      <div className="relative hidden overflow-hidden lg:block">
        <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=80" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <div className="eyebrow mb-4 text-white/70">{settings.name}</div>
          <p className="max-w-lg text-[44px] font-semibold leading-[1.02] tracking-[-0.04em]">
            Run every rupee, every volunteer and every story — <span className="serif-accent">from one calm place.</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <Suspense>
          <LoginForm name={settings.shortName || settings.name} />
        </Suspense>
      </div>
    </div>
  );
}
