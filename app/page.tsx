import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/job-card";
import { Card } from "@/components/ui/card";
import { SubscriptionForm } from "@/components/forms/subscription-form";

export const dynamic = "force-dynamic";

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
    <div className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <div className="fade-in space-y-6">
          <p className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-cyan-400 backdrop-blur-sm">
            ✨ Qyvex.tech - Smart Job Alerts
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight animate-gradient-shift sm:text-6xl lg:text-7xl dark:from-blue-300 dark:via-cyan-300 dark:to-blue-300">
            Find Your Dream Tech Role
          </h1>
          <p className="max-w-xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Stay ahead with intelligent real-time job alerts tailored for developers, engineers, and tech professionals.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/30 animate-slide-in-left">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-blue-500/50 text-blue-600 dark:text-cyan-400 hover:bg-blue-50/10 dark:hover:bg-cyan-500/10">
              <Link href="/#subscribe">Subscribe to Alerts</Link>
            </Button>
          </div>
        </div>
        <div className="fade-in animate-scale-in rounded-2xl border border-slate-300/50 dark:border-cyan-500/20 bg-gradient-to-br from-white/80 via-blue-50/50 to-cyan-50/30 dark:from-slate-900/50 dark:via-blue-900/20 dark:to-cyan-900/20 p-8 backdrop-blur-sm shadow-xl dark:shadow-cyan-500/10 hover:shadow-2xl transition-all duration-500">
          <div className="grid grid-cols-2 gap-4">
            {["React", "Node.js", "AI", "Cloud", "Security", "Data"].map((item, idx) => (
              <div key={item} className="rounded-xl border border-blue-200/50 dark:border-cyan-500/20 bg-gradient-to-br from-blue-50/80 to-cyan-50/50 dark:from-blue-500/10 dark:to-cyan-500/5 p-4 text-center font-bold text-slate-900 dark:text-cyan-300 transition-all duration-300 hover:scale-105 hover:border-blue-400 dark:hover:border-cyan-500/50 hover:shadow-lg cursor-pointer" style={{animationDelay: `${idx * 100}ms`}}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8 animate-slide-in-up">
        <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-700/30 pb-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">Featured Jobs</h2>
          <Link href="/jobs" className="text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 flex items-center gap-2 transition-all duration-300 group">
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

      <section className="space-y-8 animate-slide-in-up">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">Browse Categories</h2>
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

      <section className="space-y-8 animate-slide-in-up">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">How It Works</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Create account", "Set job preferences", "Receive job alerts", "Apply directly"].map((step, index) => (
            <Card key={step} className="group p-6 hover:border-cyan-400/60 dark:hover:border-cyan-500/50 hover:bg-gradient-to-br hover:from-cyan-50/50 dark:hover:from-cyan-500/10 hover:to-blue-50/30 dark:hover:to-blue-500/5 hover:shadow-lg dark:hover:shadow-cyan-500/20 cursor-pointer transform transition-all duration-300 hover:scale-105">
              <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-2">Step {index + 1}</p>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:bg-clip-text">{step}</h3>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-8 animate-slide-in-up">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">What Students Say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["I landed my first internship in 2 weeks.", "The alerts are always relevant and fast.", "Clean dashboard and direct apply links save time."].map((quote, idx) => (
            <Card key={quote} className="group p-6 hover:border-cyan-400/60 dark:hover:border-cyan-500/50 hover:bg-gradient-to-br hover:from-cyan-50/50 dark:hover:from-cyan-500/10 hover:to-blue-50/30 dark:hover:to-blue-500/5 hover:shadow-lg dark:hover:shadow-cyan-500/20 cursor-pointer transform transition-all duration-300 hover:-translate-y-2" style={{animationDelay: `${idx * 100}ms`}}>
              <p className="text-lg italic text-slate-700 dark:text-slate-300 font-semibold">&quot;{quote}&quot;</p>
              <div className="mt-4 text-cyan-600 dark:text-cyan-400">★★★★★</div>
            </Card>
          ))}
        </div>
      </section>

      <section id="subscribe" className="rounded-2xl border border-cyan-500/30 dark:border-cyan-500/40 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-blue-600/10 dark:from-blue-600/20 dark:via-cyan-600/20 dark:to-blue-600/20 backdrop-blur-sm p-8 lg:p-12 shadow-xl dark:shadow-cyan-500/20 lg:grid-cols-2 gap-8 max-w-4xl mx-auto animate-scale-in">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">Get Instant Job Alerts</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Set your preferences once and receive curated job opportunities delivered to your inbox instant as they get posted.
          </p>
        </div>
        <div>
          <SubscriptionForm />
        </div>
      </section>
    </div>
  );
}
