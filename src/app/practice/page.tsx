import Link from "next/link";
import { SUBJECTS } from "@/lib/site";

export default function PracticeHub() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Practice</h1>
        <p className="mt-2 text-slate-600">
          Free timed and untimed sets with instant explanations. Log in to save your progress to your dashboard.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {SUBJECTS.map((s) => (
          <Link key={s.id} href={`/practice/${s.id}`} className="card transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 className="text-xl font-bold text-brand-700">{s.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{s.blurb}</p>
            <p className="mt-3 text-sm font-semibold text-brand-600">Start a set →</p>
          </Link>
        ))}
      </div>
      <div className="card bg-brand-50">
        <h2 className="font-bold">How timed mode works</h2>
        <p className="mt-1 text-sm text-slate-600">
          Timed presets mirror real test modules — e.g. SAT Math 22 questions in 35 minutes, ACT Math 45 in 50
          minutes. The timer warns you at 5 minutes and 1 minute remaining, just like test day.
        </p>
      </div>
    </div>
  );
}
