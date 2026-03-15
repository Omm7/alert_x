"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/lib/loading-context";

export function SubscriptionForm() {
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    startLoading();
    setMessage(null);

    const payload = {
      jobCategory: formData.get("jobCategory"),
      location: formData.get("location"),
      jobType: formData.get("jobType"),
    };

    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    stopLoading();
    setMessage(res.ok ? "Subscription saved." : "Please login and try again.");
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <Select name="jobCategory" required>
        <option value="SOFTWARE_ENGINEERING">Software Engineering</option>
        <option value="DATA_SCIENCE">Data Science</option>
        <option value="AI_ML">AI / ML</option>
        <option value="CYBERSECURITY">Cybersecurity</option>
        <option value="INTERNSHIP">Internships</option>
        <option value="OFF_CAMPUS_DRIVE">Off Campus Drives</option>
      </Select>
      <Input name="location" placeholder="Preferred location or Remote" required />
      <Select name="jobType" required>
        <option value="FULL_TIME">Full Time</option>
        <option value="INTERN">Internship</option>
        <option value="OFF_CAMPUS">Off Campus</option>
        <option value="CONTRACT">Contract</option>
      </Select>
      <Button disabled={loading} className="w-full">
        {loading ? "Saving..." : "Subscribe to Alerts"}
      </Button>
      {message && <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>}
    </form>
  );
}
