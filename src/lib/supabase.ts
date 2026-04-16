import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our daily_linkedin_jobs_report table
export interface JobData {
  id: number;
  company: string;
  job_title: string;
  job_role: string;
  poster_full_name: string;
  poster_profile_url: string;
  job_url: string;
  company_url: string;
  source: string;
  report_date: string | null;
  created_at: string;
}

export interface DatabaseStats {
  totalJobs: number;
  sponsoredJobs: number;
  nonSponsoredJobs: number;
  doesNotMention: number;
  uniqueCompanies: number;
  uniqueRoles: number;
  uniqueLocations: number;
  topCompanies: Array<{ company: string; count: number }>;
  topRoles: Array<{ job_role_name: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
}

// Authentication types
export interface UserRole {
  id: string;
  email: string;
  role: "whopost_client" | "whopost_admin";
}

export interface AuthUser extends User {
  role?: "whopost_client" | "whopost_admin";
}

// Role checking functions
