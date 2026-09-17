import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { subjectById } from "@/lib/site";

export const dynamic = "force-dynamic";

// GET /api/progress — accuracy totals, per-subject, per-domain, and recent attempts.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const attempts = await db.attempt.findMany({
    where: { userId: user.id },
    include: { question: { select: { subject: true, domain: true, prompt: true } } },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;

  const bySubjectMap = new Map<string, { attempts: number; correct: number }>();
  const byDomainMap = new Map<string, { subject: string; domain: string; attempts: number; correct: number }>();

  for (const a of attempts) {
    const s = bySubjectMap.get(a.question.subject) ?? { attempts: 0, correct: 0 };
    s.attempts++; if (a.correct) s.correct++;
    bySubjectMap.set(a.question.subject, s);

    const key = `${a.question.subject}|||${a.question.domain}`;
    const d = byDomainMap.get(key) ?? { subject: a.question.subject, domain: a.question.domain, attempts: 0, correct: 0 };
    d.attempts++; if (a.correct) d.correct++;
    byDomainMap.set(key, d);
  }

  const pct = (c: number, t: number) => (t ? Math.round((c / t) * 100) : 0);

  return NextResponse.json({
    totals: { attempts: total, correct, accuracy: pct(correct, total) },
    bySubject: [...bySubjectMap.entries()].map(([subject, s]) => ({
      subject: subjectById(subject)?.name ?? subject,
      attempts: s.attempts, correct: s.correct, accuracy: pct(s.correct, s.attempts),
    })),
    byDomain: [...byDomainMap.values()].map((d) => ({
      subject: subjectById(d.subject)?.name ?? d.subject,
      domain: d.domain, attempts: d.attempts, correct: d.correct, accuracy: pct(d.correct, d.attempts),
    })).sort((a, b) => a.accuracy - b.accuracy),
    recent: attempts.slice(0, 10).map((a) => ({
      id: a.id, correct: a.correct, createdAt: a.createdAt,
      question: { subject: subjectById(a.question.subject)?.name ?? a.question.subject, domain: a.question.domain, prompt: a.question.prompt },
    })),
  });
}
