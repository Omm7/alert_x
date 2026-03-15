import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jobSchema } from "@/lib/validators";
import { getJobs } from "@/lib/query";
import { requireAdmin } from "@/lib/auth-utils";
import { sendJobAlerts } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const jobs = await getJobs({
    search: searchParams.get("search") || undefined,
    location: searchParams.get("location") || undefined,
    jobType: searchParams.get("jobType") || undefined,
    experience: searchParams.get("experience") || undefined,
    category: searchParams.get("category") || undefined,
    sort: (searchParams.get("sort") as "latest" | "highest_salary" | "relevant") || "latest",
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 9),
  });

  return NextResponse.json(jobs, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(`create-job:${ip}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const admin = await requireAdmin();
  if (admin.response) {
    return admin.response;
  }

  const body = await request.json();
  const parsed = jobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const company = await prisma.company.upsert({
    where: { name: parsed.data.companyName },
    update: {
      logoUrl: parsed.data.companyLogoUrl,
      website: parsed.data.companyWebsite,
    },
    create: {
      name: parsed.data.companyName,
      logoUrl: parsed.data.companyLogoUrl,
      website: parsed.data.companyWebsite,
    },
  });

  const job = await prisma.job.create({
    data: {
      title: parsed.data.title,
      companyId: company.id,
      location: parsed.data.location,
      salary: parsed.data.salary,
      jobType: parsed.data.jobType,
      category: parsed.data.category,
      experienceLevel: parsed.data.experienceLevel,
      description: parsed.data.description,
      requirements: parsed.data.requirements,
      responsibilities: parsed.data.responsibilities,
      benefits: parsed.data.benefits,
      applyLink: parsed.data.applyLink,
    },
    include: { company: true },
  });

  await sendJobAlerts(job);

  return NextResponse.json(job, { status: 201 });
}
