"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/lib/loading-context";

export function SubscriptionForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [subscribed, setSubscribed] = useState(false);

  // Auto-dismiss success message after 2 seconds
  useEffect(() => {
    if (message && messageType === "success") {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, messageType]);

  async function handleSubscribe() {
    setLoading(true);
    startLoading();
    setMessage(null);

    // Check if user is logged in
    if (status === "unauthenticated") {
      setLoading(false);
      stopLoading();
      // Redirect to login page (fixed from /auth/signin to /auth/login)
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        setMessageType("success");
        setMessage("👉 Thanks for subscribing!");
        setSubscribed(true);
      } else {
        setMessageType("error");
        const data = await res.json();
        setMessage(data.error || "❌ Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("❌ Error subscribing. Please try again.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  }

  const isLoading = status === "loading" || loading;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          📬 Never miss an opportunity! Get job alerts directly in your inbox as soon as new positions are posted. Be the first to apply and land your dream role.
        </p>
      </div>
      
      <Button 
        onClick={handleSubscribe}
        disabled={isLoading || subscribed}
        className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
          subscribed 
            ? "bg-green-600 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-700" 
            : ""
        }`}
      >
        {isLoading ? "Processing..." : subscribed ? "👉 Subscribed" : "👉 Subscribe to get job alerts"}
      </Button>

      {message && (
        <p className={`text-sm text-center animate-in fade-in duration-300 ${messageType === "success" ? "text-green-600 dark:text-green-400 font-semibold" : "text-red-600 dark:text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
