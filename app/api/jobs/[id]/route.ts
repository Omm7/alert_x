import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-utils";
import { jobSchema } from "@/lib/validators";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id }, include: { company: true } });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (admin.response) {
    return admin.response;
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = jobSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  let companyId: string | undefined;

  if (data.companyName && data.companyLogoUrl && data.companyWebsite) {
    const company = await prisma.company.upsert({
      where: { name: data.companyName },
      update: {
        logoUrl: data.companyLogoUrl,
        website: data.companyWebsite,
      },
      create: {
        name: data.companyName,
        logoUrl: data.companyLogoUrl,
        website: data.companyWebsite,
      },
    });
    companyId = company.id;
  }

  const updated = await prisma.job.update({
    where: { id },
    data: {
      title: data.title,
      location: data.location,
      salary: data.salary,
      jobType: data.jobType,
      category: data.category,
      experienceLevel: data.experienceLevel,
      description: data.description,
      requirements: data.requirements,
      responsibilities: data.responsibilities,
      benefits: data.benefits,
      applyLink: data.applyLink,
      ...(companyId ? { companyId } : {}),
    },
    include: { company: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (admin.response) {
    return admin.response;
  }

  const { id } = await params;
  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
