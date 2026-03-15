"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/lib/loading-context";

type PendingSignup = {
  name: string;
  email: string;
  college: string;
  course: string;
  year: string;
  branch: string;
  password: string;
};

export function VerifySignupOtpForm({ email }: { email: string }) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pendingSignup = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = sessionStorage.getItem("qyvex_pending_signup");
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as PendingSignup;
  }, []);

  async function verifyAndCreateAccount() {
    if (!pendingSignup || !email) {
      setError("Signup session expired. Please sign up again.");
      return;
    }

    setLoading(true);
    startLoading();
    setError(null);

    const verifyResponse = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!verifyResponse.ok) {
      setLoading(false);
      stopLoading();
      setError("Invalid or expired OTP.");
      return;
    }

    const verifyData = (await verifyResponse.json()) as { verificationToken: string };

    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...pendingSignup,
        verificationToken: verifyData.verificationToken,
      }),
    });

    setLoading(false);
    stopLoading();

    if (!registerResponse.ok) {
      setError("Could not create account. Try again.");
      return;
    }

    sessionStorage.removeItem("qyvex_pending_signup");
    router.push("/auth/login?registered=1");
  }

  return (
    <Card className="space-y-5 border-blue-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900/70">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Verify Your Email</h1>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Enter the 6-digit OTP sent to <span className="font-semibold">{email || "your email"}</span>
        </p>
      </div>

      <Input
        value={otp}
        onChange={(event) => setOtp(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
        maxLength={6}
        placeholder="Enter OTP"
      />

      <Button onClick={verifyAndCreateAccount} disabled={loading || otp.length !== 6} className="w-full">
        Verify OTP
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-xs text-slate-500 dark:text-slate-300">
        Did not receive code? <Link href="/auth/signup" className="text-[var(--qv-primary)]">Go back to signup</Link>
      </p>
    </Card>
  );
}
