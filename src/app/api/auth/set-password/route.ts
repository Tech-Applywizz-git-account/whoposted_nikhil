import { createClient } from "@supabase/supabase-js";
import { decrypt } from "@/lib/session";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  const { token, refreshToken, password, email } = await req.json();

  let userId: string | undefined;

  if (email && token && !refreshToken) {
    // 1. Logic for Whoposted Email-less Flow (using custom encrypted token)
    const verificationData = decrypt(token);

    if (!verificationData || verificationData.email !== email) {
      return Response.json(
        { error: "Invalid reset token." },
        { status: 401 },
      );
    }

    if (Date.now() > verificationData.expiresAt) {
      return Response.json(
        { error: "Reset link has expired. Please try again." },
        { status: 401 },
      );
    }

    userId = verificationData.userId;
  } else {
    // 2. Logic for traditional flow (SkillPassport)
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: refreshToken,
    });

    if (sessionError || !sessionData.user) {
      return Response.json(
        { error: "Failed to authenticate user session." },
        { status: 401 },
      );
    }
    userId = sessionData.user.id;
  }

  // 3. Update the user's password using the Admin API
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // Ensure userId is available before proceeding
  if (!userId) {
    return Response.json(
      { error: "Could not identify user for password update." },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: password,
    email_confirm: true // Double-confirm to ensure login is unlocked
  });

  if (error) {
    console.error("Admin password update error:", error);
    return Response.json(
      { error: "Failed to update password." },
      { status: 400 },
    );
  }

  return Response.json({ message: "Password updated successfully!" });
}
