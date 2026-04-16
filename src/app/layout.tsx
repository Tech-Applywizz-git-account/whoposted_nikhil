import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import "./globals.css";
import { DashboardProvider } from "@/contexts/DashboardContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhoPosted - Track whoposted job opportunities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">
        <AuthProvider>
          <DashboardProvider>
            <AppLayout>{children}</AppLayout>
          </DashboardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
