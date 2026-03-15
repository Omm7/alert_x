import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { companySchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth-utils";

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { jobs: true } } },
  });
  return NextResponse.json(companies);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin.response) {
    return admin.response;
  }

  const body = await request.json();
  const parsed = companySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await prisma.company.create({ data: parsed.data });
  return NextResponse.json(created, { status: 201 });
}
