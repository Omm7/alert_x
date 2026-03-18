import { Metadata } from "next";
import { prisma } from "@/lib/db";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hiring Companies - Qyvex | Top Tech Companies Recruiting",
  description: "Explore top tech companies actively hiring on Qyvex. Discover companies recruiting for software engineers, data scientists, and internship positions.",
  keywords: [
    "hiring companies",
    "tech companies hiring",
    "companies recruiting",
    "software companies",
    "tech recruiters",
    "company profiles",
    "employer directory",
    "job openings by company",
    "top tech companies",
    "startup jobs",
  ],
  openGraph: {
    title: "Hiring Companies - Qyvex",
    description: "Discover all companies actively hiring on Qyvex. Connect with top tech employers.",
    url: "https://qyvex.tech/companies",
    siteName: "Qyvex",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hiring Companies - Qyvex",
    description: "Browse companies and their open positions on Qyvex.",
  },
};

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: { _count: { select: { jobs: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Companies Hiring</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <Image 
                src={company.logoUrl} 
                alt={company.name} 
                className="h-12 w-12 rounded-lg" 
                width={48} 
                height={48} 
                loading="lazy"
                unoptimized
              />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{company.name}</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">{company._count.jobs} open roles</p>
              </div>
            </div>
            <a href={company.website} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Visit website
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
