import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { SubscriptionForm } from "@/components/forms/subscription-form";

export const dynamic = "force-dynamic";

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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Saved Jobs</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {savedJobs.slice(0, 5).map((item) => (
              <li key={item.id}>
                {item.job.title} at {item.job.company.name}
              </li>
            ))}
            {!savedJobs.length && <li>No saved jobs yet.</li>}
          </ul>
        </Card>

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

        <Card className="space-y-2">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Email Preferences</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300">Current subscriptions: {subscriptions.length}</p>
          <SubscriptionForm />
        </Card>
      </div>
    </div>
  );
}
