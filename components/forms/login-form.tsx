"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useLoading } from "@/lib/loading-context";

export function LoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
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

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    startLoading();
    setError(null);

    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    const loginCheck = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!loginCheck.ok) {
      const payload = (await loginCheck.json().catch(() => null)) as { error?: string } | null;
      setLoading(false);
      stopLoading();
      setError(payload?.error || "Invalid email or password");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      stopLoading();
      setError("Invalid email or password");
      return;
    }

    // Session will update automatically via useSession hook
    // The useEffect above will detect the change and redirect
    stopLoading();
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <Input name="email" type="email" placeholder="Email" required/>
      <Input name="password" type="password" placeholder="Password" required/>
      <AnimatedButton className="w-full min-h-11" loading={loading}>
        Login
      </AnimatedButton>
      {error && <p className="text-sm text-red-500 font-semibold text-center">{error}</p>}
      <p className="text-center text-sm">
        <Link href="/auth/forgot-password" className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}
