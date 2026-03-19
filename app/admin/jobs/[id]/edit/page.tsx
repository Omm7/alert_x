"use client";

import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import Link from "next/link";
import { useLoading } from "@/lib/loading-context";
import { Loader } from "@/components/ui/loader";

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setJobId(id);
    })();
  }, [params]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login");
    }

    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      redirect("/dashboard");
    }
  }, [session, status]);

  useEffect(() => {
    async function fetchJob() {
      if (!jobId) return;

      try {
        const response = await fetch(`/api/admin/jobs/${jobId}`);
        if (!response.ok) {
          setMessage("Job not found");
          return;
        }
        const data = await response.json();
        setJob(data.job);
      } catch (error) {
        console.error("Error fetching job:", error);
        setMessage("Failed to load job");
      }
      setLoading(false);
    }

    if (jobId) fetchJob();
  }, [jobId]);

  async function handleSubmit(formData: FormData) {
    if (!jobId) return;
    
    setSubmitting(true);
    startLoading();
    setMessage(null);

    const payload = {
      companyName: formData.get("companyName"),
      companyLogoUrl: formData.get("companyLogoUrl"),
      courseType: formData.get("courseType"),
      location: formData.get("location"),
      salary: formData.get("salary"),
      jobType: formData.get("jobType"),
      category: formData.get("category"),
      experienceLevel: formData.get("experienceLevel"),
      description: formData.get("description"),
      applyLink: formData.get("applyLink"),
    };

    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitting(false);
      stopLoading();

      if (res.ok) {
        setMessage("Job updated successfully!");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1500);
      } else {
        setMessage("Failed to update job");
      }
    } catch (error) {
      setSubmitting(false);
      stopLoading();
      setMessage("Error updating job");
    }
  }

  if (loading || status === "loading" || !jobId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    return null;
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Card className="space-y-4">
          <p className="text-red-600">Job not found</p>
          <Link href="/admin">
            <Button>Back to Admin Panel</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div>
        <Link href="/admin" className="mb-4 inline-block text-blue-600 hover:underline">
          ← Back to Admin Panel
        </Link>
        <h1 className="text-3xl font-bold">Edit Job Posting</h1>
      </div>

      <Card className="space-y-6">
        <form action={handleSubmit} className="space-y-5">
          {/* Company Details Section */}
          <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-4 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">🏢 Company Details</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company Name
                </label>
                <Input
                  name="companyName"
                  placeholder="e.g., Google, TCS, Microsoft"
                  defaultValue={job.company?.name}
                  required
                  className="border-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company Logo URL
                </label>
                <Input 
                  name="companyLogoUrl" 
                  placeholder="https://example.com/logo.png" 
                  type="url"
                  defaultValue={job.company?.logoUrl}
                  required 
                  className="border-2"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Direct link to company logo (PNG/JPG, 400x400px recommended)
                </p>
              </div>
            </div>
          </div>

          {/* Job Position Details Section */}
          <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 space-y-4">
            <h3 className="text-lg font-bold text-purple-900">📍 Job Position Details</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-purple-900">
                  Work Location
                </label>
                <Input 
                  name="location" 
                  placeholder="e.g., Bangalore, Hyderabad, Remote" 
                  defaultValue={job.location}
                  required 
                  className="border-2 border-purple-300"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-purple-900">
                  Salary (Annual)
                </label>
                <Input 
                  name="salary" 
                  placeholder="e.g., 5-7 LPA, ₹6,00,000, Competitive" 
                  defaultValue={job.salary}
                  required 
                  className="border-2 border-purple-300"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-purple-900">
                  Job Type
                </label>
                <select 
                  name="jobType"
                  required
                  defaultValue={job.jobType || "FULL_TIME"}
                  className="w-full rounded border-2 border-purple-300 px-3 py-2 text-sm font-medium text-purple-900 focus:border-purple-500 focus:outline-none"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERN">Internship</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="OFF_CAMPUS">Off Campus Drive</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-purple-900">
                  Category
                </label>
                <select 
                  name="category"
                  required
                  defaultValue={job.category || "SOFTWARE_ENGINEERING"}
                  className="w-full rounded border-2 border-purple-300 px-3 py-2 text-sm font-medium text-purple-900 focus:border-purple-500 focus:outline-none"
                >
                  <option value="SOFTWARE_ENGINEERING">Software Engineering</option>
                  <option value="DATA_SCIENCE">Data Science</option>
                  <option value="AI_ML">AI/ML</option>
                  <option value="CYBERSECURITY">Cybersecurity</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="OFF_CAMPUS_DRIVE">Off Campus Drive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-purple-900">
                Years of Experience Required
              </label>
              <select 
                name="experienceLevel"
                required
                defaultValue={job.experienceLevel || "ENTRY"}
                className="w-full rounded border-2 border-purple-300 px-3 py-2 text-sm font-medium text-purple-900 focus:border-purple-500 focus:outline-none"
              >
                <option value="ENTRY">Entry Level (0-2 years)</option>
                <option value="MID">Mid Level (2-5 years)</option>
                <option value="SENIOR">Senior Level (5+ years)</option>
              </select>
              <p className="mt-1 text-xs text-purple-700">Required experience for this position</p>
            </div>
          </div>

          {/* Course Type Section */}
          <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
            <label className="mb-2 block text-sm font-semibold text-orange-900">
              🎓 Course Type (For)
            </label>
            <select 
              name="courseType"
              required
              defaultValue={job.courseType || "BTECH"}
              className="w-full rounded border-2 border-orange-300 px-3 py-2 text-sm font-medium text-orange-900 focus:border-orange-500 focus:outline-none"
            >
              <option value="BTECH">B.Tech / BTech</option>
              <option value="MTECH">M.Tech / M. Tech</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
              <option value="BE">BE</option>
              <option value="BCA">BCA</option>
              <option value="BSC">B.Sc / BSC</option>
              <option value="OTHER">Other</option>
            </select>
            <p className="mt-1 text-xs text-orange-700">Which course/degree is this position open for?</p>
          </div>

          {/* Full Announcement Section */}
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
            <label className="mb-2 block text-sm font-semibold text-blue-900">
              📝 Full Job Announcement & Details
            </label>
            <Textarea
              name="description"
              placeholder="Paste your complete job announcement here..."
              defaultValue={job.description}
              className="min-h-64 w-full"
              required
            />
            <p className="mt-2 text-xs text-blue-700">
              Include job title, description, eligibility, and all relevant details
            </p>
          </div>

          {/* Apply Link Section */}
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
            <label className="mb-2 block text-sm font-semibold text-green-900">
              🔗 Apply Link / Registration URL
            </label>
            <Input
              name="applyLink"
              placeholder="https://example.com/apply"
              type="url"
              defaultValue={job.applyLink}
              required
              className="border-2 border-green-300"
            />
            <p className="mt-2 text-xs text-green-700">
              Direct link where users can apply or register
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <AnimatedButton className="flex-1 bg-blue-600 py-3 text-lg font-semibold hover:bg-blue-700" loading={submitting}>
              ✅ Update Opportunity
            </AnimatedButton>
            <Link href="/admin" className="flex-1">
              <Button variant="outline" className="w-full">
                ❌ Cancel
              </Button>
            </Link>
          </div>
          {message && (
            <p
              className={`text-center text-sm font-medium ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
