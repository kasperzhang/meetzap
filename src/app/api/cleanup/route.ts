import { NextResponse } from "next/server";
import { deleteExpiredEvents } from "@/lib/db/queries";

export async function DELETE() {
  try {
    const deletedCount = await deleteExpiredEvents();

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
    });
  } catch (error) {
    console.error("Error cleaning up expired events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Vercel Cron calls GET by default
export async function GET() {
  return DELETE();
}
