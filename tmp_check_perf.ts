import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testQuery() {
    console.time("query_counts");
    const { count: total, error: err1 } = await supabase.from("whopost_users").select("*", { count: "exact", head: true }).eq("role", "whopost_client");
    const { count: paid, error: err2 } = await supabase.from("whopost_users").select("*", { count: "exact", head: true }).eq("role", "whopost_client").eq("status", true);
    const { count: unpaid, error: err3 } = await supabase.from("whopost_users").select("*", { count: "exact", head: true }).eq("role", "whopost_client").eq("status", false);
    console.timeEnd("query_counts");

    console.time("query_list_paged");
    const { data, error: err4 } = await supabase
        .from("whopost_users")
        .select("user_id, email, full_name, created_at, role, status")
        .eq("role", "whopost_client")
        .order("created_at", { ascending: false })
        .limit(10);
    console.timeEnd("query_list_paged");

    if (err1 || err2 || err3 || err4) {
        console.error("Error:", err1 || err2 || err3 || err4);
    } else {
        console.log("Total:", total, "Paid:", paid, "Unpaid:", unpaid);
        console.log("Data sample size:", data?.length);
    }
}

testQuery();
