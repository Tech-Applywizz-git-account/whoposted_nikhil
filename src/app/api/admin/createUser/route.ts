import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  let email, role, country;
  const origin = req.headers.get("origin") || 'https://whoposted-jobs.vercel.app';

  try {
    const body = await req.json();
    email = body.email;
    role = body.role;
    country = body.country;
  } catch (e) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    // 1. Invite Supabase user (triggers invitation email)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${origin}/auth/set-password`
      });

    if (authError) {
      // Check if user already exists
      if (authError.message?.toLowerCase().includes("already been registered") ||
        (authError as any).code === "user_already_exists") {

        console.log(`User ${email} already exists in Auth. Attempting to link to table.`);

        // Find the existing user ID from Auth using pagination loop
        let foundUser = null;
        let page = 1;
        const PER_PAGE = 50;
        let hasMore = true;

        while (!foundUser && hasMore) {
          const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers({
            page,
            perPage: PER_PAGE
          });

          if (listError) {
            console.error("Error listing users:", listError);
            throw listError;
          }

          const users = data.users || [];
          foundUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

          if (users.length < PER_PAGE) {
            hasMore = false;
          }
          page++;
        }

        if (!foundUser) {
          return Response.json({ error: "User reported as existing but could not be found." }, { status: 500 });
        }

        // 2. Insert into custom users table
        // First ensure record in base 'users' table
        const { error: usersTableError } = await supabaseAdmin
          .from("users")
          .upsert([{ id: foundUser.id, email: email }]);

        if (usersTableError) {
          console.error("Warning: Error creating base user record in 'users' table:", usersTableError);
        }

        const { error: dbError } = await supabaseAdmin
          .from("whopost_users")
          .insert([{ user_id: foundUser.id, email, role, country }]);

        // 3. Trigger a password reset/instructions email so they "get the mail" for Whoposted access
        await supabaseAdmin.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/auth/set-password`
        });

        if (dbError) {
          if (dbError.code === "23505") { // unique_violation
            return Response.json({ message: "User already registered. Access instructions have been resent to their email." });
          }
          return Response.json({ error: dbError.message }, { status: 400 });
        }

        return Response.json({ message: "Existing user linked and access instructions sent successfully!" });
      }

      return Response.json(
        { error: authError.message || "Failed to invite user" },
        { status: 400 },
      );
    }

    if (!authData?.user) {
      return Response.json(
        { error: "Failed to create user" },
        { status: 400 },
      );
    }

    // 2. Insert into custom users table
    // First ensure record in base 'users' table
    const { error: usersTableError } = await supabaseAdmin
      .from("users")
      .upsert([{ id: authData.user.id, email: email }]);

    if (usersTableError) {
      console.error("Warning: Error creating base user record in 'users' table:", usersTableError);
    }

    const { error: dbError } = await supabaseAdmin
      .from("whopost_users")
      .insert([{ user_id: authData.user.id, email, role, country }]);

    if (dbError) {
      return Response.json({ error: dbError.message }, { status: 400 });
    }

    return Response.json({
      message: "Invite email sent successfully!",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}