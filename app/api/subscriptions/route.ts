import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { subscriptionSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requireAuth();
  if (auth.response || !auth.session?.user?.id) {
    return auth.response!;
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: auth.session.user.id },
    orderBy: { location: "asc" },
  });

  return NextResponse.json(subscriptions);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.response || !auth.session?.user?.id) {
    return auth.response!;
  }

  const body = await request.json();
  const parsed = subscriptionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const subscription = await prisma.subscription.upsert({
    where: {
      userId_jobCategory_location_jobType: {
        userId: auth.session.user.id,
        jobCategory: parsed.data.jobCategory,
        location: parsed.data.location,
        jobType: parsed.data.jobType,
      },
    },
    update: parsed.data,
    create: {
      ...parsed.data,
      userId: auth.session.user.id,
    },
  });

  return NextResponse.json(subscription, { status: 201 });
}
