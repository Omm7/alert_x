"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Briefcase, GraduationCap, DollarSign, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type JobListingCardProps = {
  job: {
    id: string;
    title: string;
    location: string;
    salary: string;
    jobType: string;
    courseType: string;
    experienceLevel: string;
    applyLink: string;
    category: string;
    company: {
      name: string;
      logoUrl: string;
    };
    createdAt: string;
  };
};

export function JobListingCard({ job }: JobListingCardProps) {
  const formatCourseType = (course: string) => {
    const courseMap: Record<string, string> = {
      BTECH: "B.Tech",
      MTECH: "M.Tech",
      MCA: "MCA",
      MBA: "MBA",
      BE: "BE",
      BCA: "BCA",
      BSC: "B.Sc",
      OTHER: "Other",
    };
    return courseMap[course] || course;
  };

  const formatJobType = (type: string) => {
    return type.replace(/_/g, " ");
  };

  const formatExperience = (level: string) => {
    const expMap: Record<string, string> = {
      ENTRY: "0-2 years",
      MID: "2-5 years",
      SENIOR: "5+ years",
    };
    return expMap[level] || level;
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-l-4 border-l-blue-500 transition-all hover:-translate-y-2 hover:shadow-2xl">
      {/* Header with Company Logo and Name */}
      <div className="space-y-3 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 flex-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-slate-200 bg-white shadow-md flex-shrink-0">
              <Image
                src={job.company.logoUrl}
                alt={job.company.name}
                className="h-14 w-14 rounded object-contain"
                width={56}
                height={56}
                loading="lazy"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 truncate">{job.company.name}</h3>
              <p className="text-xs text-slate-500 truncate">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <span className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 flex-shrink-0">
            {formatCourseType(job.courseType)}
          </span>
        </div>
      </div>

      {/* Key Details Grid */}
      <div className="flex-1 space-y-3 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="font-medium">{job.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Briefcase className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span className="font-medium">{formatJobType(job.jobType)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="font-medium">{job.salary}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <GraduationCap className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <span className="font-medium">{formatCourseType(job.courseType)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Briefcase className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="font-medium">Exp: {formatExperience(job.experienceLevel)}</span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="pt-2">
          <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
            {job.category.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 border-t border-slate-200 bg-slate-50 p-4">
        <Link href={`/jobs/${job.id}`} className="block">
          <Button variant="outline" className="w-full">
            📋 View Details
          </Button>
        </Link>
        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
            <ExternalLink className="h-4 w-4" />
            Apply Now
          </Button>
        </a>
      </div>
    </Card>
  );
}
