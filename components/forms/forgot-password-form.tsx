"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/lib/loading-context";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true);
    startLoading();
    setError(null);

    const res = await fetch("/api/auth/forgot-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    stopLoading();

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "Unable to send reset code");
      return;
    }

    router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <Input
        name="email"
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        className="h-10 sm:h-11 text-xs sm:text-sm"
      />
      <Button onClick={onSubmit} disabled={loading || !email} className="w-full min-h-10 sm:min-h-11 text-xs sm:text-sm">
        Send Reset Code
      </Button>
      {error && <p className="text-xs sm:text-sm text-red-500">{error}</p>}
    </div>
  );
}
