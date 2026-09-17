import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminCookieValid } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/inquiries — booking inbox for the admin dashboard
export async function GET(req: NextRequest) {
  if (!isAdminCookieValid(req.headers.get("cookie"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const inquiries = await db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ inquiries });
}
