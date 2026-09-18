import Link from "next/link";
import { site, SUBJECTS } from "@/lib/site";

const faqs = [
  {
    q: "Should I take the SAT or the ACT?",
    a: "It depends on how you test. The Digital SAT is shorter (2h 14m) and adaptive — strong readers and steady pacers tend to like it. The Enhanced ACT (about 2h 5m for the core) is more straightforward but faster-paced, with 4-choice math. In a free intro call we'll look at your strengths and pick the test that gives you the most points for the least pain.",
  },
  {
    q: "How is the Digital SAT different from the old paper SAT?",
    a: "It's shorter, taken on a computer in the Bluebook app, split into timed adaptive modules, and the calculator is allowed on all math questions. About 25% of math questions are grid-ins where you type your own answer.",
  },
  {
    q: "What changed on the ACT?",
    a: "The Enhanced ACT (national since fall 2025) trimmed the core test to English, Math, and Reading — 131 questions in just over 2 hours. Science is now optional and doesn't count toward your 1–36 composite, and math questions have 4 answer choices instead of 5.",
  },
  {
    q: "I'm stuck in the 1200s / mid-20s. Can tutoring actually move my score?",
    a: "That's the most common plateau — and the most fixable. It usually comes from a handful of repeatable mistakes (pacing, specific algebra skills, grammar rules) rather than missing knowledge. We find them with timed practice data and drill them until they're automatic.",
  },
  {
    q: "Do you offer online sessions?",
    a: "Yes — all sessions are online with a shared whiteboard, and you'll get practice sets from this site between sessions.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="grid items-center gap-10 pt-6 md:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
            SAT & ACT · Class of 2027 prep
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Higher scores, <span className="text-brand-600">less stress.</span>
          </h1>
          <p className="text-lg text-slate-600">{site.tagline} Practice free on this site, then work 1-on-1 with {site.tutorName} to fix exactly what's holding your score back.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/practice" className="btn-primary">
              Start practicing free
            </Link>
            <Link href="/contact" className="btn-secondary">
              Book a free intro call
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2 text-center">
            {[
              ["2h 14m", "Digital SAT format"],
              ["131 Qs", "Enhanced ACT core"],
              ["1-on-1", "Personal coaching"],
            ].map(([big, small]) => (
              <div key={small} className="card !p-4">
                <p className="text-2xl font-extrabold text-brand-700">{big}</p>
                <p className="text-xs text-slate-500">{small}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card space-y-4 bg-gradient-to-br from-brand-50 to-white">
          <h2 className="text-xl font-bold">Why students plateau — and how we fix it</h2>
          <ul className="space-y-3 text-slate-600">
            <li>⏱️ <strong>Pacing:</strong> timed modules that mirror the real test, so the clock stops being the enemy.</li>
            <li>🎯 <strong>Weak spots:</strong> every attempt is tracked by topic — we drill your lowest domains first.</li>
            <li>📝 <strong>Explanations:</strong> instant, step-by-step walkthroughs for every question.</li>
            <li>🧠 <strong>Strategy:</strong> guessing, grid-ins, and adaptive-test tactics most students never learn.</li>
          </ul>
          <Link href="/practice" className="btn-primary w-full">
            Try a practice set →
          </Link>
        </div>
      </section>

      {/* Subjects */}
      <section className="space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Practice built for the 2026–27 tests</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {SUBJECTS.map((s) => (
            <Link key={s.id} href={`/practice/${s.id}`} className="card transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-xl font-bold text-brand-700">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.domains.map((d) => (
                  <span key={d} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {d}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight">How tutoring works</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["1. Free intro call", "We talk goals, pick SAT vs ACT, and map your timeline — no pressure, no charge."],
            ["2. Diagnostic + plan", "A timed practice set shows exactly which topics cost you points. You get a personal study plan."],
            ["3. Weekly 1-on-1s", "60-minute sessions, practice sets between them, and progress you can watch on your dashboard."],
          ].map(([title, body]) => (
            <div key={title} className="card">
              <h3 className="font-bold text-brand-700">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight">Pricing</h2>
          <span className="text-sm text-slate-500">First intro call is free</span>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {site.pricing.map((p) => (
            <div key={p.name} className={`card flex flex-col ${p.featured ? "border-2 border-brand-500" : ""}`}>
              {p.featured && (
                <span className="mb-2 w-fit rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">MOST POPULAR</span>
              )}
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="mt-1 text-3xl font-extrabold text-brand-700">{p.price}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                {p.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Link href="/contact" className="btn-primary mt-6 w-full">
                Book now
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500">
          Prices are placeholders — <Link href="/contact" className="text-brand-600 underline">contact {site.tutorName}</Link> for current rates and package deals.
        </p>
      </section>

      {/* TESTIMONIALS HIDDEN — the quotes below are placeholders. Send real student
          feedback and I'll publish this section with their results. */}
      {/*
      <section className="space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Student results</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["+180 points", "SAT Math went from 590 to 770 after we fixed my algebra systems. The timed practice made the real test feel easy.", "— Placeholder testimonial"],
            ["31 → 34", "ACT English finally clicked once someone explained the grammar patterns instead of just giving me worksheets.", "— Placeholder testimonial"],
            ["No more panic", "I used to freeze on the clock. The module-timing drills changed everything for me.", "— Placeholder testimonial"],
          ].map(([big, quote, who]) => (
            <div key={big} className="card">
              <p className="text-2xl font-extrabold text-brand-700">{big}</p>
              <p className="mt-3 text-sm italic text-slate-600">“{quote}”</p>
              <p className="mt-2 text-xs text-slate-400">{who} — replace with real student feedback</p>
          </div>
        ))}
        </div>
      </section>
      */}

      {/* FAQ */}
      <section className="space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Questions, answered</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card !p-5">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card bg-brand-900 !border-brand-900 text-center text-white">
        <h2 className="text-3xl font-extrabold">Ready when you are.</h2>
        <p className="mx-auto mt-2 max-w-xl text-brand-100">
          Practice free right now, or book a free intro call and get a plan built around your target score.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/practice" className="btn-secondary !border-white/20 !bg-white !text-brand-900">
            Practice free
          </Link>
          <Link href="/contact" className="rounded-xl bg-white px-5 py-3 font-semibold text-brand-900 hover:bg-brand-50">
            Book free intro call
          </Link>
        </div>
      </section>
    </div>
  );
}
