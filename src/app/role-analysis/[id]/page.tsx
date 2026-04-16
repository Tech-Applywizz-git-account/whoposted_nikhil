import { createClient } from "@supabase/supabase-js";
import DomainDetailClient from "./DomainDetailClient";

// ✅ Reuse a single client instance outside for better perf
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = "force-dynamic";

async function getDomainJobs(slug: string) {
  const roleName = decodeURIComponent(slug);

  try {
    const { data, error } = await supabase
      .from("daily_linkedin_jobs_report")
      .select("company, company_url, job_role, job_title, report_date, job_url, poster_full_name, poster_profile_url")
      .eq("job_role", roleName)
      .order("report_date", { ascending: false, nullsFirst: false })
      .limit(500); // 🚀 Performance: Cap at 500 to ensure instant response

    if (error) throw error;

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

    return { role: roleName, jobs: mappedJobs };
  } catch (err) {
    console.error("Error fetching domain jobs:", err);
    return { role: roleName, jobs: [] };
  }
}

export default async function DomainDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id: slug } = await props.params;
  const { role, jobs } = await getDomainJobs(slug);

  return (
    <DomainDetailClient 
      slug={slug} 
      initialJobs={jobs} 
      initialRoleTitle={role} 
    />
  );
}
