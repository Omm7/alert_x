/**
 * Job Posting Script
 * 
 * This script:
 * 1. Reads jobs from lib/jobs-to-add.ts
 * 2. Creates jobs in the database
 * 3. Sends email alerts to matching subscribers
 * 
 * Run: npx ts-node scripts/add-jobs.ts
 */

import { prisma } from "@/lib/db";
import { sendEmailAlert } from "@/lib/email";
import { NEW_JOBS } from "@/lib/jobs-to-add";

async function addJobsWithAlerts() {
  console.log("🚀 Starting job posting process...\n");

  let successCount = 0;
  let failureCount = 0;

  for (const jobData of NEW_JOBS) {
    try {
      console.log(`📝 Processing: ${jobData.title} at ${jobData.companyName}`);

      // Step 1: Get or create company
      const company = await prisma.company.upsert({
        where: { name: jobData.companyName },
        update: {},
        create: {
          name: jobData.companyName,
          website: "https://qyvex.com",
          logoUrl: "https://via.placeholder.com/150?text=" + jobData.companyName.split(" ")[0],
        },
      });

      // Step 2: Create job
      const job = await prisma.job.create({
        data: {
          title: jobData.title,
          companyId: company.id,
          location: jobData.location,
          salary: jobData.salary,
          jobType: jobData.jobType as any,
          category: jobData.category as any,
          courseType: jobData.courseType as any,
          experienceLevel: jobData.experienceLevel as any,
          description: jobData.description,
          requirements: jobData.requirements,
          responsibilities: jobData.responsibilities,
          benefits: jobData.benefits,
          applyLink: jobData.applyLink,
        },
      });

      console.log(`   ✅ Job created with ID: ${job.id}`);

      // Step 3: Find matching subscribers
      const subscribers = await prisma.subscription.findMany({
        where: {
          jobCategory: jobData.category,
          location: jobData.location,
          jobType: jobData.jobType,
        },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      console.log(
        `   📧 Found ${subscribers.length} matching subscribers\n`
      );

      // Step 4: Send emails to all subscribers
      if (subscribers.length > 0) {
        const jobUrl = `https://qyvex.com/jobs/${job.id}`;

        for (const subscription of subscribers) {
          try {
            const emailSent = await sendEmailAlert({
              to: subscription.user.email,
              userName: subscription.user.name,
              jobTitle: job.title,
              company: jobData.companyName,
              location: jobData.location,
              salary: jobData.salary,
              jobType: jobData.jobType,
              description: jobData.description,
              applyLink: jobData.applyLink,
              jobUrl,
            });

            if (emailSent) {
              console.log(`      📬 Email sent to ${subscription.user.email}`);
            }
          } catch (emailError) {
            console.error(
              `      ❌ Failed to send email to ${subscription.user.email}:`,
              emailError
            );
          }
        }
      }

      successCount++;
      console.log(`✅ Completed: ${jobData.title}\n`);
    } catch (error) {
      failureCount++;
      console.error(
        `❌ Error processing ${jobData.title}:`,
        error instanceof Error ? error.message : error
      );
      console.log("");
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Successfully posted: ${successCount} jobs`);
  console.log(`❌ Failed: ${failureCount} jobs`);
  console.log("=".repeat(50) + "\n");

  await prisma.$disconnect();
}

// Run the function
addJobsWithAlerts().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
