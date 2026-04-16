-- Create a normalized company view that handles case/whitespace issues
-- This view should be created in your Supabase database

CREATE OR REPLACE VIEW public.company_summary AS
SELECT
  LOWER(TRIM(company)) as company_key,
  MAX(company) as company_name,
  COUNT(*) as job_count,
  MAX(company_url) as company_url
FROM public.daily_linkedin_jobs_report
WHERE company IS NOT NULL AND TRIM(company) != ''
GROUP BY LOWER(TRIM(company))
ORDER BY job_count DESC;

-- Make the view accessible (if needed)
GRANT SELECT ON public.company_summary TO authenticated, anon;
