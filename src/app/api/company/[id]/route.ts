import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserCountry, decrypt } from "@/lib/session";

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

    const { id: encoded_key } = await context.params;
    const company_name = decodeURIComponent(encoded_key);

    // ✅ High-Speed Query using exact match (indexed)
    // 🚀 Performance: .eq() is significantly faster than .ilike() with wildcards
    const MAX_JOBS_TO_FETCH = 1000;

    const { data, error } = await supabase
      .from("daily_linkedin_jobs_report")
      .select("company, company_url, job_title, job_role, report_date, job_url, poster_full_name, poster_profile_url")
      .eq("company", company_name) // 🚀 Exact match is instant
      .order("report_date", { ascending: false, nullsFirst: false })
      .limit(MAX_JOBS_TO_FETCH);


    if (error) throw error;

    // Get the actual company name from the first result
    const companyName = (data && data.length > 0) ? data[0].company : company_name;

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
    })).filter(job => job.link); // Only include jobs with a URL

    return NextResponse.json({ company: companyName, jobs });
  } catch (error: any) {
    console.error("Error in /api/company/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
