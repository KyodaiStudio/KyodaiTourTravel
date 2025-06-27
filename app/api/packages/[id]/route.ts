import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      SELECT tp.*, c.name as category_name, d.name as destination_name, d.country
      FROM tour_packages tp
      LEFT JOIN categories c ON tp.category_id = c.id
      LEFT JOIN destinations d ON tp.destination_id = d.id
      WHERE tp.id = ${params.id} AND tp.is_active = true
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 })
  }
}
