import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminCookieValid } from "@/lib/auth";

export const dynamic = "force-dynamic";

function requireAdmin(req: NextRequest) {
  return isAdminCookieValid(req.headers.get("cookie"));
}

// GET /api/admin/questions — full list for the admin dashboard
export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const questions = await db.question.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ questions });
}

// POST /api/admin/questions — create
export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);

  const subject = String(body?.subject ?? "").trim();
  const domain = String(body?.domain ?? "").trim();
  const difficulty = String(body?.difficulty ?? "medium").trim();
  const prompt = String(body?.prompt ?? "").trim();
  const explanation = String(body?.explanation ?? "").trim();
  const correctText = String(body?.correctText ?? "").trim();
  const choices = Array.isArray(body?.choices) && body.choices.length ? body.choices.map(String) : null;
  const correctIndex = choices !== null && Number.isInteger(body?.correctIndex) ? body.correctIndex : null;

  if (!subject || !domain || !prompt || !explanation || !correctText) {
    return NextResponse.json({ error: "subject, domain, prompt, explanation, and correctText are required." }, { status: 400 });
  }
  if (choices && (correctIndex === null || correctIndex < 0 || correctIndex >= choices.length)) {
    return NextResponse.json({ error: "correctIndex must be a valid 0-based index into choices." }, { status: 400 });
  }
  if (choices && choices[correctIndex as number] !== correctText) {
    return NextResponse.json({ error: "correctText must exactly match the choice at correctIndex." }, { status: 400 });
  }

  const q = await db.question.create({
    data: { subject, domain, difficulty, prompt, choices: choices ?? undefined, correctIndex, correctText, explanation },
  });
  return NextResponse.json({ ok: true, question: q });
}
