"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/lib/loading-context";

export function SubscriptionForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    startLoading();
    setMessage(null);

    // Check if user is logged in
    if (status === "unauthenticated") {
      setLoading(false);
      stopLoading();
      // Redirect to login page
      router.push("/auth/signin");
      return;
    }

    const payload = {
      jobCategory: formData.get("jobCategory"),
      location: formData.get("location"),
      jobType: formData.get("jobType"),
    };

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessageType("success");
        setMessage("✅ Subscription saved! You'll receive job alerts for your preferences.");
      } else {
        setMessageType("error");
        setMessage("❌ Failed to save subscription. Please try again.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("❌ Error saving subscription. Please try again.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  }

  const isLoading = status === "loading" || loading;

  return (
    <form action={onSubmit} className="space-y-3">
      <Select name="jobCategory" required disabled={isLoading}>
        <option value="SOFTWARE_ENGINEERING">Software Engineering</option>
        <option value="DATA_SCIENCE">Data Science</option>
        <option value="AI_ML">AI / ML</option>
        <option value="CYBERSECURITY">Cybersecurity</option>
        <option value="INTERNSHIP">Internships</option>
        <option value="OFF_CAMPUS_DRIVE">Off Campus Drives</option>
      </Select>
      <Input 
        name="location" 
        placeholder="Preferred location or Remote" 
        required 
        disabled={isLoading}
      />
      <Select name="jobType" required disabled={isLoading}>
        <option value="FULL_TIME">Full Time</option>
        <option value="INTERN">Internship</option>
        <option value="OFF_CAMPUS">Off Campus</option>
        <option value="CONTRACT">Contract</option>
      </Select>
      <Button disabled={isLoading} className="w-full">
        {isLoading ? "Processing..." : status === "unauthenticated" ? "Login to Subscribe" : "Subscribe to Alerts"}
      </Button>
      {message && (
        <p className={`text-sm ${messageType === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
