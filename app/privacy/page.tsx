import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Qyvex",
  description: "Read Qyvex's privacy policy. Learn how we protect your data and handle your personal information.",
  keywords: [
    "privacy policy",
    "data protection",
    "privacy statement",
  ],
  openGraph: {
    title: "Privacy Policy - Qyvex",
    description: "Our commitment to protecting your privacy.",
    url: "https://qyvex.tech/privacy",
    siteName: "Qyvex",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-slate-600 dark:text-slate-300">We store only essential account and preference data needed to deliver job alerts.</p>
    </div>
  );
}
