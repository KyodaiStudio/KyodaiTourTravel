import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM destinations
      ORDER BY created_at DESC
    `
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, country, description, image_url } = body

    const result = await sql`
      INSERT INTO destinations (name, country, description, image_url)
      VALUES (${name}, ${country}, ${description}, ${image_url})
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating destination:", error)
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 })
  }
}
