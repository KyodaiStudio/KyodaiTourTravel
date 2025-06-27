import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const [packagesResult, bookingsResult, revenueResult, pendingResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM tour_packages WHERE is_active = true`,
      sql`SELECT COUNT(*) as count FROM bookings`,
      sql`SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE payment_status = 'paid'`,
      sql`SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'`,
    ])

    return NextResponse.json({
      totalPackages: Number.parseInt(packagesResult[0].count),
      totalBookings: Number.parseInt(bookingsResult[0].count),
      totalRevenue: Number.parseFloat(revenueResult[0].total),
      pendingBookings: Number.parseInt(pendingResult[0].count),
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
