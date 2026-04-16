import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decrypt } from "@/lib/session";

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
        const { id: slug } = await context.params;

        // 🚀 Improved: Instead of fetching ALL posters, try to find a match using ILIKE
        // This is much faster as it lets Postgres filter the data
        const decodedSlug = decodeURIComponent(slug);
        const searchPattern = decodedSlug.replace(/-/g, '%');

        // 1️⃣ Try to find the exact poster name that matches this slug pattern
        const { data: matchedPosters, error: posterError } = await supabase
            .from("daily_linkedin_jobs_report")
            .select("poster_full_name")
            .ilike("poster_full_name", `%${searchPattern}%`)
            .limit(50); // Fetch a few candidates

        if (posterError) throw posterError;

        // Find the original poster name that matches this slug
        const posterName = (matchedPosters || []).map(p => p.poster_full_name).find(poster => {
            const clean = poster.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            return clean === slug;
        }) || decodedSlug;

        // 2️⃣ Query all jobs for this poster
        const { data, error } = await supabase
            .from("daily_linkedin_jobs_report")
            .select("company, company_url, job_role, job_title, report_date, job_url, poster_full_name, poster_profile_url")
            .eq("poster_full_name", posterName)
            .order("report_date", { ascending: false, nullsFirst: false });

        if (error) throw error;

        // 3️⃣ Format response
        const jobs = (data || []).map((job) => ({
            company: job.company,
            company_url: job.company_url,
            role: job.job_title,
            domain: job.job_role,
            posted: job.report_date,
            link: job.job_url,
            poster_name: job.poster_full_name,
            poster_url: job.poster_profile_url,
        }));

        return NextResponse.json({ poster: posterName, jobs });
    } catch (error: any) {
        console.error("Error in /api/poster/[id]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
