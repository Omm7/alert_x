"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Select } from "@/components/ui/select";
import { BRANCH_OPTIONS, INDIAN_COLLEGES, YEAR_OPTIONS } from "@/lib/college-options";
import { useLoading } from "@/lib/loading-context";

export function SignupForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Client-side redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } else if (status !== "loading") {
      setIsCheckingSession(false);
    }
  }, [session, status, router]);

  if (isCheckingSession) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  async function onSubmit(formData: FormData) {
    setLoading(true);
    startLoading();
    setError(null);
    setSuccess(null);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      collegeName: String(formData.get("college") || ""),
      graduationYear: String(formData.get("year") || "2025"),
      branch: String(formData.get("branch") || ""),
      password: String(formData.get("password") || ""),
    };

    const confirmPassword = String(formData.get("confirmPassword") || "");
    if (payload.password !== confirmPassword) {
      setLoading(false);
      stopLoading();
      setError("Password and confirm password must match.");
      return;
    }

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setLoading(false);
      stopLoading();
      setError(data?.error || "Unable to send verification code.");
      return;
    }

    setLoading(false);
    setSuccess("Verification code sent to your email.");
    sessionStorage.setItem("qyvex_pending_signup", JSON.stringify(payload));
    
    setTimeout(() => {
      stopLoading();
      router.push(`/auth/verify-otp?email=${encodeURIComponent(payload.email)}`);
    }, 500);
  }

  return (
    <form action={onSubmit} className="space-y-3 sm:space-y-4">
      <Input name="name" type="text" placeholder="Full Name" required className="h-10 sm:h-11 text-xs sm:text-sm" />
      <Input name="email" type="email" placeholder="Email" required className="h-10 sm:h-11 text-xs sm:text-sm" />
      <Select name="college" required defaultValue="" className="h-10 sm:h-11 text-xs sm:text-sm">
        <option value="" disabled>
          Select College Name
        </option>
        {INDIAN_COLLEGES.map((college) => (
          <option key={college} value={college}>
            {college}
          </option>
        ))}
      </Select>
      <Select name="year" required defaultValue="" className="h-10 sm:h-11 text-xs sm:text-sm">
        <option value="" disabled>
          Select Passing Year
        </option>
        {YEAR_OPTIONS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
      <Select name="branch" required defaultValue="" className="h-10 sm:h-11 text-xs sm:text-sm">
        <option value="" disabled>
          Select Branch
        </option>
        {BRANCH_OPTIONS.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </Select>
      <Input name="password" type="password" placeholder="Password" required minLength={8} className="h-10 sm:h-11 text-xs sm:text-sm" />
      <Input name="confirmPassword" type="password" placeholder="Confirm Password" required minLength={8} className="h-10 sm:h-11 text-xs sm:text-sm" />
      <AnimatedButton className="w-full min-h-10 sm:min-h-11 text-xs sm:text-sm" loading={loading}>
        Create Account
      </AnimatedButton>
      {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
      {success && <p className="text-xs sm:text-sm text-emerald-600">{success}</p>}
    </form>
  );
}
