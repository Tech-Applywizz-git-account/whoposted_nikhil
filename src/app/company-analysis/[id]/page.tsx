import { createClient } from "@supabase/supabase-js";
import CompanyDetailClient from "./CompanyDetailClient";

// ✅ Reuse a single client instance outside for better perf
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = "force-dynamic";

async function getCompanyJobs(slug: string) {
  const company_name = decodeURIComponent(slug);
  const MAX_JOBS_TO_FETCH = 500; // Limit to 500 for instant response

  try {
    const { data, error } = await supabase
      .from("daily_linkedin_jobs_report")
      .select("company, company_url, job_title, job_role, report_date, job_url, poster_full_name, poster_profile_url")
      .eq("company", company_name)
      .order("report_date", { ascending: false, nullsFirst: false })
      .limit(MAX_JOBS_TO_FETCH);

    if (error) throw error;

    const companyTitle = (data && data.length > 0) ? data[0].company : company_name;
    const mappedJobs = (data || []).map((job, index) => ({
      id: index + 1,
      companyName: job.company,
      companyUrl: job.company_url || null,
      jobTitle: job.job_title,
      jobRole: job.job_role,
      posterName: job.poster_full_name,
      posterUrl: job.poster_profile_url,
      jobUrl: job.job_url,
      source: null,
      date: job.report_date,
    })).filter(job => job.jobUrl);

    return { company: companyTitle, jobs: mappedJobs };
  } catch (err) {
    console.error("Error fetching company details:", err);
    return { company: company_name, jobs: [] };
  }
}

export default async function CompanyDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id: slug } = await props.params;
  const { company, jobs } = await getCompanyJobs(slug);

  return (
    <CompanyDetailClient 
      slug={slug} 
      initialCompany={company} 
      initialJobs={jobs} 
    />
  );
}
