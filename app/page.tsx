import Link from "next/link";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/job-card";
import { Card } from "@/components/ui/card";
import { SubscriptionForm } from "@/components/forms/subscription-form";
import { TechnologyCategories } from "@/components/home/technology-categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Qyvex - Find Tech Jobs, Internships & Off-Campus Opportunities",
  description:
    "Discover verified tech jobs, internships, and off-campus drives. Get real-time job alerts tailored for CS students. Search software engineering, data science, AI/ML, and cybersecurity roles.",
  keywords: [
    "tech jobs India",
    "software engineering jobs",
    "internships for students",
    "off-campus drives",
    "campus recruitment",
  ],
  openGraph: {
    title: "Qyvex - Find Your Dream Tech Role",
    description:
      "Real-time job alerts for tech professionals and CS students. Discover internships, full-time roles, and off-campus opportunities.",
    type: "website",
  },
};

const categories = [
  { name: "Software Engineering", value: "SOFTWARE_ENGINEERING" },
  { name: "Data Science", value: "DATA_SCIENCE" },
  { name: "AI / ML", value: "AI_ML" },
  { name: "Cybersecurity", value: "CYBERSECURITY" },
  { name: "Internships", value: "INTERNSHIP" },
  { name: "Off Campus Drives", value: "OFF_CAMPUS_DRIVE" },
];

export default async function Home() {
  let featuredJobs: Prisma.JobGetPayload<{ include: { company: true } }>[] = [];

  try {
    featuredJobs = await prisma.job.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { company: true },
    });
  } catch (error) {
    console.error("Failed to load featured jobs", error);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 sm:space-y-20 px-3 sm:px-4 py-8 sm:py-12 md:px-6 lg:px-8">
      <section className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
        <div className="fade-in space-y-4 sm:space-y-6">
          <p className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-cyan-400 backdrop-blur-sm">
            ✨ Qyvex.tech - Smart Job Alerts
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight animate-gradient-shift dark:from-blue-300 dark:via-cyan-300 dark:to-blue-300">
            Find Your Dream Tech Role
          </h1>
          <p className="max-w-xl text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Stay ahead with intelligent real-time job alerts tailored for developers, engineers, and tech professionals.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/30 animate-slide-in-left text-sm sm:text-base">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-blue-500/50 text-blue-600 dark:text-cyan-400 hover:bg-blue-50/10 dark:hover:bg-cyan-500/10 text-sm sm:text-base">
              <Link href="/#subscribe">Subscribe to Alerts</Link>
            </Button>
          </div>
        </div>
        <div className="fade-in animate-scale-in rounded-2xl border border-slate-300/50 dark:border-cyan-500/20 bg-gradient-to-br from-white/80 via-blue-50/50 to-cyan-50/30 dark:from-slate-900/50 dark:via-blue-900/20 dark:to-cyan-900/20 p-8 backdrop-blur-sm shadow-xl dark:shadow-cyan-500/10 hover:shadow-2xl transition-all duration-500">
          <TechnologyCategories />
        </div>
      </section>

      <section className="space-y-6 sm:space-y-8 animate-slide-in-up">
        <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-700/30 pb-3 sm:pb-4 flex-col sm:flex-row gap-2 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">Featured Jobs</h2>
          <Link href="/jobs" className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 flex items-center gap-2 transition-all duration-300 group">
            View all jobs <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job, idx) => (
            <div key={job.id} className="animate-scale-in" style={{animationDelay: `${idx * 100}ms`}}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
        {!featuredJobs.length && (
          <Card className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-300">Featured jobs are temporarily unavailable. Please check back shortly.</p>
          </Card>
        )}
      </section>

      <section className="space-y-6 sm:space-y-8 animate-slide-in-up">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">Browse Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, idx) => (
            <Link key={category.value} href={`/jobs?category=${category.value}`} className="group" style={{animationDelay: `${idx * 80}ms`}}>
              <Card className="h-full group-hover:border-blue-400/60 dark:group-hover:border-cyan-500/50 group-hover:bg-gradient-to-br group-hover:from-blue-50/50 dark:group-hover:from-blue-500/10 group-hover:to-cyan-50/30 dark:group-hover:to-cyan-500/5 group-hover:shadow-lg dark:group-hover:shadow-cyan-500/20 cursor-pointer">
                <p className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all duration-300">{category.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6 sm:space-y-8 animate-slide-in-up">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">How It Works</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Create account", "Set job preferences", "Receive job alerts", "Apply directly"].map((step, index) => (
            <Card key={step} className="group p-6 hover:border-cyan-400/60 dark:hover:border-cyan-500/50 hover:bg-gradient-to-br hover:from-cyan-50/50 dark:hover:from-cyan-500/10 hover:to-blue-50/30 dark:hover:to-blue-500/5 hover:shadow-lg dark:hover:shadow-cyan-500/20 cursor-pointer transform transition-all duration-300 hover:scale-105">
              <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-2">Step {index + 1}</p>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:bg-clip-text">{step}</h3>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6 sm:space-y-8 animate-slide-in-up">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">What Students Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["I landed my first internship in 2 weeks.", "The alerts are always relevant and fast.", "Clean dashboard and direct apply links save time."].map((quote, idx) => (
            <Card key={quote} className="group p-6 hover:border-cyan-400/60 dark:hover:border-cyan-500/50 hover:bg-gradient-to-br hover:from-cyan-50/50 dark:hover:from-cyan-500/10 hover:to-blue-50/30 dark:hover:to-blue-500/5 hover:shadow-lg dark:hover:shadow-cyan-500/20 cursor-pointer transform transition-all duration-300 hover:-translate-y-2" style={{animationDelay: `${idx * 100}ms`}}>
              <p className="text-lg italic text-slate-700 dark:text-slate-300 font-semibold">&quot;{quote}&quot;</p>
              <div className="mt-4 text-cyan-600 dark:text-cyan-400">★★★★★</div>
            </Card>
          ))}
        </div>
      </section>

      <section id="subscribe" className="rounded-2xl border border-cyan-500/30 dark:border-cyan-500/40 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 dark:from-blue-600/20 dark:via-cyan-600/20 dark:to-blue-600/20 backdrop-blur-sm p-6 sm:p-8 lg:p-12 shadow-xl dark:shadow-cyan-500/20 gap-6 sm:gap-8 max-w-4xl mx-auto animate-scale-in">
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">Get Instant Job Alerts</h2>
          <SubscriptionForm />
        </div>
      </section>
    </div>
  );
}
