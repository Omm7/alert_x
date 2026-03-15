import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, response: null };
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return {
      session: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, response: null };
}
