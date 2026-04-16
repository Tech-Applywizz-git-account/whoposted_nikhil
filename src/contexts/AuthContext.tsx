"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  userId: string;
  email: string;
  isPremium: boolean;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPremium: false,
  signOut: async () => { },
  refreshSession: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      setLoading(true);
      console.log("AuthContext: Refreshing session...");
      const res = await fetch("/api/auth/me", { credentials: "include" });
      
      if (res.ok) {
        const data = await res.json();
        console.log("AuthContext: Session loaded for user:", data.user?.userId);
        setUser(data.user);
      } else {
        console.log("AuthContext: No active session found (status " + res.status + ")");
        setUser(null);
      }
    } catch (err) {
      console.error("AuthContext: Failed to load session", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isPremium: user?.isPremium || false,
        signOut,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
