import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/admin/login { token } — verifies ADMIN_TOKEN and sets an httpOnly cookie.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = String(body?.token ?? "");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }
  setAdminCookie(token);
  return NextResponse.json({ ok: true });
}
