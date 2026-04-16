import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserCountry, decrypt } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 🚀 Performance: Cache for 5 minutes

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// 🧠 Helper: check if role is tech
function isTechRole(roleName: string): boolean {
  if (!roleName) return false;

  const lower = roleName.toLowerCase();
  const techKeywords = [
    "developer",
    "software",
    "engineer",
    "devops",
    "data",
    "cyber",
    "security",
    "network",
    "cloud",
    "qa",
    "python",
    "java",
    "scientist",
    "servicenow",
    "sap",
    "embedded",
    "full stack",
    "game",
    "ai",
    "machine learning",
    "active directory",
    ".net",
    "computer science",
    "database",
    "sailpoint",
  ];

  return techKeywords.some((keyword) => lower.includes(keyword));
}

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("session")?.value;
    const session = cookie ? decrypt(cookie) : null;
    const userRole = session?.role;

    if (userRole === "admin") {
      return NextResponse.json([]);
    }

    // 🚀 High-Performance Aggregate: Fetch all job roles and count them
    const pageSize = 5000;
    const numChunks = 20; // Parallel fetch up to 100,000 rows
    
    console.log(`[API/Domain] Fetching roles across ${numChunks * pageSize} rows...`);

    const chunks = await Promise.all(
      Array.from({ length: numChunks }, (_, i) => 
        supabase
          .from("daily_linkedin_jobs_report")
          .select("job_role")
          .range(i * pageSize, (i + 1) * pageSize - 1)
      )
    );

    const roleCounts: Record<string, number> = {};
    
    chunks.forEach(({ data, error }) => {
      if (error) {
        console.error("Chunk fetch error:", error);
        return;
      }
      if (data) {
        data.forEach(row => {
          if (row.job_role) {
            const role = row.job_role.trim();
            roleCounts[role] = (roleCounts[role] || 0) + 1;
          }
        });
      }
    });

    // 2️⃣ Map each unique role with metadata and job count
    const result = Object.entries(roleCounts).map(([role, count]) => ({
      role,
      isTech: isTechRole(role),
      jobCount: count
    }));

    // Sort by role name for consistency
    result.sort((a, b) => a.role.localeCompare(b.role));

    console.log(`[API/Domain] Found ${result.length} unique domains.`);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/domain:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
