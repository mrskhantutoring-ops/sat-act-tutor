import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminCookieValid } from "@/lib/auth";

export const dynamic = "force-dynamic";

function requireAdmin(req: NextRequest) {
  return isAdminCookieValid(req.headers.get("cookie"));
}

// PUT /api/admin/questions/[id] — update
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);

  const data: Record<string, unknown> = {};
  for (const k of ["subject", "domain", "difficulty", "prompt", "explanation", "correctText"]) {
    if (typeof body?.[k] === "string") data[k] = body[k];
  }
  if (body?.choices === null) {
    data.choices = null;
    data.correctIndex = null;
  } else if (Array.isArray(body?.choices) && body.choices.length) {
    data.choices = body.choices.map(String);
    data.correctIndex = Number.isInteger(body?.correctIndex) ? body.correctIndex : null;
  }

  const q = await db.question.update({ where: { id: params.id }, data: data as never }).catch(() => null);
  if (!q) return NextResponse.json({ error: "Question not found." }, { status: 404 });
  return NextResponse.json({ ok: true, question: q });
}

// DELETE /api/admin/questions/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db.question.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
