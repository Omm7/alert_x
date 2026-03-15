import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { companySchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth-utils";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (admin.response) {
    return admin.response;
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = companySchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.company.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (admin.response) {
    return admin.response;
  }

  const { id } = await params;
  await prisma.company.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
