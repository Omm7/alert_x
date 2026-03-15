import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Qyvex - Get in Touch",
  description: "Have questions? Contact the Qyvex team. We're here to help with any inquiries about job postings, subscriptions, or feedback.",
  keywords: [
    "contact us",
    "contact Qyvex",
    "support",
    "feedback",
    "get in touch",
  ],
  openGraph: {
    title: "Contact Qyvex",
    description: "Reach out to the Qyvex team. We'd love to hear from you.",
    url: "https://qyvex.tech/contact",
    siteName: "Qyvex",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="text-slate-600 dark:text-slate-300">Email us at hello@qyvex.tech</p>
    </div>
  );
}
