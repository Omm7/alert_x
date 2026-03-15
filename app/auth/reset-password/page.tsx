import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const email = params.email || "";

  return (
    <div className="min-h-screen flex items-center justify-center mx-auto max-w-md px-4 py-8 sm:py-16">
      <Card className="space-y-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reset Password</h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">Enter the code from your email and set a new password.</p>
        <ResetPasswordForm email={email} />
      </Card>
    </div>
  );
}
