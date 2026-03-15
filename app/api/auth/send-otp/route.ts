import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendSignupOtpSchema } from "@/lib/validators";
import { sendSignupOtpEmail } from "@/lib/email";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(`signup-send-otp:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = sendSignupOtpSchema.safeParse(body);

    if (!parsed.success) {
      console.error("[SEND-OTP] Validation failed:", parsed.error.flatten());
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const normalizedEmail = parsed.data.email.trim().toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    });
    if (existingUser) {
      return NextResponse.json({ error: "This account already exists. Please login." }, { status: 409 });
    }

    // Check OTP cooldown - prevent sending OTP within 1 minute of last request
    const existingVerification = await prisma.emailVerification.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingVerification?.lastOtpSentAt) {
      const timeSinceLastOtp = Date.now() - existingVerification.lastOtpSentAt.getTime();
      const cooldownDuration = 60 * 1000; // 1 minute

      if (timeSinceLastOtp < cooldownDuration) {
        const secondsRemaining = Math.ceil((cooldownDuration - timeSinceLastOtp) / 1000);
        return NextResponse.json(
          { error: `Please wait ${secondsRemaining} second${secondsRemaining !== 1 ? 's' : ''} before requesting another OTP` },
          { status: 429 }
        );
      }
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.emailVerification.upsert({
      where: { email: normalizedEmail },
      update: {
        otp: otpHash,
        expiresAt,
        attempts: 0,
        lastOtpSentAt: new Date(),
      },
      create: {
        email: normalizedEmail,
        otp: otpHash,
        expiresAt,
        lastOtpSentAt: new Date(),
      },
    });

    try {
      const messageId = await sendSignupOtpEmail({ email: normalizedEmail, otp });
      return NextResponse.json({ success: true, email: normalizedEmail, messageId });
    } catch (emailError) {
      console.error("[SEND-OTP] Email error:", emailError);
      
      // In development mode with Resend sandbox, allow signup anyway and log OTP
      if (process.env.NODE_ENV !== "production" && emailError instanceof Error) {
        if (emailError.message.includes("only send testing emails")) {
          console.log(`[DEV MODE] OTP for ${normalizedEmail}: ${otp}`);
          return NextResponse.json({ 
            success: true, 
            email: normalizedEmail,
            devMode: true,
            message: `Development mode: Email sent to console. Check terminal for OTP code. (OTP for ${normalizedEmail} is logged above)`
          });
        }
      }
      
      const message = emailError instanceof Error ? emailError.message : "Could not send OTP email";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error) {
    console.error("[SEND-OTP] Unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
