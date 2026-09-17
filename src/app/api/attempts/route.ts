import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/attempts  { attempts: [{ id, correct, timeMs? }] }
// Stores practice attempts for the logged-in user. Anonymous attempts are
// accepted but not persisted (client keeps them in-memory for the results screen).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const attempts = body?.attempts;
  if (!Array.isArray(attempts) || attempts.length === 0) {
    return NextResponse.json({ error: "attempts array is required" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ saved: 0, anonymous: true });

  const ids = [...new Set(attempts.map((a) => String(a.id)))];
  const existing = await db.question.findMany({ where: { id: { in: ids } }, select: { id: true } });
  const valid = new Set(existing.map((q) => q.id));

  const rows = attempts
    .filter((a) => valid.has(String(a.id)) && typeof a.correct === "boolean")
    .map((a) => ({
      userId: user.id,
      questionId: String(a.id),
      correct: a.correct,
      timeMs: typeof a.timeMs === "number" ? Math.round(a.timeMs) : null,
    }));

  if (rows.length) await db.attempt.createMany({ data: rows });
  return NextResponse.json({ saved: rows.length });
}
