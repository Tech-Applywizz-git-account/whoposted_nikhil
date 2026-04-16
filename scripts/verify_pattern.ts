import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function slugify(text: string): string {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function verifyPatternMatching() {
    const slug = "atlassian-engineer--jira";
    const searchPattern = slugify(slug).replace(/-/g, '%');
    console.log(`Searching with pattern: %${searchPattern}%`);

    const { data: candidates, error: candidateError } = await supabase
      .from("daily_linkedin_jobs_report")
      .select("job_role")
      .ilike("job_role", `%${searchPattern}%`)
      .limit(100);

    if (candidateError) {
        console.error("Error:", candidateError);
        return;
    }

    console.log(`Candidates found: ${candidates?.length || 0}`);
    candidates?.forEach(c => console.log(`- "${c.job_role}" (Slugify match: ${slugify(c.job_role) === slugify(slug)})`));
    
    const uniqueCandidates = Array.from(new Set((candidates || []).map(c => c.job_role).filter(Boolean)));
    const match = uniqueCandidates.find(role => slugify(role) === slugify(slug));
    console.log(`Final Match: "${match || "NOT FOUND"}"`);
}

verifyPatternMatching();
