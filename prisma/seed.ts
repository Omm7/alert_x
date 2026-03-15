import bcrypt from "bcryptjs";
import { PrismaClient, Role, JobCategory, JobType, ExperienceLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@qyvex.tech" },
    update: {},
    create: {
      name: "Qyvex Admin",
      email: "admin@qyvex.tech",
      password: adminPassword,
      collegeName: "GITA Autonomous College",
      graduationYear: 2025,
      branch: "Computer Science",
      role: Role.ADMIN,
    },
  });

  const companies = await Promise.all([
    prisma.company.upsert({
      where: { name: "Vercel" },
      update: {},
      create: {
        name: "Vercel",
        logoUrl: "https://logo.clearbit.com/vercel.com",
        website: "https://vercel.com",
      },
    }),
    prisma.company.upsert({
      where: { name: "Stripe" },
      update: {},
      create: {
        name: "Stripe",
        logoUrl: "https://logo.clearbit.com/stripe.com",
        website: "https://stripe.com",
      },
    }),
  ]);

  const [vercel, stripe] = companies;

  await prisma.job.createMany({
    data: [
      {
        title: "Frontend Engineer Intern",
        companyId: vercel.id,
        location: "Remote",
        salary: "INR 45,000/month",
        jobType: JobType.INTERN,
        category: JobCategory.INTERNSHIP,
        experienceLevel: ExperienceLevel.ENTRY,
        description: "Build polished web experiences with Next.js and TypeScript.",
        requirements: "React, TypeScript, Git fundamentals.",
        responsibilities: "Ship UI features and collaborate with design.",
        benefits: "Mentorship, stipend, remote-first culture.",
        applyLink: "https://vercel.com/careers",
      },
      {
        title: "Software Engineer",
        companyId: stripe.id,
        location: "Bengaluru",
        salary: "INR 20-30 LPA",
        jobType: JobType.FULL_TIME,
        category: JobCategory.SOFTWARE_ENGINEERING,
        experienceLevel: ExperienceLevel.MID,
        description: "Develop backend services that power global payments.",
        requirements: "Node.js, distributed systems, SQL.",
        responsibilities: "Design APIs, improve reliability, review code.",
        benefits: "Stock options, health insurance, hybrid work.",
        applyLink: "https://stripe.com/jobs",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
