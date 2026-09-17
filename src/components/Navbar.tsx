"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Me = { id: string; name: string; email: string } | null;

export default function Navbar() {
  const [me, setMe] = useState<Me>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user ?? null))
      .catch(() => setMe(null));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-brand-700">
          {site.name}
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          <Link href="/practice" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
            Practice
          </Link>
          <Link href="/dashboard" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
            Dashboard
          </Link>
          <Link href="/contact" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
            Book a session
          </Link>
          {me ? (
            <span className="ml-1 flex items-center gap-2">
              <span className="hidden rounded-full bg-brand-50 px-3 py-1.5 text-brand-700 sm:inline">
                Hi, {me.name.split(" ")[0]}
              </span>
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  setMe(null);
                  window.location.href = "/";
                }}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                Log out
              </button>
            </span>
          ) : (
            <Link href="/login" className="ml-1 rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
