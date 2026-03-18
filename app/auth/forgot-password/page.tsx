import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
              QYVEX
            </div>
          </Link>
          <p className="text-slate-400 text-sm mt-2">Find Your Dream Tech Role</p>
        </div>

        {/* Card */}
        <Card className="space-y-0 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl shadow-2xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-slate-800 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Reset Password</h1>
            <p className="text-slate-400 text-sm mt-2">Enter your email to receive a password reset link</p>
          </div>

          {/* Card Body */}
          <div className="px-6 py-8">
            <ForgotPasswordForm />
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          <Link href="/auth/login" className="text-blue-400 hover:text-cyan-400 transition-colors">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
