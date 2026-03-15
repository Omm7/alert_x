import { JobCategory, JobType } from "@prisma/client";
import { Resend } from "resend";
import { prisma } from "@/lib/db";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "Qyvex <alerts@qyvex.tech>";
const FALLBACK_FROM = "Qyvex <onboarding@resend.dev>";

function toReadable(value: JobCategory | JobType) {
  return value.replaceAll("_", " ");
}

async function sendEmailStrict(payload: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const first = await resend.emails.send({
    from: payload.from || DEFAULT_FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });

  if (!first.error) {
    return first.data?.id || null;
  }

  const errMessage = (first.error as { message?: string })?.message || "Resend email failed";

  // Fallback helps during early setup when custom sender domain isn't verified yet.
  const shouldFallback =
    errMessage.toLowerCase().includes("domain") ||
    errMessage.toLowerCase().includes("sender") ||
    errMessage.toLowerCase().includes("from address");

  if (!shouldFallback) {
    throw new Error(errMessage);
  }

  const second = await resend.emails.send({
    from: FALLBACK_FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });

  if (second.error) {
    const secondMessage = (second.error as { message?: string })?.message || "Resend fallback failed";
    throw new Error(secondMessage);
  }

  return second.data?.id || null;
}

export async function sendJobAlerts(job: {
  id: string;
  title: string;
  location: string;
  applyLink: string;
  jobType: JobType;
  category: JobCategory;
  company: { name: string };
}) {
  const matchingSubscriptions = await prisma.subscription.findMany({
    where: {
      jobCategory: job.category,
      jobType: job.jobType,
      OR: [{ location: job.location }, { location: "Remote" }, { location: "Any" }],
    },
    include: {
      user: true,
    },
  });

  if (!matchingSubscriptions.length) {
    return;
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  await Promise.all(
    matchingSubscriptions.map(async (subscription) => {
      const unsubscribeLink = `${appUrl}/api/unsubscribe?id=${subscription.id}`;

      await sendEmailStrict({
        to: subscription.user.email,
        subject: "New Tech Job Alert",
        html: `
          <h2>A new job matching your preferences is available.</h2>
          <p><strong>Job title:</strong> ${job.title}</p>
          <p><strong>Company:</strong> ${job.company.name}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Job Type:</strong> ${toReadable(job.jobType)}</p>
          <p><strong>Category:</strong> ${toReadable(job.category)}</p>
          <p><a href="${job.applyLink}">Apply link</a></p>
          <p><a href="${unsubscribeLink}">Unsubscribe</a></p>
        `,
      });
    }),
  );
}

export async function sendWelcomeEmail(input: { email: string; name: string }) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";

  await sendEmailStrict({
    to: input.email,
    subject: "Welcome to Qyvex 🚀 - Your Gateway to Tech Careers",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); padding: 40px; border-radius: 12px 12px 0 0; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🚀 Welcome to Qyvex!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your account is ready to explore amazing opportunities</p>
        </div>

        <!-- Main Content -->
        <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 12px 12px;">
          
          <p style="font-size: 16px; margin-bottom: 25px;">
            Hi <strong>${input.name}</strong>,<br><br>
            Thank you for joining Qyvex! Your account has been successfully created and verified. You're now part of a community of thousands of CS students and tech professionals discovering their next big opportunity.
          </p>

          <!-- About Section -->
          <div style="background: white; padding: 20px; border-left: 4px solid #2563EB; margin-bottom: 25px; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #2563EB;">📌 About Qyvex</h3>
            <p style="margin: 10px 0; line-height: 1.6;">
              Qyvex is India's leading platform for Computer Science students to discover and apply for premium tech opportunities. We connect students with:<br><br>
            </p>
            <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>🔥 Software Engineering Jobs</strong> - Full-time roles at top tech companies</li>
              <li><strong>🎓 Internships</strong> - Gain real-world experience with industry leaders</li>
              <li><strong>🚀 Off-Campus Drives</strong> - Direct hiring from tech companies</li>
              <li><strong>⚡ Hackathons & Competitions</strong> - Showcase your skills and win prizes</li>
              <li><strong>💼 Placements</strong> - Curated opportunities matching your profile</li>
            </ul>
          </div>

          <!-- What You Can Do -->
          <div style="background: white; padding: 20px; border-left: 4px solid #10b981; margin-bottom: 25px; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #10b981;">✨ What You Can Do Now</h3>
            <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>Browse Opportunities</strong> - Explore hundreds of curated jobs and internships</li>
              <li><strong>Get Smart Alerts</strong> - Receive real-time notifications for opportunities matching your skills</li>
              <li><strong>Save Favorites</strong> - Bookmark opportunities to apply later</li>
              <li><strong>Apply Directly</strong> - One-click applications without re-entering details</li>
              <li><strong>Track Applications</strong> - Get updates on your application status</li>
            </ul>
          </div>

          <!-- Why Choose Qyvex -->
          <div style="background: white; padding: 20px; border-left: 4px solid #f59e0b; margin-bottom: 25px; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #f59e0b;">💡 Why Choose Qyvex?</h3>
            <table style="width: 100%; line-height: 2;">
              <tr>
                <td style="padding: 8px 0;">✅ <strong>Early Access</strong></td>
                <td style="text-align: right;">Get opportunities before they're posted elsewhere</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">✅ <strong>Curated Listings</strong></td>
                <td style="text-align: right;">Only verified, legitimate opportunities</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">✅ <strong>Smart Matching</strong></td>
                <td style="text-align: right;">Opportunities tailored to your skills and interests</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">✅ <strong>Complete Support</strong></td>
                <td style="text-align: right;">Tips, guides, and resources to land your dream role</td>
              </tr>
            </table>
          </div>

          <!-- Getting Started -->
          <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin-top: 0; color: #1e40af; text-align: center;">🎯 Quick Start Guide</h3>
            <ol style="margin: 15px 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>Complete Your Profile</strong> - Add skills, interests, and graduation year</li>
              <li><strong>Set Preferences</strong> - Choose job types and companies you're interested in</li>
              <li><strong>Browse Opportunities</strong> - Start exploring curated listings</li>
              <li><strong>Apply & Track</strong> - Submit applications and monitor progress</li>
              <li><strong>Stay Updated</strong> - Get real-time alerts for new opportunities</li>
            </ol>
          </div>

          <!-- CTA Buttons -->
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="${appUrl}/dashboard" style="display: inline-block; padding: 14px 32px; background: #2563EB; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px; margin-bottom: 10px;">
              🔍 Explore Opportunities
            </a>
            <a href="${appUrl}/profile" style="display: inline-block; padding: 14px 32px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
              👤 Complete Profile
            </a>
          </div>

          <!-- Contact Section -->
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
            <h4 style="margin-top: 0; color: #374151;">Need Help?</h4>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              Have questions? Check out our <strong>Help Center</strong> or reply to this email. Our team is here to help!
            </p>
          </div>

          <!-- Footer Message -->
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
            <strong style="color: #1f2937;">Pro Tip:</strong> Download the Qyvex app to get instant notifications about new opportunities and apply on the go!
          </p>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">We wish you an amazing journey in your tech career! 🌟</p>
            <p style="margin: 0;">Best regards,<br><strong style="color: #2563EB;">Team Qyvex</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
              © 2026 Qyvex. All rights reserved.<br>
              <a href="${appUrl}" style="color: #2563EB; text-decoration: none;">Visit Our Website</a>
            </p>
          </div>

        </div>
      </div>
    `,
  });
}

export async function sendSignupOtpEmail(input: { email: string; otp: string }) {
  return sendEmailStrict({
    to: input.email,
    subject: "Qyvex Email Verification Code",
    html: `
      <p>Hello,</p>
      <p>Your verification code for creating your Qyvex account is:</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:4px;">${input.otp}</p>
      <p>This code will expire in 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Team Qyvex</p>
    `,
  });
}

export async function sendPasswordResetOtpEmail(input: { email: string; otp: string }) {
  return sendEmailStrict({
    to: input.email,
    subject: "Qyvex Password Reset Code",
    html: `
      <p>Hello,</p>
      <p>Your password reset code is:</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:4px;">${input.otp}</p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Team Qyvex</p>
    `,
  });
}

/**
 * Send individual job alert email to subscriber
 * Used by the job posting script (scripts/add-jobs.ts)
 */
export async function sendEmailAlert(input: {
  to: string;
  userName: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  description: string;
  applyLink: string;
  jobUrl: string;
}) {
  try {
    await sendEmailStrict({
      to: input.to,
      subject: `🎯 New Job Alert: ${input.jobTitle} at ${input.company}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white;">
            <h2 style="margin: 0;">🎯 New Job Alert!</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">A job matching your preferences just posted</p>
          </div>

          <!-- Content -->
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Hi <strong>${input.userName}</strong>,<br><br>
              We found a job that matches your interests!
            </p>

            <!-- Job Details Card -->
            <div style="background: white; padding: 20px; border-left: 4px solid #2563EB; margin-bottom: 25px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px;">${input.jobTitle}</h3>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 8px 0; color: #6b7280;"><strong>Company:</strong> ${input.company}</p>
                <p style="margin: 8px 0; color: #6b7280;"><strong>Location:</strong> ${input.location}</p>
                <p style="margin: 8px 0; color: #6b7280;"><strong>Salary:</strong> ${input.salary}</p>
                <p style="margin: 8px 0; color: #6b7280;"><strong>Job Type:</strong> ${input.jobType}</p>
              </div>

              <div style="background: #f3f4f6; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; color: #4b5563; line-height: 1.6; font-size: 14px;">
                  ${input.description.substring(0, 200)}...
                </p>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="${input.applyLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px; margin-bottom: 10px;">
                ✅ Apply Now
              </a>
              <a href="${input.jobUrl}" style="display: inline-block; padding: 14px 32px; background: #e5e7eb; color: #374151; text-decoration: none; border-radius: 8px; font-weight: 600;">
                📖 View Details
              </a>
            </div>

            <!-- Footer Info -->
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              You received this email because you subscribed to job alerts for <strong>${input.jobType}</strong> roles in <strong>${input.location}</strong>.
            </p>

            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 15px 0 0 0;">
              © 2026 Qyvex. All rights reserved.
            </p>

          </div>

        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Failed to send email alert:", error);
    return false;
  }
}
