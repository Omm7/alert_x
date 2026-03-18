import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "Qyvex <alerts@qyvex.tech>";

export async function GET() {
  const auth = await requireAuth();
  if (auth.response || !auth.session?.user?.id) {
    return auth.response!;
  }

  const subscription = await prisma.subscription.findFirst({
    where: { userId: auth.session.user.id },
  });

  return NextResponse.json({ subscribed: !!subscription });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.response || !auth.session?.user?.id) {
    return auth.response!;
  }

  try {
    // Check if user already subscribed
    const existing = await prisma.subscription.findFirst({
      where: { userId: auth.session.user.id },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You are already subscribed to job alerts" },
        { status: 400 }
      );
    }

    // Create subscription (simple global subscription)
    const subscription = await prisma.subscription.create({
      data: {
        userId: auth.session.user.id,
        jobCategory: "ALL",
        location: "ALL",
        jobType: "ALL",
      },
      include: { user: true },
    });

    // Send confirmation email
    if (resend && subscription.user.email) {
      try {
        await resend.emails.send({
          from: DEFAULT_FROM,
          to: subscription.user.email,
          subject: "🎉 Welcome to Qyvex Job Alerts!",
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #2563EB 0%, #1e40af 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white;">
                <h2 style="margin: 0;">🎉 Welcome to Qyvex Job Alerts!</h2>
              </div>

              <!-- Content -->
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
                
                <p style="font-size: 16px; margin-bottom: 25px;">
                  Hi <strong>${subscription.user.name}</strong>,<br><br>
                  Thank you for subscribing to Qyvex job alerts! 🙏
                </p>

                <div style="background: white; padding: 20px; border-left: 4px solid #2563EB; margin-bottom: 25px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">✅ You're All Set!</h3>
                  
                  <p style="margin: 8px 0; color: #6b7280; line-height: 1.6;">
                    You will now receive email notifications whenever we post new job opportunities. Don't miss out on your next career opportunity!
                  </p>
                </div>

                <div style="background: #f3f4f6; padding: 15px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #10b981;">
                  <p style="margin: 0; color: #4b5563; font-size: 14px; font-weight: 600;">
                    💡 Pro Tip: Keep an eye on your inbox and spam folder to ensure you don't miss any alerts!
                  </p>
                </div>

                <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  Questions? Visit our <a href="https://qyvex.tech" style="color: #2563EB; text-decoration: none;">website</a> for more information.
                </p>

                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 15px 0 0 0;">
                  © 2026 Qyvex. All rights reserved.
                </p>

              </div>

            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
