import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifySignupOtpSchema } from "@/lib/validators";
import { signVerificationToken } from "@/lib/signup-verification";

const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(`signup-verify-otp:${ip}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = verifySignupOtpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();

  const verification = await prisma.emailVerification.findUnique({
    where: { email: normalizedEmail },
  });

  if (!verification) {
    return NextResponse.json({ error: "OTP not found. Request a new one." }, { status: 404 });
  }

  if (verification.expiresAt < new Date()) {
    await prisma.emailVerification.delete({ where: { email: normalizedEmail } });
    return NextResponse.json({ error: "OTP expired. Request a new one." }, { status: 400 });
  }

  if (verification.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many incorrect attempts. Request a new OTP." }, { status: 429 });
  }

  const validOtp = await bcrypt.compare(parsed.data.otp, verification.otp);

  if (!validOtp) {
    await prisma.emailVerification.update({
      where: { email: normalizedEmail },
      data: { attempts: { increment: 1 } },
    });

    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }

  const verificationToken = signVerificationToken(normalizedEmail, 600);

  return NextResponse.json({ success: true, verificationToken });
}
