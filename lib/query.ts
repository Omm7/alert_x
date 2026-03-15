import { ExperienceLevel, JobCategory, JobType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type JobFilters = {
  search?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  category?: string;
  sort?: "latest" | "highest_salary" | "relevant";
  page?: number;
  limit?: number;
};

function parseJobType(value?: string): JobType | undefined {
  if (!value) {
    return undefined;
  }
  return Object.values(JobType).includes(value as JobType) ? (value as JobType) : undefined;
}

function parseExperience(value?: string): ExperienceLevel | undefined {
  if (!value) {
    return undefined;
  }
  return Object.values(ExperienceLevel).includes(value as ExperienceLevel)
    ? (value as ExperienceLevel)
    : undefined;
}

function parseCategory(value?: string): JobCategory | undefined {
  if (!value) {
    return undefined;
  }
  return Object.values(JobCategory).includes(value as JobCategory)
    ? (value as JobCategory)
    : undefined;
}

export async function getJobs(filters: JobFilters) {
  const page = Number(filters.page ?? 1);
  const limit = Number(filters.limit ?? 9);
  const skip = (page - 1) * limit;

  const where: Prisma.JobWhereInput = {
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
            { company: { name: { contains: filters.search, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(filters.location ? { location: { contains: filters.location, mode: "insensitive" } } : {}),
    ...(parseJobType(filters.jobType) ? { jobType: parseJobType(filters.jobType) } : {}),
    ...(parseExperience(filters.experience)
      ? { experienceLevel: parseExperience(filters.experience) }
      : {}),
    ...(parseCategory(filters.category) ? { category: parseCategory(filters.category) } : {}),
  };

  const orderBy: Prisma.JobOrderByWithRelationInput =
    filters.sort === "highest_salary"
      ? { salary: "desc" }
      : filters.sort === "relevant"
        ? { createdAt: "desc" }
        : { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: { company: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
