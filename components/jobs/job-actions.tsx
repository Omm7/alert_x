"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/lib/loading-context";

export function JobActions({ jobId, applyLink }: { jobId: string; applyLink: string }) {
  const { startLoading, stopLoading } = useLoading();
  const [status, setStatus] = useState<string | null>(null);

  async function saveJob() {
    startLoading();
    const res = await fetch("/api/saved-jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    stopLoading();

    setStatus(res.ok ? "Job saved" : "Please login to save jobs");
  }

  async function applyAndTrack() {
    startLoading();
    await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    stopLoading();

    window.open(applyLink, "_blank", "noopener,noreferrer");
    setStatus("Application tracked");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        <Button onClick={applyAndTrack}>Apply Now</Button>
        <Button variant="outline" onClick={saveJob}>
          Save Job
        </Button>
      </div>
      {status && <p className="text-sm text-slate-500 dark:text-slate-300">{status}</p>}
    </div>
  );
}
