import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function listAllRoles() {
    const { data: allRoles, error: rolesError } = await supabase
      .from("daily_linkedin_jobs_report")
      .select("job_role");

    if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        return;
    }

    const uniqueRoles = Array.from(new Set((allRoles || []).map(r => r.job_role).filter(Boolean)));
    console.log("All Unique Roles:");
    uniqueRoles.sort().forEach(role => console.log(`- "${role}"`));
}

listAllRoles();
