"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Question = {
  id: string;
  subject: string;
  domain: string;
  difficulty: string;
  prompt: string;
  choices: string[] | null;
  correctIndex: number | null;
  correctText: string;
  explanation: string;
};

type Phase = "setup" | "answering" | "results";

const TIMED_PRESETS: Record<string, { label: string; minutes: number; count: number }[]> = {
  "sat-math": [
    { label: "SAT Math module (22 Qs · 35 min)", minutes: 35, count: 22 },
    { label: "Quick drill (10 Qs · 12 min)", minutes: 12, count: 10 },
  ],
  "act-math": [
    { label: "ACT Math section (45 Qs · 50 min)", minutes: 50, count: 45 },
    { label: "Quick drill (10 Qs · 12 min)", minutes: 12, count: 10 },
  ],
  "sat-reading-writing": [
    { label: "SAT R&W module (27 Qs · 32 min)", minutes: 32, count: 27 },
    { label: "Quick drill (10 Qs · 12 min)", minutes: 12, count: 10 },
  ],
  "act-english": [
    { label: "ACT English section (50 Qs · 35 min)", minutes: 35, count: 50 },
    { label: "Quick drill (10 Qs · 10 min)", minutes: 10, count: 10 },
  ],
};

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function PracticeClient({
  subjectId,
  subjectName,
  domains,
}: {
  subjectId: string;
  subjectName: string;
  domains: string[];
}) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [domain, setDomain] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [mode, setMode] = useState<"untimed" | number>("untimed");
  const [count, setCount] = useState(10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [gridAnswer, setGridAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean; timeMs: number }[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [timeWarning, setTimeWarning] = useState<string | null>(null);
  const [shortNotice, setShortNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionStart = useRef<number>(Date.now());
  // Timestamp-based timer: immune to background-tab throttling, so timed sets stay honest.
  const deadlineRef = useRef<number | null>(null);
  const warnedRef = useRef({ five: false, one: false });
  const finishedRef = useRef(false);

  const timed = typeof mode === "number";

  const finish = useCallback(() => {
    setPhase("results");
    // Persist attempts for logged-in users (best effort; anonymous users keep local results)
    fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attempts: answers }),
    }).catch(() => {});
  }, [answers]);

  // Guard: the interval can fire as the set ends — finish exactly once
  // so attempts are never double-posted.
  const finishOnce = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    finish();
  }, [finish]);

  // Timer — derived from a deadline timestamp so switching tabs can't pause the clock.
  // Warns at 5 minutes and 1 minute remaining, like test day.
  // Uses setInterval (not chained setTimeout): when the computed remaining time is
  // unchanged, React skips the re-render, which would otherwise break the chain.
  useEffect(() => {
    if (phase !== "answering" || !timed || deadlineRef.current === null) return;
    const tick = () => {
      const remain = Math.max(0, Math.ceil((deadlineRef.current! - Date.now()) / 1000));
      setSecondsLeft(remain);
      if (remain <= 300 && remain > 60 && !warnedRef.current.five) {
        warnedRef.current.five = true;
        setTimeWarning("5 minutes remaining — keep your pace.");
      } else if (remain <= 60 && remain > 0 && !warnedRef.current.one) {
        warnedRef.current.one = true;
        setTimeWarning("1 minute remaining — finish your current question!");
      }
      if (remain <= 0) finishOnce();
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [phase, timed, finishOnce]);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ subject: subjectId, limit: String(timed ? (mode as number) : count) });
      if (domain !== "all") params.set("domain", domain);
      if (difficulty !== "all") params.set("difficulty", difficulty);
      const res = await fetch(`/api/questions?${params}`);
      if (!res.ok) throw new Error("Could not load questions.");
      const data = await res.json();
      if (!data.questions?.length) {
        setError("No questions found for these filters yet — try widening them.");
        return;
      }
      const requested = timed ? TIMED_PRESETS[subjectId][mode as number].count : count;
      if (data.questions.length < requested) {
        setShortNotice(
          `Heads up: only ${data.questions.length} question${data.questions.length === 1 ? "" : "s"} matched your filters (this mode asks for ${requested}). Starting a shorter set — more questions are on the way.`
        );
      } else {
        setShortNotice(null);
      }
      setQuestions(data.questions);
      setIndex(0);
      setAnswers([]);
      setChecked(false);
      setSelected(null);
      setGridAnswer("");
      setTimeWarning(null);
      warnedRef.current = { five: false, one: false };
      finishedRef.current = false;
      if (timed) {
        const minutes = TIMED_PRESETS[subjectId][mode as number].minutes;
        deadlineRef.current = Date.now() + minutes * 60 * 1000;
        setSecondsLeft(minutes * 60);
      } else {
        deadlineRef.current = null;
        setSecondsLeft(null);
      }
      questionStart.current = Date.now();
      setPhase("answering");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const q = questions[index];

  function checkAnswer() {
    if (!q || checked) return;
    let correct = false;
    if (q.choices && q.correctIndex !== null) {
      correct = selected === q.correctIndex;
    } else {
      correct = gridAnswer.trim().toLowerCase() === q.correctText.trim().toLowerCase();
    }
    setAnswers((a) => [...a, { id: q.id, correct, timeMs: Date.now() - questionStart.current }]);
    setChecked(true);
  }

  function next() {
    if (index + 1 >= questions.length) {
      finishOnce();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setGridAnswer("");
    setChecked(false);
    questionStart.current = Date.now();
  }

  if (phase === "setup") {
    const presets = TIMED_PRESETS[subjectId] ?? [];
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{subjectName} practice</h1>
          <p className="mt-2 text-slate-600">Pick your filters, then start. Explanations appear after every question.</p>
        </div>
        <div className="card space-y-5">
          <div>
            <label className="label">Topic</label>
            <select className="input" value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="all">All topics</option>
              {domains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Difficulty</label>
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="all">Mixed</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="label">Mode</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={mode === "untimed"} onChange={() => setMode("untimed")} />
                Untimed practice
              </label>
              {presets.map((p, i) => (
                <label key={p.label} className="flex items-center gap-2 text-sm">
                  <input type="radio" checked={mode === i} onChange={() => setMode(i)} />
                  Timed — {p.label}
                </label>
              ))}
            </div>
          </div>
          {mode === "untimed" && (
            <div>
              <label className="label">Number of questions</label>
              <select className="input" value={count} onChange={(e) => setCount(Number(e.target.value))}>
                {[5, 10, 15, 20].map((n) => (
                  <option key={n} value={n}>{n} questions</option>
                ))}
              </select>
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full" onClick={start} disabled={loading}>
            {loading ? "Loading…" : "Start practice set"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const correct = answers.filter((a) => a.correct).length;
    const pct = answers.length ? Math.round((correct / answers.length) * 100) : 0;
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="card text-center">
          <h1 className="text-3xl font-extrabold">Set complete 🎉</h1>
          <p className="mt-4 text-5xl font-extrabold text-brand-700">{pct}%</p>
          <p className="mt-2 text-slate-600">
            {correct} of {answers.length} correct
          </p>
          <p className="mt-4 text-sm text-slate-500">
            {pct >= 85 ? "Excellent — you're in scoring range. Try a harder set or a full timed module." :
             pct >= 65 ? "Solid. Review the explanations below, then drill your missed topics." :
             "Good reps. Re-read each explanation and retry the set — small fixes add up fast."}
          </p>
        </div>
        <div className="space-y-3">
          {answers.map((a, i) => {
            const qq = questions.find((x) => x.id === a.id);
            return (
              <div key={a.id + i} className={`card !p-4 ${a.correct ? "border-green-200" : "border-red-200"}`}>
                <p className="text-sm font-semibold">
                  Q{i + 1} · {qq?.domain} {a.correct ? "✅" : "❌"}
                </p>
                <p className="mt-1 text-sm text-slate-600">{qq?.prompt.slice(0, 120)}…</p>
                {!a.correct && <p className="mt-2 text-sm text-slate-600"><strong>Answer:</strong> {qq?.correctText}</p>}
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button className="btn-primary flex-1" onClick={() => setPhase("setup")}>New set</button>
          <a href="/dashboard" className="btn-secondary flex-1 text-center">View dashboard</a>
        </div>
      </div>
    );
  }

  if (!q) return <p>Loading…</p>;
  const isMcq = !!q.choices && q.correctIndex !== null;
  const lastAnswer = answers[answers.length - 1];
  const wasCorrect = checked && lastAnswer?.id === q.id && lastAnswer.correct;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {shortNotice && (
        <div className="flex items-start justify-between gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <p>{shortNotice}</p>
          <button className="shrink-0 font-bold" onClick={() => setShortNotice(null)} aria-label="Dismiss">✕</button>
        </div>
      )}
      {timeWarning && (
        <div className="flex items-start justify-between gap-3 rounded-xl bg-brand-50 p-4 text-sm font-semibold text-brand-800">
          <p>⏰ {timeWarning}</p>
          <button className="shrink-0 font-bold" onClick={() => setTimeWarning(null)} aria-label="Dismiss">✕</button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">
          Question {index + 1} of {questions.length} · {q.domain} · {q.difficulty}
        </p>
        {timed && secondsLeft !== null && (
          <p className={`rounded-full px-4 py-1.5 font-mono font-bold ${secondsLeft < 60 ? "bg-red-100 text-red-700" : secondsLeft < 300 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>
            ⏱ {formatTime(secondsLeft)}
          </p>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-brand-600 transition-all" style={{ width: `${((index + (checked ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <div className="card space-y-5">
        <p className="whitespace-pre-wrap text-lg leading-relaxed">{q.prompt}</p>

        {isMcq ? (
          <div className="space-y-2">
            {q.choices!.map((c, i) => {
              const isRight = checked && i === q.correctIndex;
              const isWrongPick = checked && i === selected && i !== q.correctIndex;
              return (
                <button
                  key={i}
                  disabled={checked}
                  onClick={() => setSelected(i)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    isRight ? "border-green-500 bg-green-50 font-semibold"
                    : isWrongPick ? "border-red-500 bg-red-50"
                    : selected === i ? "border-brand-500 bg-brand-50"
                    : "border-slate-200 hover:border-brand-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="mr-2 font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span> {c}
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <label className="label">Type your answer (grid-in style)</label>
            <input
              className="input"
              value={gridAnswer}
              disabled={checked}
              onChange={(e) => setGridAnswer(e.target.value)}
              placeholder="e.g. 10 or -17"
            />
            {checked && (
              <p className={`mt-2 text-sm font-semibold ${wasCorrect ? "text-green-700" : "text-red-700"}`}>
                {wasCorrect ? "✅ Correct!" : `❌ The correct answer is ${q.correctText}.`}
              </p>
            )}
          </div>
        )}

        {checked && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-bold text-slate-900">Explanation</p>
            <p className="mt-1 whitespace-pre-wrap">{q.explanation}</p>
          </div>
        )}

        <div className="flex gap-3">
          {!checked ? (
            <button
              className="btn-primary flex-1"
              onClick={checkAnswer}
              disabled={isMcq ? selected === null : gridAnswer.trim() === ""}
            >
              Check answer
            </button>
          ) : (
            <button className="btn-primary flex-1" onClick={next}>
              {index + 1 >= questions.length ? "See results" : "Next question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
