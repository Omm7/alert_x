import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * DEBUG ENDPOINT - Shows all users in database
 * THIS SHOULD ONLY BE USED FOR DEVELOPMENT/DEBUGGING
 * REMOVE IN PRODUCTION
 */
export async function GET() {
  try {
    console.log("[DEBUG] Attempting to fetch users...");
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true, // Shows hashed, not plaintext
        collegeName: true,
        graduationYear: true,
        branch: true,
        createdAt: true,
      },
    });

    console.log(`[DEBUG] Found ${users.length} users`);
    return NextResponse.json({
      message: `Found ${users.length} users in database`,
      users,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[DEBUG] Error fetching users:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: errorMessage,
        type: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 }
    );
  }
}
