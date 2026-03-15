import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const rate = checkRateLimit(`login:${ip}`, 20, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email: { equals: normalizedEmail, mode: "insensitive" } },
  });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(parsed.data.password, user.password);
  if (!validPassword) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Update last login time
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return NextResponse.json({ success: true });
}
