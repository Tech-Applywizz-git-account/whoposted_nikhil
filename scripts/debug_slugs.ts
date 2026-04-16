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

async function debugRoleMatching() {
    console.log("Fetching job roles...");
    const { data: allRoles, error: rolesError } = await supabase
      .from("daily_linkedin_jobs_report")
      .select("job_role");

    if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        return;
    }

    const uniqueRoles = Array.from(new Set((allRoles || []).map(r => r.job_role).filter(Boolean)));
    console.log(`Unique roles found: ${uniqueRoles.length}`);

    const targetSlug = "atlassian-engineer-jira";
    console.log(`Target Slug (normalized): ${targetSlug}`);

    uniqueRoles.forEach(role => {
        const slug = slugify(role);
        if (slug.includes("atlassian") || slug === targetSlug) {
            console.log(`Matching: "${role}" -> "${slug}"`);
        }
    });

    const match = uniqueRoles.find(role => slugify(role) === targetSlug);
    console.log(`Final Match: ${match || "NOT FOUND"}`);
}

debugRoleMatching();
