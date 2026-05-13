import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";

export async function GET() {
  try {
    const db = getDB();
    const [rows] = await db.query("SELECT * FROM kenh LIMIT 50");

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("DB error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
