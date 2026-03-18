"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/lib/loading-context";
import { useSaveNotification } from "@/lib/save-notification-context";

interface JobActionsProps {
  jobId: string;
  applyLink: string;
  jobTitle?: string;
}

export function JobActions({ jobId, applyLink, jobTitle = "this job" }: JobActionsProps) {
  const { startLoading, stopLoading } = useLoading();
  const { showNotification } = useSaveNotification();
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  // Auto-dismiss status after 3 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  async function saveJob() {
    startLoading();
    setTimeout(() => stopLoading(), 300);
    
    try {
      const res = await fetch("/api/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (res.ok) {
        setStatusType("success");
        setStatus("✅ Job saved successfully!");
        showNotification("✅ Job saved in dashboard", "success");
      } else {
        const data = await res.json();
        setStatusType("error");
        setStatus(data.error || "❌ Please login to save jobs");
        showNotification("❌ Please login to save jobs", "error");
      }
    } catch (error) {
      setStatusType("error");
      setStatus("❌ Error saving job. Please try again.");
      showNotification("❌ Error saving job", "error");
    }
  }

  async function shareJob() {
    const jobUrl = `${window.location.origin}/jobs/${jobId}`;
    
    // Use native share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: jobTitle,
          text: `Check out this job opening: ${jobTitle}`,
          url: jobUrl,
        });
        setStatusType("success");
        setStatus("✅ Job shared successfully!");
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(jobUrl);
        setStatusType("success");
        setStatus("✅ Job link copied to clipboard!");
      } catch (error) {
        setStatusType("error");
        setStatus("❌ Error sharing job. Please try again.");
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button 
          onClick={saveJob}
          variant="outline" 
          className="flex-1 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          💾 Save Job
        </Button>
        <Button 
          onClick={shareJob}
          variant="outline" 
          className="flex-1 font-semibold hover:bg-green-50 dark:hover:bg-green-900/30"
        >
          📤 Share
        </Button>
      </div>
      {status && (
        <p className={`text-sm font-medium text-center px-3 py-2 rounded transition-all ${
          statusType === "success" 
            ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" 
            : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
        }`}>
          {status}
        </p>
      )}
    </div>
  );
}
