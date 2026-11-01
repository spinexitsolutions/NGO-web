import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { createSeed } from "./seed";
import type { CollectionKey, DB, SingletonKey } from "./types";

/**
 * Tiny JSON-file database.
 *  - Seeded automatically on first run from src/lib/seed.ts
 *  - Writes to DATA_DIR (default ./data). If that is read-only (e.g. serverless),
 *    falls back to the OS temp dir so the demo keeps working.
 *  - Swap this file for Postgres / Supabase / Sanity later — every caller goes through these helpers.
 */

const g = globalThis as unknown as { __ummeedDb?: DB; __ummeedDir?: string; __ummeedLock?: Promise<void> };

const candidates = () => [process.env.DATA_DIR || path.join(process.cwd(), "data"), path.join("/tmp", "ummeed-data")];

async function resolveDir(): Promise<string> {
  if (g.__ummeedDir) return g.__ummeedDir;
  for (const dir of candidates()) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const probe = path.join(dir, ".write-test");
      await fs.writeFile(probe, "ok");
      await fs.unlink(probe);
      g.__ummeedDir = dir;
      return dir;
    } catch {
      /* try next */
    }
  }
  throw new Error("No writable data directory available");
}

export async function dataDir() {
  return resolveDir();
}

export async function getDb(): Promise<DB> {
  if (g.__ummeedDb) return g.__ummeedDb;
  const dir = await resolveDir();
  const file = path.join(dir, "db.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    // merge with seed so new keys added later still exist
    g.__ummeedDb = { ...createSeed(), ...parsed } as DB;
  } catch {
    g.__ummeedDb = createSeed();
    await persist(g.__ummeedDb);
  }
  return g.__ummeedDb;
}

async function persist(db: DB) {
  const dir = await resolveDir();
  const file = path.join(dir, "db.json");
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2));
  await fs.rename(tmp, file);
}

/** Serialise writes so concurrent requests don't clobber each other. */
export async function mutate<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const prev = g.__ummeedLock ?? Promise.resolve();
  let release!: () => void;
  g.__ummeedLock = new Promise<void>((r) => (release = r));
  await prev;
  try {
    const db = await getDb();
    const result = await fn(db);
    await persist(db);
    return result;
  } finally {
    release();
  }
}

export async function resetDb() {
  return mutate((db) => {
    const fresh = createSeed();
    for (const k of Object.keys(fresh) as (keyof DB)[]) {
      (db as unknown as Record<string, unknown>)[k] = fresh[k];
    }
    return true;
  });
}

export function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export const PREFIX: Record<CollectionKey, string> = {
  nav: "nav",
  sections: "sec",
  stats: "st",
  programs: "prg",
  campaigns: "cmp",
  events: "evt",
  posts: "pst",
  team: "tm",
  testimonials: "ts",
  gallery: "gl",
  partners: "pt",
  faqs: "fq",
  reports: "rp",
  allocation: "al",
  donors: "dnr",
  donations: "don",
  volunteers: "vol",
  messages: "msg",
  subscribers: "sub",
  registrations: "reg",
};

export type { CollectionKey, SingletonKey };
