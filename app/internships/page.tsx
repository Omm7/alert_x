import { Metadata } from "next";
import { getJobs } from "@/lib/query";
import { JobCard } from "@/components/jobs/job-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internship Opportunities - Qyvex | Summer & Winter Internships",
  description: "Find internship opportunities at top tech companies. Browse summer internships, winter internships, and paid internship positions for students.",
  keywords: [
    "internships",
    "internship opportunities",
    "summer internships",
    "winter internships",
    "paid internships",
    "student internships",
    "tech internships",
    "software internships",
    "internship programs",
    "career development",
    "college internships",
    "on-campus internships",
    "off-campus internships",
  ],
  openGraph: {
    title: "Internship Opportunities - Qyvex",
    description: "Discover amazing internship opportunities at leading tech companies. Start your career with Qyvex.",
    url: "https://qyvex.tech/internships",
    siteName: "Qyvex",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Internship Opportunities - Qyvex",
    description: "Find your next internship opportunity on Qyvex. Summer & winter internships available.",
  },
};

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
