"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useLoading } from "@/lib/loading-context";

export function AdminJobForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
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

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    stopLoading();
    
    if (res.ok) {
      setMessage("✅ Job posted successfully!");
      (document.querySelector('form') as HTMLFormElement)?.reset?.();
      setTimeout(() => onSuccess?.(), 1000);
    } else {
      const error = await res.json().catch(() => ({}));
      setMessage(`❌ Failed to create job: ${error.error || "Unknown error"}`);
    }
  }

  return (
    <form action={onSubmit} className="space-y-5">
      {/* Company Details Section */}
      <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-4 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">🏢 Company Details</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Company Name *
            </label>
            <Input 
              name="companyName" 
              placeholder="e.g., Google, TCS, Microsoft" 
              required 
              className="border-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Company Logo URL *
            </label>
            <Input 
              name="companyLogoUrl" 
              placeholder="https://example.com/logo.png" 
              type="url"
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
              Work Location *
            </label>
            <Input 
              name="location" 
              placeholder="e.g., Bangalore, Hyderabad, Remote" 
              required 
              className="border-2 border-purple-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-purple-900">
              Salary (Annual) *
            </label>
            <Input 
              name="salary" 
              placeholder="e.g., 5-7 LPA, ₹6,00,000, Competitive" 
              required 
              className="border-2 border-purple-300"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-purple-900">
              Job Type *
            </label>
            <select 
              name="jobType"
              required
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
              Category *
            </label>
            <select 
              name="category"
              required
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
            Years of Experience Required *
          </label>
          <select 
            name="experienceLevel"
            required
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
          🎓 Course Type (For) *
        </label>
        <select 
          name="courseType"
          required
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
          📝 Full Job Announcement & Details *
        </label>
        <Textarea
          name="description"
          placeholder={`Paste your complete job announcement here. Include:
- Job Title / Role
- Company Description
- Responsibilities
- Eligibility Criteria
- Skills Required
- Selection Process
- Important Dates/Deadlines
- Any other relevant information

Example:
🚨 **Final Reminder – Google Internship 2026**

Join Google's Summer Internship Program!

🏢 **About Google:**
Google is a leading tech company...

📋 **Job Description:**
We are looking for talented interns in...

🎓 **Eligibility:**
- B.Tech / M.Tech students
- CGPA: 7.0+

📝 **Selection Process:**
1. Online Assessment
2. Technical Round
3. HR Interview

📅 **Important Dates:**
- Registration: March 15 - April 15
- Results: May 1`}
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
          🔗 Apply Link / Registration URL *
        </label>
        <Input
          name="applyLink"
          placeholder="https://example.com/apply or https://nqt.tcs.com/register"
          type="url"
          required
          className="border-2 border-green-300"
        />
        <p className="mt-2 text-xs text-green-700">
          Direct link where users can apply or register for this opportunity
        </p>
      </div>

      {/* Submit Button */}
      <AnimatedButton className="w-full bg-blue-600 py-3 text-lg font-semibold hover:bg-blue-700" loading={loading}>
        📤 Post Opportunity
      </AnimatedButton>
      
      {message && (
        <p className={`text-center text-sm font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
