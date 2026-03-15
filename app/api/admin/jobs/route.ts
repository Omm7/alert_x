import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [jobs, admin] = await Promise.all([
      prisma.job.findMany({
        include: { company: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, lastLogin: true },
      }),
    ]);

    return NextResponse.json({ jobs, admin });
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
