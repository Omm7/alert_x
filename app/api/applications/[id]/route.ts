import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth.response || !auth.session?.user?.id) {
    return auth.response!;
  }

  const { id } = await params;

  await prisma.application.deleteMany({
    where: {
      id,
      userId: auth.session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}
