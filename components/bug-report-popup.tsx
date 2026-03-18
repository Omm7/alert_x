"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, MessageCircle } from "lucide-react";
import { useBugReport } from "@/lib/bug-report-context";
import { Button } from "@/components/ui/button";

export function BugReportPopup() {
  const { isVisible, showBugReport, hideBugReport } = useBugReport();
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show initially
    showBugReport();
  }, [showBugReport]);

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
        // Reset after 2 seconds
        setTimeout(() => {
          setHasSubmitted(false);
          setIsExpanded(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting bug report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsExpanded(false);
    hideBugReport();
  };

  if (!isVisible || !mounted) return null;

  // Collapsed state - small floating button
  if (!isExpanded) {
    return (
      <button
        onClick={toggleExpand}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-pulse"
        title="Report a bug"
        aria-label="Report a bug"
      >
        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    );
  }

  // Expanded state - full form
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md animate-slide-up pointer-events-auto">
      <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl shadow-2xl p-3 sm:p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
            <h3 className="font-semibold text-sm sm:text-base text-white">Report a Bug</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-slate-300">
          Is everything working properly? Let us know if you find any issues or have feedback.
        </p>

        {/* Form or Success Message */}
        {!hasSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe the issue…"
              maxLength={500}
              className="w-full px-2 sm:px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 resize-none"
              rows={3}
              disabled={isSubmitting}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                onClick={handleClose}
                variant="ghost"
                size="sm"
                className="text-xs text-slate-400 hover:text-slate-200 h-8"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!feedback.trim() || isSubmitting}
                className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all h-8"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 sm:py-6 px-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-xs sm:text-sm text-green-400 font-medium">✓ Thanks for your feedback!</p>
            <p className="text-xs text-green-400/70 mt-1">We'll review it shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
