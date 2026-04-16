import { JobCard } from "./JobCard";

interface Job {
  id: number;
  companyName: string;
  companyUrl: string | null;
  jobTitle: string;
  jobRole: string;
  posterName: string | null;
  posterUrl: string | null;
  jobUrl: string;
  source: string | null;
  date: string;
}

interface SponsorshipTableProps {
  jobs: Job[];
}

export const SponsorshipTable = ({ jobs }: SponsorshipTableProps) => {
  return (
    <div className="flex flex-col gap-6 px-1 py-1 animate-slide-up">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};