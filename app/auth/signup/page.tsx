import { Card } from "@/components/ui/card";
import { SignupForm } from "@/components/forms/signup-form";

export default async function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center mx-auto max-w-md px-4 py-8 sm:py-16">
      <Card className="space-y-5 border-blue-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900/70">
        <div>
          <p className="text-sm uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">Join Qyvex</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Create your student account</h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            Verify your email with OTP and start getting curated tech opportunities.
          </p>
        </div>
        <SignupForm />
      </Card>
    </div>
  );
}
