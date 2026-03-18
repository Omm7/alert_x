const { PrismaClient } = require('@prisma/client');
const { getCompanyLogoFromBrandfetch } = require('./brandfetch-utils');

const prisma = new PrismaClient();

// Job data - copy from lib/jobs-to-add.ts
const NEW_JOBS = [
  {
    title: "Graduate Trainee",
    companyName: "Calix",
    location: "Bangalore (Hybrid)",
    salary: "Not Disclosed",
    jobType: "FULL_TIME",
    category: "CYBERSECURITY",
    courseType: "BTECH",
    experienceLevel: "ENTRY",
    description: "Join Calix as a Graduate Trainee to work on cybersecurity, threat detection, and network security analysis in a hybrid environment.",
    requirements: "Networking (TCP/IP, OSI), Cybersecurity Basics, Python (Basic), Linux, Windows, Packet Analysis (Wireshark), 2024/2025 Batch (CS/IT/Cyber Security/Networking)",
    responsibilities: "Threat detection, Network security analysis, IDS/NIDS monitoring, Cyber threat research",
    benefits: "Hands-on cybersecurity experience, Industry exposure, Learning opportunities, Career growth",
    applyLink: "https://calix.wd1.myworkdayjobs.com/en-US/ExternalInternational/job/Bangalore/Graduate-Trainee_R-11540"
  },
];

async function addJobsWithAlerts() {
  console.log("🚀 Starting job posting process...\n");

  let successCount = 0;
  let failureCount = 0;

  for (const jobData of NEW_JOBS) {
    try {
      console.log(`📝 Processing: ${jobData.title} at ${jobData.companyName}`);

      // Step 1: Get or create company with Brandfetch logo
      let company = await prisma.company.findFirst({
        where: { name: jobData.companyName },
      });

      if (!company) {
        // Fetch logo from Brandfetch if company doesn't exist
        const logoUrl = await getCompanyLogoFromBrandfetch(jobData.companyName, jobData.website);

        company = await prisma.company.create({
          data: {
            name: jobData.companyName,
            website: jobData.website || "https://qyvex.com",
            logoUrl: logoUrl,
          },
        });

        console.log(`   ✅ Company created: ${company.name}`);
      } else {
        console.log(`   ℹ️  Company already exists: ${company.name}`);
      }

      // Step 2: Create job
      const job = await prisma.job.create({
        data: {
          title: jobData.title,
          companyId: company.id,
          location: jobData.location,
          salary: jobData.salary,
          jobType: jobData.jobType,
          category: jobData.category,
          courseType: jobData.courseType,
          experienceLevel: jobData.experienceLevel,
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

      // Step 4: Log subscriber emails (email sending would require Resend API integration)
      if (subscribers.length > 0) {
        console.log(`   🔔 Email alerts will be sent to:`);
        for (const subscription of subscribers) {
          console.log(`      📬 ${subscription.user.email} (${subscription.user.name})`);
        }
        console.log("");
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
