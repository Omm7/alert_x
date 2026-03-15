"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function JobDetailCard({ job }: { job: any }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{job.title}</h1>
            <p className="text-lg text-slate-700 dark:text-slate-300">{job.company?.name}</p>
          </div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {job.category}
          </span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 text-sm text-slate-700 dark:text-slate-300">
        <span>📍 {job.location}</span>
        <span>💼 {job.jobType}</span>
        <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Main Announcement Box */}
      <Card className="space-y-4 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 p-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="text-blue-600 dark:text-blue-400" size={24} />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Job Announcement</h2>
        </div>
        <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed">
          {job.description}
        </div>
      </Card>

      {/* Apply Link Box */}
      <Card className="space-y-4 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-slate-50 dark:from-green-900/20 dark:to-slate-900/20 p-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔗</span>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Ready to Apply?</h2>
        </div>
        <p className="text-slate-700 dark:text-slate-300">
          Click the button below to apply for this opportunity:
        </p>
        <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-green-600 py-3 text-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600">
            ✨ Apply Now
          </Button>
        </a>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          You will be redirected to the application form
        </p>
      </Card>

      {/* Share/Save Section */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          💾 Save Job
        </Button>
        <Button variant="outline" className="flex-1">
          📤 Share
        </Button>
      </div>
    </div>
  );
}
