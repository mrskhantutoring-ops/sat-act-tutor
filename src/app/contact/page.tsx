"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [test, setTest] = useState("Not sure");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, test, message }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not send your message.");
      setBusy(false);
      return;
    }
    setDone(true);
  }

  if (done)
    return (
      <div className="card mx-auto max-w-md text-center">
        <p className="text-4xl">📬</p>
        <h1 className="mt-2 text-2xl font-extrabold">Message received!</h1>
        <p className="mt-2 text-sm text-slate-600">
          Thanks, {name.split(" ")[0]}. {site.tutorName} will reply to <strong>{email}</strong> shortly about your free intro call.
        </p>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Book a free intro call</h1>
        <p className="mt-2 text-slate-600">
          Tell us where you are and where you want to be. We'll reply with times for a free 20-minute intro call —
          goals, SAT vs ACT guidance, and a study plan, no strings attached.
        </p>
      </div>
      <form onSubmit={submit} className="card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Your name</label>
            <input className="input" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Which test?</label>
          <select className="input" value={test} onChange={(e) => setTest(e.target.value)}>
            {["SAT", "ACT", "Both", "Not sure"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Anything we should know? (current score, target score, test date…)</label>
          <textarea className="input min-h-28" required value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Junior, PSAT 1150, aiming for 1400+ by October…" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Sending…" : "Request my free intro call"}</button>
        <p className="text-center text-xs text-slate-400">Your details are only used to reply to your inquiry.</p>
      </form>
    </div>
  );
}
