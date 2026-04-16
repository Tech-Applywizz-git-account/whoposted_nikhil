import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data?.user) {
      console.error("Supabase login failed for:", email, error?.message);
      return NextResponse.json(
        { error: error?.message || "Invalid login credentials" },
        { status: 401 },
      );
    }

    console.log("Supabase login successful for:", data.user.email);

    // Check for premium status based on transactions
    // Use admin client to bypass RLS for this specific check during login
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: transaction } = await supabaseAdmin
      .from("transactions")
      .select("created_at")
      .ilike("user_email", data.user.email?.trim() || "")
      .order("created_at", { ascending: false })
      .maybeSingle();

    let isPremium = false;
    if (transaction) {
      const transactionDate = new Date(transaction.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (transactionDate > thirtyDaysAgo) {
        isPremium = true;
      }
    }

    console.log("Premium status for", email, ":", isPremium);

    const sessionData = {
      userId: data.user.id,
      email: data.user.email,
      isPremium
    };

    // Encrypt session
    const encryptedSession = encrypt(sessionData);
    console.log("Session encrypted for user:", data.user.id);

    // Set cookie using Next.js built-in API (more reliable in Next 15/16)
    const cookieStore = await cookies();
    cookieStore.set("session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    console.log("Session cookie set in cookieStore");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
