import { prisma } from "@/lib/db";

async function clearJobs() {
  try {
    console.log("🗑️  Clearing all jobs and subscriptions...");

    // Delete all subscriptions
    const subsDeleted = await prisma.subscription.deleteMany({});
    console.log(`✅ Deleted ${subsDeleted.count} job subscriptions`);

    // Delete all job applications
    const appsDeleted = await prisma.application.deleteMany({});
    console.log(`✅ Deleted ${appsDeleted.count} job applications`);

    // Delete all saved jobs
    const savedDeleted = await prisma.savedJob.deleteMany({});
    console.log(`✅ Deleted ${savedDeleted.count} saved jobs`);

    // Delete all jobs
    const jobsDeleted = await prisma.job.deleteMany({});
    console.log(`✅ Deleted ${jobsDeleted.count} jobs`);

    // Delete all companies without jobs
    const companiesDeleted = await prisma.company.deleteMany({});
    console.log(`✅ Deleted ${companiesDeleted.count} companies`);

    console.log("\n✨ All jobs and subscriptions cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing jobs:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearJobs();
