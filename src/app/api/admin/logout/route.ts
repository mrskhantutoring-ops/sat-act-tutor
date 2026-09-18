import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/admin/logout — clears the admin cookie.
export async function POST() {
  clearAdminCookie();
  return NextResponse.json({ ok: true });
}
