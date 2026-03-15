import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Qyvex - CS Student Job Portal",
  description: "Learn about Qyvex, a modern job portal helping computer science students discover verified opportunities in software engineering, AI, data science, and more.",
  keywords: [
    "about us",
    "about Qyvex",
    "job portal for students",
    "tech career platform",
    "student opportunities",
    "verified jobs",
  ],
  openGraph: {
    title: "About Qyvex",
    description: "Discover how Qyvex connects CS students with top tech opportunities.",
    url: "https://qyvex.tech/about",
    siteName: "Qyvex",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
      <h1 className="text-3xl font-bold">About Qyvex</h1>
      <p className="text-slate-600 dark:text-slate-300">
        Qyvex helps computer science students discover verified opportunities in software engineering, AI, data science, and more.
      </p>
    </div>
  );
}
