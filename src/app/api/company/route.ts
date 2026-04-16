import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUserCountry, decrypt } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 🚀 Performance: Cache for 5 minutes

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  try {
    // 1. Get total count to calculate pagination
    const { count, error: countError } = await supabase
      .from("daily_linkedin_jobs_report")
      .select("company", { count: "exact", head: true })
      .not("company", "is", null);

    if (countError) throw countError;

    const totalRecords = Math.min(count || 0, 30000); // 🚀 Performance: Cap at 30,000 rows to ensure instant response
    const CHUNK_SIZE = 1000;
    const promises = [];

    // 2. Fetch the most relevant recent data in parallel chunks
    for (let i = 0; i < totalRecords; i += CHUNK_SIZE) {
      const promise = supabase
        .from("daily_linkedin_jobs_report")
        .select("company, company_url")
        .not("company", "is", null)
        .order("created_at", { ascending: false }) // 🚀 Performance: Get the *most recent* active companies
        .range(i, i + CHUNK_SIZE - 1);
      promises.push(promise);
    }

    const results = await Promise.all(promises);

    // 3. Aggregate in memory
    const companyMap = new Map<string, { company: string, count: number, url: string }>();

    results.forEach(({ data, error }) => {
      if (error) {
        console.error("Error fetching chunk:", error);
        return;
      }

      (data || []).forEach((row: any) => {
        const companyRaw = row.company;
        if (!companyRaw) return;

        // Normalize key for URL (replace spaces/symbols with dashes)
        const key = companyRaw.trim().toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

        if (!key) return; // Skip empty strings

        if (!companyMap.has(key)) {
          // Initialize entry
          companyMap.set(key, {
            company: companyRaw.trim(), // Use the first encounter as the display name
            count: 0,
            url: row.company_url || ''
          });
        }

        // Update stats
        const entry = companyMap.get(key)!;
        entry.count += 1;

        // Prioritize keeping a valid URL if we found one
        if (!entry.url && row.company_url) {
          entry.url = row.company_url;
        }
      });
    });

    // 4. Convert map to array and sort by job count
    const companies = Array.from(companyMap.values())
      .map(entry => ({
        company_key: entry.company, // 🚀 Speed: Use exact name as key for indexed lookup
        company: entry.company,

        sponsored_jobs: entry.count,
        company_url: entry.url
      }))
      .sort((a, b) => b.sponsored_jobs - a.sponsored_jobs);

    return NextResponse.json(companies);
  } catch (error: any) {
    console.error("Error in /api/company:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
