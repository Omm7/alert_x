import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 });
  }

  await prisma.subscription.deleteMany({ where: { id } });

  return NextResponse.redirect(new URL("/dashboard?unsubscribed=true", request.url));
}
