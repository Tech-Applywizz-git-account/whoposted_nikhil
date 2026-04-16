import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Check custom user table
        const { data: userRecord } = await supabaseAdmin
            .from("whopost_users")
            .select("user_id, email, status")
            .ilike("email", email.trim())
            .maybeSingle();

        if (!userRecord) {
            return NextResponse.json({ exists: false, error: "User not found in records" }, { status: 404 });
        }

        // 2. Check if user is inactive
        if (userRecord.status === 'inactive') {
            return NextResponse.json({ exists: true, error: "Account is inactive" }, { status: 403 });
        }

        // 3. Check strict Auth existence
        const { data: authUser, error: authCheckError } = await supabaseAdmin.auth.admin.getUserById(userRecord.user_id);

        if (authCheckError || !authUser?.user) {
            return NextResponse.json({ exists: false, error: "User auth profile missing" }, { status: 404 });
        }

        return NextResponse.json({ exists: true });
    } catch (err) {
        console.error("Check user error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
