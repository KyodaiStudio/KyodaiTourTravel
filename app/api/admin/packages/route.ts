import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT tp.*, c.name as category_name, d.name as destination_name
      FROM tour_packages tp
      LEFT JOIN categories c ON tp.category_id = c.id
      LEFT JOIN destinations d ON tp.destination_id = d.id
      ORDER BY tp.created_at DESC
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      price,
      duration_days,
      max_participants,
      category_id,
      destination_id,
      image_url,
      itinerary,
      includes,
      excludes,
    } = body

    const result = await sql`
      INSERT INTO tour_packages (
        title, description, price, duration_days, max_participants,
        category_id, destination_id, image_url, itinerary, includes, excludes
      ) VALUES (
        ${title}, ${description}, ${price}, ${duration_days}, ${max_participants},
        ${category_id}, ${destination_id}, ${image_url}, ${itinerary}, ${includes}, ${excludes}
      ) RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }
}
