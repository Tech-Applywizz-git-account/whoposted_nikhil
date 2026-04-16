import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ⬅️ await here
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      console.log("ME endpoint: No session cookie found");
      return Response.json({ user: null }, { status: 401 });
    }

    console.log("ME endpoint: Session cookie found, decrypting...");
    const user = decrypt(sessionCookie);
    
    if (!user) {
      console.error("ME endpoint: Failed to decrypt session cookie");
      return Response.json({ user: null }, { status: 401 });
    }

    console.log("ME endpoint: Decryption successful for user:", user.userId);
    return Response.json({ user });
  } catch (err) {
    console.error("Auth check failed in ME endpoint:", err);
    return Response.json({ user: null }, { status: 500 });
  }
}
