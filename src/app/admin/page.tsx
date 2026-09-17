"use client";

import { useEffect, useState } from "react";
import { SUBJECTS } from "@/lib/site";

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

type Inquiry = {
  id: string;
  name: string;
  email: string;
  test: string;
  message: string;
  status: string;
  createdAt: string;
};

const emptyForm = {
  subject: "sat-math",
  domain: "",
  difficulty: "medium",
  prompt: "",
  choicesText: "",
  correctIndex: "",
  correctText: "",
  explanation: "",
};

export default function Admin() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [token, setToken] = useState("");
  const [tab, setTab] = useState<"questions" | "inquiries">("questions");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/questions").then((r) => setUnlocked(r.status !== 401));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.ok) {
      setUnlocked(true);
      loadAll();
    } else {
      setMsg("Wrong token.");
    }
  }

  async function loadAll() {
    const [q, iq] = await Promise.all([
      fetch("/api/admin/questions").then((r) => r.json()),
      fetch("/api/admin/inquiries").then((r) => r.json()),
    ]);
    setQuestions(q.questions ?? []);
    setInquiries(iq.inquiries ?? []);
  }

  useEffect(() => {
    if (unlocked) loadAll();
  }, [unlocked]);

  function fillForm(q: Question) {
    setEditingId(q.id);
    setForm({
      subject: q.subject,
      domain: q.domain,
      difficulty: q.difficulty,
      prompt: q.prompt,
      choicesText: (q.choices ?? []).join("\n"),
      correctIndex: q.correctIndex !== null ? String(q.correctIndex) : "",
      correctText: q.correctText,
      explanation: q.explanation,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const choices = form.choicesText.trim() ? form.choicesText.split("\n").map((s) => s.trim()).filter(Boolean) : null;
    const payload = {
      subject: form.subject,
      domain: form.domain || "General",
      difficulty: form.difficulty,
      prompt: form.prompt,
      choices,
      correctIndex: choices ? Number(form.correctIndex) : null,
      correctText: form.correctText,
      explanation: form.explanation,
    };
    const res = await fetch(editingId ? `/api/admin/questions/${editingId}` : "/api/admin/questions", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setMsg("Save failed — check all fields (for multiple-choice, correctIndex is 0-based).");
      return;
    }
    setForm(emptyForm);
    setEditingId(null);
    setMsg(editingId ? "Question updated." : "Question added.");
    loadAll();
  }

  async function remove(id: string) {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    loadAll();
  }

  if (unlocked === null) return <p className="text-slate-500">Checking admin access…</p>;
  if (!unlocked)
    return (
      <div className="card mx-auto max-w-sm">
        <h1 className="text-2xl font-extrabold">Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Enter your ADMIN_TOKEN to manage questions and inquiries.</p>
        <form onSubmit={login} className="mt-4 space-y-3">
          <input className="input" type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Admin token" />
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <button className="btn-primary w-full">Unlock</button>
        </form>
      </div>
    );

  const domains = SUBJECTS.find((s) => s.id === form.subject)?.domains ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Admin</h1>
        <div className="flex gap-2">
          {(["questions", "inquiries"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === t ? "bg-brand-600 text-white" : "bg-white text-slate-600 border"}`}>
              {t === "questions" ? `Questions (${questions.length})` : `Inquiries (${inquiries.length})`}
            </button>
          ))}
        </div>
      </div>
      {msg && <p className="text-sm text-green-700">{msg}</p>}

      {tab === "questions" && (
        <>
          <form onSubmit={save} className="card space-y-4">
            <h2 className="text-lg font-bold">{editingId ? "Edit question" : "Add question"}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Subject</label>
                <select className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value, domain: "" })}>
                  {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Domain</label>
                <select className="input" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}>
                  <option value="">Select…</option>
                  {domains.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Difficulty</label>
                <select className="input" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  {["easy", "medium", "hard"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Prompt</label>
              <textarea className="input min-h-24" required value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} />
            </div>
            <div>
              <label className="label">Choices (one per line — leave empty for grid-in)</label>
              <textarea className="input min-h-20" value={form.choicesText} onChange={(e) => setForm({ ...form, choicesText: e.target.value })} placeholder={"10\n12\n14\n17"} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Correct choice index (0-based, MCQ only)</label>
                <input className="input" value={form.correctIndex} onChange={(e) => setForm({ ...form, correctIndex: e.target.value })} placeholder="1" />
              </div>
              <div>
                <label className="label">Correct answer text (also used to grade grid-ins)</label>
                <input className="input" required value={form.correctText} onChange={(e) => setForm({ ...form, correctText: e.target.value })} placeholder="12" />
              </div>
            </div>
            <div>
              <label className="label">Explanation</label>
              <textarea className="input min-h-24" required value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button className="btn-primary">{editingId ? "Update" : "Add"} question</button>
              {editingId && <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
            </div>
          </form>

          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="card !p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm">
                    <p className="font-semibold">{q.subject} · {q.domain} · {q.difficulty}</p>
                    <p className="mt-1 text-slate-600">{q.prompt.slice(0, 140)}{q.prompt.length > 140 ? "…" : ""}</p>
                    <p className="mt-1 text-slate-500">Answer: {q.correctText}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button className="btn-secondary !px-3 !py-1.5 text-sm" onClick={() => fillForm(q)}>Edit</button>
                    <button className="rounded-xl border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50" onClick={() => remove(q.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "inquiries" && (
        <div className="space-y-3">
          {inquiries.length === 0 && <p className="text-slate-500">No inquiries yet. Share your /contact page!</p>}
          {inquiries.map((iq) => (
            <div key={iq.id} className="card !p-4 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-bold">{iq.name} <span className="font-normal text-slate-500">&lt;{iq.email}&gt;</span></p>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{iq.test} · {iq.status}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-slate-600">{iq.message}</p>
              <p className="mt-2 text-xs text-slate-400">{new Date(iq.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
