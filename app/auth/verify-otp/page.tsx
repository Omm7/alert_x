import { VerifySignupOtpForm } from "@/components/forms/verify-signup-otp-form";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyOtpPage({ searchParams }: Props) {
  const params = await searchParams;
  const email = params.email || "";

  return (
    <div className="min-h-screen flex items-center justify-center mx-auto max-w-md px-4 py-8 sm:py-16">
      <VerifySignupOtpForm email={email} />
    </div>
  );
}
