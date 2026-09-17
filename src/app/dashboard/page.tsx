"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Progress = {
  totals: { attempts: number; correct: number; accuracy: number };
  bySubject: { subject: string; attempts: number; correct: number; accuracy: number }[];
  byDomain: { subject: string; domain: string; attempts: number; correct: number; accuracy: number }[];
  recent: { id: string; correct: boolean; createdAt: string; question: { subject: string; domain: string; prompt: string } }[];
};

export default function Dashboard() {
  const [data, setData] = useState<Progress | null>(null);
  const [status, setStatus] = useState<"loading" | "empty" | "ready" | "login">("loading");

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => {
        if (r.status === 401) { setStatus("login"); return null; }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setData(d);
        setStatus(d.totals.attempts === 0 ? "empty" : "ready");
      })
      .catch(() => setStatus("login"));
  }, []);

  if (status === "loading") return <p className="text-slate-500">Loading your progress…</p>;
  if (status === "login")
    return (
      <div className="card mx-auto max-w-md text-center">
        <h1 className="text-2xl font-extrabold">Log in to see your dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Your practice attempts are saved to your account so you can track weak spots over time.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="btn-primary flex-1">Log in</Link>
          <Link href="/signup" className="btn-secondary flex-1">Sign up</Link>
        </div>
      </div>
    );
  if (status === "empty" || !data)
    return (
      <div className="card mx-auto max-w-md text-center">
        <h1 className="text-2xl font-extrabold">No practice yet</h1>
        <p className="mt-2 text-sm text-slate-600">Complete a practice set and your accuracy by topic will show up here.</p>
        <Link href="/practice" className="btn-primary mt-6 w-full">Start practicing</Link>
      </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Your dashboard</h1>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="card text-center">
          <p className="text-4xl font-extrabold text-brand-700">{data.totals.accuracy}%</p>
          <p className="text-sm text-slate-500">Overall accuracy</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-extrabold text-brand-700">{data.totals.attempts}</p>
          <p className="text-sm text-slate-500">Questions attempted</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-extrabold text-brand-700">{data.totals.correct}</p>
          <p className="text-sm text-slate-500">Correct answers</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">By subject</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.bySubject.map((s) => (
            <div key={s.subject} className="card">
              <div className="flex items-center justify-between">
                <p className="font-bold">{s.subject}</p>
                <p className={`font-extrabold ${s.accuracy >= 80 ? "text-green-600" : s.accuracy >= 60 ? "text-amber-600" : "text-red-600"}`}>{s.accuracy}%</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-brand-600" style={{ width: `${s.accuracy}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-500">{s.correct}/{s.attempts} correct</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">By topic <span className="text-sm font-normal text-slate-500">(drill your reds first)</span></h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.byDomain.map((d) => (
            <div key={d.subject + d.domain} className="card !p-4">
              <p className="text-xs text-slate-500">{d.subject}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{d.domain}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${d.accuracy >= 80 ? "bg-green-100 text-green-700" : d.accuracy >= 60 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-700"}`}>
                  {d.accuracy}%
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{d.correct}/{d.attempts} correct</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Recent attempts</h2>
        {data.recent.map((r) => (
          <div key={r.id} className="card !p-4 text-sm">
            <span className="mr-2">{r.correct ? "✅" : "❌"}</span>
            <span className="font-semibold">{r.question.subject}</span>
            <span className="text-slate-500"> · {r.question.domain} · </span>
            <span className="text-slate-600">{r.question.prompt.slice(0, 80)}…</span>
          </div>
        ))}
      </section>
    </div>
  );
}
