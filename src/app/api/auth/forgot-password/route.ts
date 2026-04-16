import { createClient } from "@supabase/supabase-js";
import { encrypt } from "@/lib/session";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return Response.json({ error: "Email is required" }, { status: 400 });
        }

        // 1. Verify user exists and belongs to Whoposted
        const { data: userRecord, error: userError } = await supabaseAdmin
            .from("whopost_users")
            .select("user_id, role")
            .eq("email", email)
            .single();

        if (userError || !userRecord) {
            return Response.json({ error: "User not found or does not belong to Whoposted" }, { status: 404 });
        }

        const allowedRoles = ["whopost_client", "whopost_admin"];
        if (!allowedRoles.includes(userRecord.role)) {
            return Response.json({ error: "Unauthorized access" }, { status: 403 });
        }

        // 2. Generate a custom secure token that doesn't expire instantly
        // This token is encrypted and includes an expiry timestamp (10 minutes)
        const resetData = {
            userId: userRecord.user_id,
            email: email,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes from now
        };

        const internalToken = encrypt(resetData);

        // 3. Return the token directly to the frontend
        return Response.json({
            message: "Reset authorization granted.",
            token: internalToken,
            email: email
        });
    } catch (error) {
        console.error("Error in email-less forgot-password flow:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
