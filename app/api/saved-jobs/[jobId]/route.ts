import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const auth = await requireAuth();
  if (auth.response || !auth.session?.user?.id) {
    return auth.response!;
  }

  const { jobId } = await params;

  try {
    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId: auth.session.user.id,
          jobId,
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Job not found in saved list" }, { status: 404 });
  }
}
