import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { registerWithVerificationSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/lib/email";
import { verifyVerificationToken } from "@/lib/signup-verification";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(`register:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = registerWithVerificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();

  const exists = await prisma.user.findFirst({
    where: { email: { equals: normalizedEmail, mode: "insensitive" } },
  });
  if (exists) {
    return NextResponse.json({ error: "This account already exists. Please login." }, { status: 409 });
  }

  const tokenPayload = verifyVerificationToken(parsed.data.verificationToken);
  if (!tokenPayload || tokenPayload.email !== normalizedEmail) {
    return NextResponse.json({ error: "Invalid verification token" }, { status: 401 });
  }

  const verification = await prisma.emailVerification.findUnique({ where: { email: normalizedEmail } });
  if (!verification || verification.expiresAt < new Date()) {
    return NextResponse.json({ error: "Verification expired. Request OTP again." }, { status: 400 });
  }

  let user: { id: string; email: string; name: string };
  try {
    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
    user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: normalizedEmail,
        password: hashedPassword,
        collegeName: parsed.data.collegeName,
        graduationYear: parseInt(parsed.data.graduationYear),
        branch: parsed.data.branch,
      },
      select: { id: true, email: true, name: true },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "This account already exists. Please login." }, { status: 409 });
    }
    throw error;
  }

  await prisma.emailVerification.deleteMany({ where: { email: normalizedEmail } });

  try {
    await sendWelcomeEmail({ email: user.email, name: user.name });
  } catch (error) {
    console.error("Welcome email failed", error);
  }

  return NextResponse.json(user, { status: 201 });
}
