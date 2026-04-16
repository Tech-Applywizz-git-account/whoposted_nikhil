import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserCountry, decrypt } from "@/lib/session";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 🚀 Performance: Cache for 5 minutes

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookie = req.cookies.get("session")?.value;
    const session = cookie ? decrypt(cookie) : null;
    const userRole = session?.role;

    const { id } = await context.params;
    const roleName = decodeURIComponent(id);

    // ✅ High-Speed Query using exact match (indexed)
    // 🚀 Performance: .eq() is significantly faster than .ilike() with candidates
    const { data, error } = await supabase
      .from("daily_linkedin_jobs_report")
      .select("company, company_url, job_role, job_title, report_date, job_url, poster_full_name, poster_profile_url")
      .eq("job_role", roleName) // 🚀 Exact match is instant
      .order("report_date", { ascending: false, nullsFirst: false });


    if (error) throw error;

    // 3️⃣ Format response
    const jobs = (data || []).map((job) => ({
      company: job.company,
      company_url: job.company_url,
      role: job.job_title,
      domain: job.job_role,
      location: "",
      posted: job.report_date,
      link: job.job_url,
      poster_name: job.poster_full_name,
      poster_url: job.poster_profile_url,
    }));

    return NextResponse.json({ role: roleName, jobs });
  } catch (error: any) {
    console.error("Error in /api/domain/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
