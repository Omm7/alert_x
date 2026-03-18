require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { Resend } = require('resend');
const { getCompanyLogoFromBrandfetch } = require('./brandfetch-utils');

const prisma = new PrismaClient();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "Qyvex <alerts@qyvex.tech>";
const FALLBACK_FROM = "Qyvex <onboarding@resend.dev>";
const APP_URL = process.env.APP_URL || "https://qyvex.tech";

// Email sending function
async function sendJobAlertEmail(emailPayload) {
  if (!resend) {
    console.log(`   ⚠️  RESEND_API_KEY not set - skipping email to ${emailPayload.to}`);
    return false;
  }

  try {
    const response = await resend.emails.send({
      from: DEFAULT_FROM,
      to: emailPayload.to,
      subject: emailPayload.subject,
      html: emailPayload.html,
    });

    if (response.error) {
      // Try fallback email address
      const fallbackResponse = await resend.emails.send({
        from: FALLBACK_FROM,
        to: emailPayload.to,
        subject: emailPayload.subject,
        html: emailPayload.html,
      });

      if (fallbackResponse.error) {
        console.log(`   ❌ Failed to send email to ${emailPayload.to}:`, fallbackResponse.error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.log(`   ⚠️  Error sending email to ${emailPayload.to}:`, error.message);
    return false;
  }
}

// Job data - copy from lib/jobs-to-add.ts
const NEW_JOBS = [
  {
    title: "Operations Associate (Merchant KYC)",
    companyName: "PhonePe",
    location: "Bangalore",
    salary: "Not Disclosed",
    jobType: "FULL_TIME",
    category: "OFF_CAMPUS_DRIVE",
    courseType: "BTECH",
    experienceLevel: "ENTRY",
    description: "Join PhonePe as an Operations Associate to handle merchant KYC verification, ensure compliance, detect fraud patterns, and maintain high accuracy in verification processes.",
    requirements: "Attention to Detail, Document Verification, Compliance, Accuracy, English Reading, Regional Language, Any Graduate",
    responsibilities: "Validate KYC documents, Ensure compliance, Detect fraud patterns, Maintain verification accuracy",
    benefits: "Opportunity in FinTech industry, Hands-on operational experience, Career growth, Learning opportunities, Rotational shifts exposure",
    applyLink: "https://job-boards.greenhouse.io/embed/job_app?for=phonepe&gh_src=961e65dc3us&token=7659792003"
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

      // Step 3: Find ALL subscribers (not filtered by preferences)
      const allSubscribers = await prisma.subscription.findMany({
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
        `   📧 Found ${allSubscribers.length} total subscribers\n`
      );

      // Step 4: Send email alerts to ALL subscribers
      if (allSubscribers.length > 0) {
        console.log(`   🔔 Sending job alert emails to:`);
        let emailsSent = 0;
        let emailsFailed = 0;

        for (const subscription of allSubscribers) {
          const jobUrl = `${APP_URL}/jobs/${job.id}`;
          const unsubscribeLink = `${APP_URL}/api/unsubscribe?id=${subscription.id}`;

          const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white;">
                <h2 style="margin: 0;">🎯 New Job Alert!</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">A new job opportunity just posted</p>
              </div>

              <!-- Content -->
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                
                <p style="font-size: 16px; margin-bottom: 25px;">
                  Hi <strong>${subscription.user.name}</strong>,<br><br>
                  We found a job opportunity that might interest you!
                </p>

                <!-- Job Details Card -->
                <div style="background: white; padding: 20px; border-left: 4px solid #2563EB; margin-bottom: 25px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px;">${job.title}</h3>
                  
                  <div style="margin-bottom: 20px;">
                    <p style="margin: 8px 0; color: #6b7280;"><strong>Company:</strong> ${jobData.companyName}</p>
                    <p style="margin: 8px 0; color: #6b7280;"><strong>Location:</strong> ${jobData.location}</p>
                    <p style="margin: 8px 0; color: #6b7280;"><strong>Salary:</strong> ${jobData.salary}</p>
                    <p style="margin: 8px 0; color: #6b7280;"><strong>Job Type:</strong> ${jobData.jobType}</p>
                  </div>

                  <div style="background: #f3f4f6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #4b5563; line-height: 1.6; font-size: 14px;">
                      ${jobData.description.substring(0, 200)}...
                    </p>
                  </div>
                </div>

                <!-- CTA Buttons -->
                <div style="text-align: center; margin-bottom: 25px;">
                  <a href="${jobData.applyLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px; margin-bottom: 10px;">
                    ✅ Apply Now
                  </a>
                  <a href="${jobUrl}" style="display: inline-block; padding: 14px 32px; background: #e5e7eb; color: #374151; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    📖 View Details
                  </a>
                </div>

                <!-- Unsubscribe Link -->
                <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <a href="${unsubscribeLink}" style="color: #2563EB; text-decoration: none;">Unsubscribe from job alerts</a>
                </p>

                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 15px 0 0 0;">
                  © 2026 Qyvex. All rights reserved.
                </p>

              </div>

            </div>
          `;

          const emailSent = await sendJobAlertEmail({
            to: subscription.user.email,
            subject: `🎯 New Job Alert: ${job.title} at ${jobData.companyName}`,
            html: emailHtml,
          });

          if (emailSent) {
            console.log(`      ✅ Email sent to ${subscription.user.email}`);
            emailsSent++;
          } else {
            console.log(`      ❌ Failed to send email to ${subscription.user.email}`);
            emailsFailed++;
          }
        }
        console.log(`   📊 Email results: ${emailsSent} sent, ${emailsFailed} failed\n`);
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
