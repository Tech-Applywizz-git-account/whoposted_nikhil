import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error("Supabase signup error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
    }

    console.log("Supabase account created for:", data.user.email);

    // 2. If a session is returned (e.g. email confirmation is disabled), log them in automatically
    if (data.session) {
      const sessionData = {
        userId: data.user.id,
        email: data.user.email,
        isPremium: false, // Initially false on signup
      };

      // Encrypt session
      const encryptedSession = encrypt(sessionData);
      console.log("Session encrypted for new user:", data.user.id);

      // Set cookie using reliable Next.js API
      const cookieStore = await cookies();
      cookieStore.set("session", encryptedSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        sameSite: "lax",
      });

      console.log("Signup session cookie set successfully");

      const res = NextResponse.json({ 
        success: true, 
        message: "Registration successful!",
        redirect: "/overview"
      });
      return res;
    }

    // 3. If no session (email confirmation required)
    console.log("Signup successful, awaiting email confirmation for:", email);
    return NextResponse.json({
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      redirect: "/login"
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
