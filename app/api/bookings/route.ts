import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      tourPackageId,
      departureDate,
      participants,
      totalPrice,
      notes,
    } = body

    const result = await sql`
      INSERT INTO bookings (
        customer_name, customer_email, customer_phone, tour_package_id,
        departure_date, participants, total_price, notes
      ) VALUES (
        ${customerName}, ${customerEmail}, ${customerPhone}, ${tourPackageId},
        ${departureDate}, ${participants}, ${totalPrice}, ${notes}
      ) RETURNING id
    `

    return NextResponse.json({ success: true, bookingId: result[0].id })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT b.*, tp.title as tour_title
      FROM bookings b
      LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id
      ORDER BY b.booking_date DESC
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
