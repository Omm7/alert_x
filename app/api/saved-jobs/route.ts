import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

const payloadSchema = z.object({
  jobId: z.string().cuid(),
});

export async function GET() {
  const auth = await requireAuth();
  if (auth.response || !auth.session?.user?.id) {
    return auth.response!;
  }

  const items = await prisma.savedJob.findMany({
    where: { userId: auth.session.user.id },
    include: { job: { include: { company: true } } },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.response || !auth.session?.user?.id) {
    return auth.response!;
  }

  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const saved = await prisma.savedJob.upsert({
    where: {
      userId_jobId: {
        userId: auth.session.user.id,
        jobId: parsed.data.jobId,
      },
    },
    update: {},
    create: {
      userId: auth.session.user.id,
      jobId: parsed.data.jobId,
    },
  });

  return NextResponse.json(saved, { status: 201 });
}
