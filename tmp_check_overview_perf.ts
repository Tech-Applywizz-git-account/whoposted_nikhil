import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkOverviewPerf() {
    console.log("Checking /api/overview queries...");
    
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = startDate;

    console.time("total_jobs_count");
    const { count: totalJobsCount } = await supabase.from("daily_linkedin_jobs_report").select('*', { count: 'exact', head: true });
    console.timeEnd("total_jobs_count");

    console.time("today_rows");
    const { data: todayRows, error: todayError } = await supabase
        .from("daily_linkedin_jobs_report")
        .select("company, job_role, poster_full_name, company_url, job_title, job_url, source, report_date, created_at, id, poster_profile_url")
        .gte("report_date", startDate)
        .lte("report_date", endDate)
        .order("created_at", { ascending: false })
        .limit(200);
    console.timeEnd("today_rows");

    console.time("real_today_count");
    const { count: realTodayCount, error: countError } = await supabase
        .from("daily_linkedin_jobs_report")
        .select('*', { count: 'exact', head: true })
        .gte("report_date", startDate)
        .lte("report_date", endDate);
    console.timeEnd("real_today_count");

    if (todayError) console.error("todayError", todayError);
    if (countError) console.error("countError", countError);

    console.log({
        totalJobsCount,
        todayRows: todayRows?.length,
        realTodayCount
    });
}

checkOverviewPerf();
