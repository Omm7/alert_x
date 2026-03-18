import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Briefcase, GraduationCap, Building2 } from "lucide-react";
import { JobActions } from "@/components/jobs/job-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id }, include: { company: true } });

  if (!job) {
    return { title: "Job not found" };
  }

  return {
    title: `${job.title} at ${job.company.name}`,
    description: `${job.title} in ${job.location}. Apply now on Qyvex.`,
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!job) {
    notFound();
  }

  const relatedJobs = await prisma.job.findMany({
    where: {
      id: { not: job.id },
      category: job.category,
    },
    include: { company: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    employmentType: job.jobType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      sameAs: job.company.website,
      logo: job.company.logoUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div className="space-y-2">
        <p className="text-sm text-slate-700 uppercase tracking-wide font-medium dark:text-slate-300">From {job.company.name}</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">{job.title}</h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          📅 Posted on {new Date(job.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Company Header with Logo & Job Details */}
      <Card className="space-y-4 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 border-l-4 border-l-blue-500 p-6">
        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          {/* Company Logo */}
          <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800 shadow-md flex-shrink-0">
            <Image
              src={job.company.logoUrl}
              alt={job.company.name}
              width={96}
              height={96}
              className="h-20 w-20 object-contain"
              unoptimized
            />
          </div>

          {/* Job Details Grid */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Location</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Salary</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{job.salary}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Type</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{job.jobType.replace(/_/g, " ")}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Course</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{job.courseType}</p>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-2">Category</p>
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {job.category.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Experience Level Box */}
      <Card className="space-y-3 bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-900/20 dark:to-slate-900/20 border-l-4 border-l-indigo-500 p-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💼</span>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Years of Experience Required</h2>
        </div>
        <div className="inline-block rounded-lg bg-indigo-100 px-4 py-2 font-semibold text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300">
          {job.experienceLevel === "ENTRY" ? "Entry Level (0-2 years)" : job.experienceLevel === "MID" ? "Mid Level (2-5 years)" : "Senior Level (5+ years)"}
        </div>
      </Card>

      {/* Main Announcement Box */}
      <Card className="space-y-4 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 p-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📢</span>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Announcement</h2>
        </div>
        <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed text-base">
          {job.description}
        </div>
      </Card>

      {/* Apply Link Box */}
      <Card className="space-y-4 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-slate-50 dark:from-green-900/20 dark:to-slate-900/20 p-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Take Action</h2>
        </div>
        <p className="text-slate-700 dark:text-slate-300">
          Ready to apply for this opportunity? Click the button below to proceed with your application.
        </p>
        <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-green-600 py-4 text-lg font-bold hover:bg-green-700 dark:hover:bg-green-600">
            ✨ Apply Now
          </Button>
        </a>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          You will be redirected to the official application portal
        </p>
      </Card>

      {/* Action Buttons */}
      <JobActions jobId={job.id} applyLink={job.applyLink} jobTitle={job.title} />

      {/* Related Jobs */}
      {relatedJobs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🎯 Similar Opportunities</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedJobs.map((related) => (
              <Card
                key={related.id}
                className="space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="space-y-1">
                  <p className="text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide font-medium">
                    {related.company.name}
                  </p>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{related.title}</h3>
                </div>
                <Link
                  href={`/jobs/${related.id}`}
                  className="mt-3 inline-block text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors hover:text-blue-700 dark:hover:text-blue-300"
                >
                  View Details →
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
