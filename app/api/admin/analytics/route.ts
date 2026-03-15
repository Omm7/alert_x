import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.response) {
    return admin.response;
  }

  const [totalUsers, totalJobs, totalSubscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.subscription.count(),
  ]);

  return NextResponse.json({
    totalUsers,
    totalJobs,
    totalSubscriptions,
  });
}
