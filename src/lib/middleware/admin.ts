import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withAuth } from "./auth";

export async function withAdmin(req: NextRequest) {
  const session = withAuth(req);
  if (session instanceof NextResponse) return session; // means redirect already happened

  // ✅ Already in the session! No need to query the database on every request.
  // This significantly improves performance on admin pages.
  if (!session || session.role !== "whopost_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return session;
}
