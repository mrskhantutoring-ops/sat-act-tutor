import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminCookieValid } from "@/lib/auth";

export const dynamic = "force-dynamic";

function requireAdmin(req: NextRequest) {
  return isAdminCookieValid(req.headers.get("cookie"));
}

const STATUSES = ["new", "contacted", "closed"] as const;

// PATCH /api/admin/inquiries/[id] — update status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (typeof status !== "string" || !(STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Invalid status. Use: new, contacted, closed." }, { status: 400 });
  }
  const iq = await db.inquiry.update({ where: { id: params.id }, data: { status } }).catch(() => null);
  if (!iq) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
  return NextResponse.json({ ok: true, inquiry: iq });
}

// DELETE /api/admin/inquiries/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db.inquiry.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
