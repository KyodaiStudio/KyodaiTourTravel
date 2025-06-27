import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const destination = searchParams.get("destination")

    let query = `
      SELECT tp.*, c.name as category_name, d.name as destination_name
      FROM tour_packages tp
      LEFT JOIN categories c ON tp.category_id = c.id
      LEFT JOIN destinations d ON tp.destination_id = d.id
      WHERE tp.is_active = true
    `

    const params: any[] = []
    let paramIndex = 1

    if (search) {
      query += ` AND (tp.title ILIKE $${paramIndex} OR tp.description ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (category) {
      query += ` AND c.name = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (destination) {
      query += ` AND d.name = $${paramIndex}`
      params.push(destination)
      paramIndex++
    }

    query += ` ORDER BY tp.created_at DESC`

    const result = await sql(query, params)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}
