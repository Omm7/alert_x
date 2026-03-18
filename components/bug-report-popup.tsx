"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useBugReport } from "@/lib/bug-report-context";
import { Button } from "@/components/ui/button";

export function BugReportPopup() {
  const { isVisible, hideBugReport } = useBugReport();
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null);

  // Auto-hide on first load
  useEffect(() => {
    if (isVisible && !hasSubmitted) {
      const timer = setTimeout(() => {
        hideBugReport();
      }, 5000);
      setAutoHideTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideBugReport, hasSubmitted]);

  // Show on scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Clear existing timer
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      // Show popup after scrolling stops for 2 seconds
      scrollTimeout = setTimeout(() => {
        if (!hasSubmitted) {
          const bugReportPopup = document.querySelector('[data-bug-report]');
          if (bugReportPopup) {
            // Only show if not already visible and hasn't been submitted recently
            const savedTime = localStorage.getItem('bugReportLastShown');
            const now = Date.now();
            if (!savedTime || now - parseInt(savedTime) > 15000) {
              const bugReportProvider = document.querySelector('[data-bug-report-provider]');
              if (bugReportProvider) {
                const provider = bugReportProvider as any;
                if (provider.showBugReport) {
                  provider.showBugReport();
                  localStorage.setItem('bugReportLastShown', now.toString());
                }
              }
            }
          }
        }
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [hasSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/report-bug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback,
          url: typeof window !== "undefined" ? window.location.href : "",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setHasSubmitted(true);
        setFeedback("");
        // Hide popup after successful submission
        setTimeout(() => {
          hideBugReport();
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting bug report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      data-bug-report
      className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] animate-slide-up"
    >
      <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl shadow-2xl p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <h3 className="font-semibold text-white">Report a Bug</h3>
          </div>
          <button
            onClick={hideBugReport}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-300">
          Is everything working properly? Let us know if you find any issues or have feedback.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Describe the issue or your feedback…"
            maxLength={500}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 resize-none"
            rows={3}
            disabled={isSubmitting}
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              onClick={hideBugReport}
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-slate-200"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!feedback.trim() || isSubmitting}
              className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>
          </div>
        </form>

        {/* Success Message */}
        {hasSubmitted && (
          <div className="text-center py-3 px-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-400">✓ Thanks for your feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
}
