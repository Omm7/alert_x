"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Building2, Wallet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SavedJob {
  id: string;
  job: {
    id: string;
    title: string;
    location: string;
    salary: string;
    jobType: string;
    experienceLevel: string;
    applyLink: string;
    company: {
      name: string;
      logoUrl: string;
    };
  };
}

interface SavedJobsListProps {
  savedJobs: SavedJob[];
  onJobSaved?: () => void;
}

export function SavedJobsList({ savedJobs, onJobSaved }: SavedJobsListProps) {
  const [jobs, setJobs] = useState(savedJobs);
  const [notification, setNotification] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const removeJob = async (jobId: string) => {
    setRemovingId(jobId);
    try {
      const res = await fetch(`/api/saved-jobs/${jobId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setJobs(jobs.filter((item) => item.job.id !== jobId));
        setNotification("✅ Job removed from saved");
        setTimeout(() => setNotification(null), 2000);
      }
    } catch (error) {
      setNotification("❌ Error removing job");
      setTimeout(() => setNotification(null), 2000);
    } finally {
      setRemovingId(null);
    }
  };

  if (!jobs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 mb-4">No saved jobs yet</p>
        <Button asChild size="sm">
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold">
            {notification}
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((item) => (
          <Card
            key={item.id}
            className="group flex flex-col justify-between space-y-4 overflow-hidden hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:dark:shadow-cyan-500/20 transition-all duration-300 relative"
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5 pointer-events-none transition-all duration-500"></div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-200/40 dark:border-slate-700/40">
                <div className="relative">
                  <Image
                    src={item.job.company.logoUrl}
                    alt={item.job.company.name}
                    className="h-12 w-12 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-all"
                    width={48}
                    height={48}
                    loading="lazy"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all">
                    {item.job.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {item.job.company.name}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:translate-x-1 transition-transform">
                  <MapPin className="size-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="font-semibold">{item.job.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:translate-x-1 transition-transform">
                  <Wallet className="size-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <span className="font-semibold">{item.job.salary}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:translate-x-1 transition-transform">
                  <Building2 className="size-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                  <span className="font-semibold">
                    {item.job.jobType.replaceAll("_", " ")} • {item.job.experienceLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-700/40 relative z-10">
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                size="sm"
              >
                <Link href={`/jobs/${item.job.id}`}>View Details</Link>
              </Button>
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold"
                size="sm"
              >
                <a href={item.job.applyLink} target="_blank" rel="noreferrer">
                  Apply Now
                </a>
              </Button>
              <Button
                onClick={() => removeJob(item.job.id)}
                disabled={removingId === item.job.id}
                variant="outline"
                size="sm"
                className="hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
