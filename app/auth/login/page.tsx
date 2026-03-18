import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 px-2">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200 justify-center">
            <Image 
              src="/qyvex short logo.png" 
              alt="QYVEX Logo" 
              width={40} 
              height={40} 
              priority 
              className="object-contain"
            />
            <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">QYVEX</span>
          </Link>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">Find Your Dream Tech Role</p>
        </div>

        {/* Card */}
        <Card className="space-y-0 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl shadow-2xl">
        {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-slate-800 px-4 sm:px-6 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">Sign in to your account to continue</p>
          </div>

          {/* Card Body */}
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <LoginForm />
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-4 sm:mt-6">
          Protected by industry-standard security
        </p>
      </div>
    </div>
  );
}
