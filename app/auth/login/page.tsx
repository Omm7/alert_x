import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Login - Qyvex | Sign In to Your Account",
  description: "Sign in to your Qyvex account to access personalized job opportunities and manage your preferences.",
  keywords: ["login", "sign in", "account access"],
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center mx-auto max-w-md px-4 py-8 sm:py-16">
      <Card className="space-y-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Login</h1>
        <LoginForm />
      </Card>
    </div>
  );
}
