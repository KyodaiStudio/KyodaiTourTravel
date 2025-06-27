import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT b.*, tp.title as tour_title
      FROM bookings b
      LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id
      ORDER BY b.booking_date DESC
      LIMIT 10
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching recent bookings:", error)
    return NextResponse.json({ error: "Failed to fetch recent bookings" }, { status: 500 })
  }
}
