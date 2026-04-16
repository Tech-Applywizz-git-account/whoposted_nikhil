import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a string into a clean, URL-friendly slug.
 * Example: "Atlassian Engineer / Jira" -> "atlassian-engineer-jira"
 */
export function slugify(text: string): string {
  if (!text) return "";
  
  return text
    .toLowerCase()
    .replace(/\//g, "-") // Replace / with -
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-") // Avoid double hyphens
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start/end
}
