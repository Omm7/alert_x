import { getJobs } from "@/lib/query";
import { JobCard } from "@/components/jobs/job-card";

export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
  const jobs = await getJobs({ category: "INTERNSHIP", limit: 12, page: 1, sort: "latest" });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Internships</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.items.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
