import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { SavedJobsList } from "@/components/dashboard/saved-jobs-list";
import { SubscriptionForm } from "@/components/forms/subscription-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard - Qyvex | Manage Your Preferences",
  description: "Access your Qyvex dashboard to manage job preferences, subscriptions, and saved jobs.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [savedJobs, appliedJobs, subscriptions] = await Promise.all([
    prisma.savedJob.findMany({
      where: { userId: session.user.id },
      include: { job: { include: { company: true } } },
      orderBy: { id: "desc" },
    }),
    prisma.application.findMany({
      where: { userId: session.user.id },
      include: { job: { include: { company: true } } },
      orderBy: { appliedAt: "desc" },
    }),
    prisma.subscription.findMany({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 sm:px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome, {session.user.name}</h1>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Saved Jobs - Full Width */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">💾 Saved Jobs</h2>
            <SavedJobsList savedJobs={savedJobs} />
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Applied Jobs */}
          <Card>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Applied Jobs</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {appliedJobs.slice(0, 5).map((item) => (
                <li key={item.id}>
                  {item.job.title} at {item.job.company.name}
                </li>
              ))}
              {!appliedJobs.length && <li>No applications tracked yet.</li>}
            </ul>
          </Card>

          {/* Email Preferences */}
          <Card className="space-y-2">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Email Preferences</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300">Current subscriptions: {subscriptions.length}</p>
            <SubscriptionForm />
          </Card>
        </div>
      </div>
    </div>
  );
}
