import Link from "next/link";
import { getJobs } from "@/lib/query";
import { JobCard } from "@/components/jobs/job-card";
import { SearchBar } from "@/components/jobs/search-bar";
import { FilterPanel } from "@/components/jobs/filter-panel";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    location?: string;
    jobType?: string;
    experience?: string;
    category?: string;
    sort?: "latest" | "highest_salary" | "relevant";
    page?: string;
  }>;
};

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const data = await getJobs({
    search: params.search,
    location: params.location,
    jobType: params.jobType,
    experience: params.experience,
    category: params.category,
    sort: params.sort,
    page: Number(params.page || 1),
    limit: 9,
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Job Listings</h1>
        <SearchBar />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <FilterPanel />

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {data.total === 0 && (
            <p className="rounded-xl border border-slate-300 bg-slate-50 p-5 text-center text-slate-700 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-300 transition-all duration-300 hover:border-slate-400 hover:shadow-md dark:hover:border-slate-600">No jobs found for your filters.</p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Page {data.page} of {Math.max(data.totalPages, 1)}
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" disabled={data.page <= 1}>
                <Link href={`/jobs?page=${Math.max(1, data.page - 1)}`}>Previous</Link>
              </Button>
              <Button asChild variant="outline" size="sm" disabled={data.page >= data.totalPages}>
                <Link href={`/jobs?page=${Math.min(data.totalPages || 1, data.page + 1)}`}>Next</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
