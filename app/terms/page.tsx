import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Qyvex",
  description: "Read Qyvex's terms of service. Understand the rules and conditions for using our platform.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "legal terms",
  ],
  openGraph: {
    title: "Terms of Service - Qyvex",
    description: "Our terms of service for using Qyvex.",
    url: "https://qyvex.tech/terms",
    siteName: "Qyvex",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
      <h1 className="text-3xl font-bold">Terms</h1>
      <p className="text-slate-600 dark:text-slate-300">Use Qyvex responsibly. Jobs are provided by third-party companies and links.</p>
    </div>
  );
}
