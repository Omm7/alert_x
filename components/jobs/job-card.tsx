import Link from "next/link";
import Image from "next/image";
import { Building2, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type JobCardProps = {
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
};

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="group flex h-full flex-col justify-between space-y-4 overflow-hidden hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:dark:shadow-cyan-500/20 transition-all duration-300 relative">
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5 pointer-events-none transition-all duration-500"></div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-start gap-3 pb-3 border-b border-slate-200/40 dark:border-slate-700/40">
          <div className="relative">
            <Image
              src={job.company.logoUrl}
              alt={job.company.name}
              className="h-12 w-12 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-all"
              width={48}
              height={48}
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text transition-all">{job.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{job.company.name}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:translate-x-1 transition-transform">
            <MapPin className="size-4 text-blue-600 dark:text-blue-400 flex-shrink-0" /> 
            <span className="font-semibold">{job.location}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:translate-x-1 transition-transform">
            <Wallet className="size-4 text-green-500 dark:text-green-400 flex-shrink-0" /> 
            <span className="font-semibold">{job.salary}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:translate-x-1 transition-transform">
            <Building2 className="size-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" /> 
            <span className="font-semibold">{job.jobType.replaceAll("_", " ")} • {job.experienceLevel}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-700/40 relative z-10">
        <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold" size="sm">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
        <Button asChild className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold" size="sm">
          <a href={job.applyLink} target="_blank" rel="noreferrer">
            Apply Now
          </a>
        </Button>
      </div>
    </Card>
  );
}
