import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center mx-auto max-w-md px-4 py-8 sm:py-16">
      <Card className="space-y-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Forgot Password</h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">Enter your registered email to receive a reset code.</p>
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}
