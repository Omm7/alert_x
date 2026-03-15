import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { Providers } from "@/components/providers";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: {
    default: "Qyvex - Tech Jobs, Internships & Off-Campus Drives for CS Students",
    template: "%s | Qyvex - Find Your Dream Tech Role",
  },
  description:
    "Discover tech jobs, internships, and off-campus drives for computer science students. Get real-time job alerts for software engineering, data science, AI/ML, and cybersecurity roles.",
  keywords: [
    "tech jobs",
    "job portal",
    "internships",
    "off-campus drives",
    "software engineer jobs",
    "data science jobs",
    "AI ML jobs",
    "cybersecurity jobs",
    "job alerts",
    "CS student jobs",
    "fresher jobs",
    "graduate jobs",
    "tech careers",
    "job search",
    "job opportunities",
  ],
  authors: [{ name: "Qyvex", url: "https://qyvex.com" }],
  creator: "Qyvex",
  publisher: "Qyvex",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: process.env.APP_URL || "http://localhost:3000",
    languages: {
      "en-US": "https://qyvex.com/en-US",
    },
  },
  openGraph: {
    title: "Qyvex - Tech Jobs, Internships & Off-Campus Drives",
    description:
      "Find the best tech jobs, internships, and off-campus opportunities. Get real-time alerts for software engineering, data science, and AI/ML roles.",
    type: "website",
    locale: "en_US",
    url: process.env.APP_URL || "http://localhost:3000",
    siteName: "Qyvex",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Qyvex - Tech Job Portal",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qyvex - Tech Jobs & Internships",
    description:
      "Find and apply for tech jobs, internships, and off-campus drives. Real-time job alerts for CS students.",
    images: ["/twitter-image.svg"],
    creator: "@QyvexJobs",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Qyvex",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} min-h-screen antialiased`}>
        <Providers>
          <LoadingOverlay />
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
