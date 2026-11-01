import { promises as fs } from "fs";
import path from "path";
import { dataDir } from "@/lib/db";

const TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif" };

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-z0-9-]+\.(jpg|png|webp|gif|avif)$/.test(file)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(await dataDir(), "uploads", file));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": TYPES[path.extname(file)], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
