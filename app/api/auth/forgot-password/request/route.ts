import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { forgotPasswordRequestSchema } from "@/lib/validators";
import { sendPasswordResetOtpEmail } from "@/lib/email";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(`forgot-password-request:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = forgotPasswordRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email: { equals: normalizedEmail, mode: "insensitive" } },
  });

  // Prevent user enumeration by returning success regardless of account existence.
  if (!user) {
    return NextResponse.json({ success: true });
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.passwordReset.upsert({
    where: { email: normalizedEmail },
    update: {
      otp: otpHash,
      expiresAt,
      attempts: 0,
    },
    create: {
      email: normalizedEmail,
      otp: otpHash,
      expiresAt,
    },
  });

  try {
    await sendPasswordResetOtpEmail({ email: normalizedEmail, otp });
  } catch (error) {
    console.error("[FORGOT-PASSWORD] Email error:", error);
    
    // In development mode with Resend sandbox, allow anyway and log OTP
    if (process.env.NODE_ENV !== "production" && error instanceof Error) {
      if (error.message.includes("only send testing emails")) {
        console.log(`[DEV MODE] Password Reset OTP for ${normalizedEmail}: ${otp}`);
      }
    } else {
      const message = error instanceof Error ? error.message : "Could not send reset code";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
