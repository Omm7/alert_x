"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/lib/loading-context";

export function LoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Client-side redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/jobs");
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
    <form action={handleSubmit} className="space-y-4 sm:space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="h-10 sm:h-11 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-cyan-500 focus:border-cyan-500 text-xs sm:text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-100 text-xs sm:text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1"
          >
            {showPassword ? (
              <EyeOff className="size-4 sm:size-5" />
            ) : (
              <Eye className="size-4 sm:size-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatedButton className="w-full min-h-10 sm:min-h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-xs sm:text-sm" loading={loading}>
        Sign In
      </AnimatedButton>

      {error && (
        <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-semibold">{error}</p>
        </div>
      )}

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4 sm:pt-5 space-y-3 sm:space-y-4">
        <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
        <p className="text-center text-xs sm:text-sm">
          <Link href="/auth/forgot-password" className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold">
            Forgot password?
          </Link>
        </p>
      </div>
    </form>
  );
}
