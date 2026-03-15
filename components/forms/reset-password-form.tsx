"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/lib/loading-context";

export function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    startLoading();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/forgot-password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        password,
        confirmPassword,
      }),
    });

    setLoading(false);
    stopLoading();

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Unable to reset password");
      return;
    }

    router.push("/auth/login?reset=1");
  }

  return (
    <div className="space-y-4">
      <Input value={email} disabled />
      <Input
        placeholder="Enter 6-digit reset code"
        value={otp}
        maxLength={6}
        onChange={(event) => setOtp(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
      />
      <Input type="password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} />
      <Input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
      <Button onClick={onSubmit} disabled={loading || otp.length !== 6 || !password || !confirmPassword} className="w-full">
        Reset Password
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
