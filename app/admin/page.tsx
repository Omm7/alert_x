"use client";

import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AdminJobForm } from "@/components/forms/admin-job-form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { useLoading } from "@/lib/loading-context";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { startLoading, stopLoading } = useLoading();
  const [jobs, setJobs] = useState<any[]>([]);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }

    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      redirect("/dashboard");
    }
  }, [session, status]);

  useEffect(() => {
    async function fetchData() {
      if (status !== "authenticated") return;

      startLoading();
      try {
        const response = await fetch("/api/admin/jobs");
        const data = await response.json();
        setJobs(data.jobs || []);
        setAdmin(data.admin);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
      setLoading(false);
      stopLoading();
    }

    if (session) fetchData();
  }, [session, status, startLoading, stopLoading]);

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    startLoading();
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setJobs(jobs.filter((j) => j.id !== jobId));
        alert("Job deleted successfully");
      } else {
        alert("Failed to delete job");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting job");
    }
    stopLoading();
  };

  if (loading || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-700 dark:text-slate-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header with Admin Info */}
      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-500/30 p-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Control Panel</h1>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            Manage jobs, internships, and hackathons
          </p>
        </div>
        {admin && (
          <div className="text-right">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{admin.name}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Last Login: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "First login"}
            </p>
          </div>
        )}
      </div>

      {/* Create Job Form */}
      <Card className="space-y-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg active:scale-95"
        >
          {showForm ? "Hide Form" : "+ Post New Opportunity"}
        </button>

        {showForm && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Post New Opportunity</h2>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Create a new job, internship, or hackathon posting
              </p>
            </div>
            <AdminJobForm onSuccess={() => {
              setShowForm(false);
              // Refresh jobs list
              fetch("/api/admin/jobs")
                .then(r => r.json())
                .then(data => setJobs(data.jobs || []));
            }} />
          </div>
        )}
      </Card>

      {/* Jobs List */}
      <Card className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Active Postings</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            {jobs.length} {jobs.length === 1 ? "opportunity" : "opportunities"} posted
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/20 p-8 text-center">
            <p className="text-slate-700 dark:text-slate-300">No opportunities posted yet</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Click "Post New Opportunity" to create your first posting
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/40 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500/30"
              >
                {/* Header - Company & Course Type */}
                <div className="space-y-2 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/40 dark:to-slate-900/20 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{job.company.name}</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{job.title}</p>
                    </div>
                    <span className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {job.courseType}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 space-y-3 p-4 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💼</span>
                    <span>{job.jobType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="pt-2">
                    <span className="inline-block rounded-full bg-slate-200 dark:bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {job.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/20 p-4 flex gap-2">
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
