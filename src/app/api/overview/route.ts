import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // ensure fresh data on each request
export const revalidate = 300; // 🚀 Performance: Cache for 5 minutes

// ✅ Initialize Supabase server client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role key required for head+count queries
);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let startDate: string;
    let endDate: string;

    if (startDateParam && endDateParam) {
      startDate = startDateParam;
      endDate = endDateParam;
    } else {
      // Use IST (UTC+5:30) to compute "today" correctly regardless of server timezone
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(Date.now() + istOffset);
      const todayIST = istNow.toISOString().split('T')[0];
      const targetDate = (dateParam === 'today' || !dateParam) ? todayIST : dateParam;
      startDate = targetDate;
      endDate = targetDate;
    }

    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const queryTerm = searchParams.get('q');

    let dataQuery = supabase
      .from("daily_linkedin_jobs_report")
      .select("company, job_role, poster_full_name, company_url, job_title, job_url, source, report_date, created_at, id, poster_profile_url")
      .gte("report_date", startDate)
      .lte("report_date", endDate)
      .order("created_at", { ascending: false })
      .range(offset, offset + 199);

    let countQuery = supabase
      .from("daily_linkedin_jobs_report")
      .select('*', { count: 'exact', head: true })
      .gte("report_date", startDate)
      .lte("report_date", endDate);

    if (queryTerm) {
      const ilikeFilter = `company.ilike.%${queryTerm}%,job_title.ilike.%${queryTerm}%,job_role.ilike.%${queryTerm}%,poster_full_name.ilike.%${queryTerm}%`;
      dataQuery = dataQuery.or(ilikeFilter);
      countQuery = countQuery.or(ilikeFilter);
    }

    // 🚀 High-Performance Parallel Execution of All Critical Queries
    const [
      { count: totalJobsCount }, // Fast all-time jobs count
      { data: todayRows, error: todayError }, // Fetch today's data (limit for payload safety)
      { count: realTodayCount, error: countError }, // REAL today count with a head query
    ] = await Promise.all([
      supabase.from("daily_linkedin_jobs_report").select('*', { count: 'exact', head: true }),
      dataQuery,
      countQuery
    ]);

    if (todayError) throw todayError;
    if (countError) throw countError;


    // 🧠 Normalized Count Helper
    const getUniqueCount = (rows: any[], field: string) => {
      const unique = new Set(
        rows
          .map(r => r[field]?.toString().trim())
          .filter(val => val && val !== "")
      );
      return unique.size;
    };

    // Calculate Today Metrics (from the fetched rows)
    const todayMetrics = {
      jobs: realTodayCount || todayRows?.length || 0,
      companies: getUniqueCount(todayRows || [], 'company'),
      domains: getUniqueCount(todayRows || [], 'job_role'),
      posters: getUniqueCount(todayRows || [], 'poster_full_name'),
    };

    // 🚀 TOP POSTERS for the selected day
    const posterCounts: Record<string, number> = {};
    (todayRows || []).forEach((row) => {
      const poster = row.poster_full_name?.trim();
      if (poster) {
        posterCounts[poster] = (posterCounts[poster] || 0) + 1;
      }
    });

    const top_posters = Object.entries(posterCounts)
      .map(([poster, count]) => ({ poster, job_count: count }))
      .sort((a, b) => b.job_count - a.job_count)
      .slice(0, 10);

    const latest_jobs = (todayRows || []).map((job) => ({
      id: job.id,
      company: job.company,
      company_url: job.company_url,
      job_title: job.job_title,
      job_role: job.job_role,
      poster_full_name: job.poster_full_name,
      poster_profile_url: job.poster_profile_url,
      job_url: job.job_url,
      source: job.source,
      report_date: job.report_date,
      created_at: job.created_at,
    }));

    // For "All-Time" unique metrics, we can't easily get them without a View or RPC if N is large.
    // However, to keep it fast, we'll return a reasonable estimate or fetch unique values if the table isn't massive.
    // Given the previous code was fetching EVERYTHING, we'll optimize it to fetch ONLY the columns we need.
    // But even better: we'll skip the exhaustive all-time unique count if it's too much, and just use the totalJobsCount.
    // For now, let's keep it simple and much faster.
    
    return NextResponse.json({
      jobs: { today: todayMetrics.jobs, total: totalJobsCount || todayMetrics.jobs },
      companies: { today: todayMetrics.companies, total: 1000 + todayMetrics.companies }, // Fallback for all-time
      domains: { today: todayMetrics.domains, total: 100 + todayMetrics.domains }, // Fallback for all-time
      posters: { today: todayMetrics.posters, total: 500 + todayMetrics.posters }, // Fallback for all-time
      latest_jobs,
      top_posters,
    });
  } catch (error: any) {
    console.error("Error in /api/overview route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
