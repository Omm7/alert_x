import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { forgotPasswordResetSchema } from "@/lib/validators";

const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(`forgot-password-reset:${ip}`, 15, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = forgotPasswordResetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();

  const reset = await prisma.passwordReset.findUnique({ where: { email: normalizedEmail } });

  if (!reset) {
    return NextResponse.json({ error: "Reset code not found" }, { status: 404 });
  }

  if (reset.expiresAt < new Date()) {
    await prisma.passwordReset.delete({ where: { email: normalizedEmail } });
    return NextResponse.json({ error: "Reset code expired" }, { status: 400 });
  }

  if (reset.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many incorrect attempts" }, { status: 429 });
  }

  const validOtp = await bcrypt.compare(parsed.data.otp, reset.otp);
  if (!validOtp) {
    await prisma.passwordReset.update({
      where: { email: normalizedEmail },
      data: { attempts: { increment: 1 } },
    });
    return NextResponse.json({ error: "Invalid reset code" }, { status: 401 });
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { password: hashedPassword },
  });

  await prisma.passwordReset.deleteMany({ where: { email: normalizedEmail } });

  return NextResponse.json({ success: true });
}
