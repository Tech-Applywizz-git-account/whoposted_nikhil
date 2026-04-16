import { createClient } from "@supabase/supabase-js";
import AdminControlsClient from "./AdminControlsClient";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminControlsLoading from "./loading";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

// ✅ Single module-level Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🚀 Cache the DB query for 30 seconds to prevent repeated slow lookups
const getCachedAdminUsers = unstable_cache(
  async () => {
    const { data: users, error } = await supabase
      .from("whopost_users")
      .select("user_id, email, full_name, created_at, role, status")
      .eq("role", "whopost_client")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }
    return users || [];
  },
  ["admin-users-list"], // cache key
  { revalidate: 30 }   // 🚀 Cache result for 30 seconds
);

async function verifyAdminAndGetUsers() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return redirect("/login");

  const user = decrypt(sessionCookie);
  if (!user || user.role !== "whopost_admin") return redirect("/");

  // 🚀 Use cached query — first call fetches from DB, subsequent calls are instant
  return getCachedAdminUsers();
}

async function UserList() {
  const users = await verifyAdminAndGetUsers();
  return <AdminControlsClient initialUsers={users} />;
}

export default function AdminControlsPage() {
  return (
    // 🚀 Suspense ensures the loading skeleton shows immediately
    // while verifyAdminAndGetUsers() runs in the background
    <Suspense fallback={<AdminControlsLoading />}>
      <UserList />
    </Suspense>
  );
}