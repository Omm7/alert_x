import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const jobId = id;

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const jobId = id;

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      title,
      companyName,
      companyLogoUrl,
      companyWebsite,
      location,
      salary,
      jobType,
      category,
      experienceLevel,
      description,
      requirements,
      responsibilities,
      benefits,
      applyLink,
    } = body;

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Find or create company
    let company = await prisma.company.findUnique({
      where: { name: companyName },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: companyName,
          logoUrl: companyLogoUrl,
          website: companyWebsite,
        },
      });
    } else {
      // Update company details if they changed
      company = await prisma.company.update({
        where: { id: company.id },
        data: {
          logoUrl: companyLogoUrl,
          website: companyWebsite,
        },
      });
    }

    // Update job
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        companyId: company.id,
        location,
        salary,
        jobType,
        category,
        experienceLevel,
        description,
        requirements,
        responsibilities,
        benefits,
        applyLink,
      },
      include: { company: true },
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const jobId = id;

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Delete the job
    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
