import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/*
  Development only: review comments pinned to the page (CommentMode) are stored in .dev-comments.json
  in the repository root, so they can be read in the editor or by an agent. Not available in production.
*/
export type DevComment = {
  id: string;
  createdAt: string;
  page: string;
  viewport: number;
  section: string;
  element: string;
  snippet: string;
  x: number;
  y: number;
  note: string;
  done?: boolean;
};

const FILE = path.join(process.cwd(), ".dev-comments.json");

async function load(): Promise<DevComment[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as DevComment[];
  } catch {
    return [];
  }
}

async function save(list: DevComment[]) {
  await writeFile(FILE, JSON.stringify(list, null, 2) + "\n", "utf8");
}

function guard() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  return null;
}

export async function GET() {
  return guard() ?? NextResponse.json(await load());
}

export async function POST(req: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  const body = (await req.json()) as Omit<DevComment, "id" | "createdAt">;
  const note = String(body.note ?? "").trim().slice(0, 2000);
  if (!note) return NextResponse.json({ error: "Prázdny komentár" }, { status: 400 });
  const comment: DevComment = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    page: String(body.page ?? "/").slice(0, 200),
    viewport: Number(body.viewport) || 0,
    section: String(body.section ?? "").slice(0, 200),
    element: String(body.element ?? "").slice(0, 300),
    snippet: String(body.snippet ?? "").slice(0, 160),
    x: Number(body.x) || 0,
    y: Number(body.y) || 0,
    note,
  };
  const list = await load();
  list.push(comment);
  await save(list);
  return NextResponse.json(comment);
}

export async function PATCH(req: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  const { id, done } = (await req.json()) as { id: string; done: boolean };
  const list = await load();
  const c = list.find((x) => x.id === id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  c.done = Boolean(done);
  await save(list);
  return NextResponse.json(c);
}

export async function DELETE(req: Request) {
  const blocked = guard();
  if (blocked) return blocked;
  const { id } = (await req.json()) as { id: string };
  const list = await load();
  await save(list.filter((x) => x.id !== id));
  return NextResponse.json({ ok: true });
}
