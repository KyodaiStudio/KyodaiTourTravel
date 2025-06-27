import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const destinationId = Number.parseInt(params.id)

    const result = await sql`
      SELECT * FROM destinations WHERE id = ${destinationId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching destination:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const destinationId = Number.parseInt(params.id)
    const body = await request.json()

    const { name, country, description, image_url } = body

    // Validate required fields
    if (!name || !country || !description || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await sql`
      UPDATE destinations 
      SET 
        name = ${name},
        country = ${country},
        description = ${description},
        image_url = ${image_url},
        updated_at = NOW()
      WHERE id = ${destinationId}
    `

    return NextResponse.json({ message: "Destination updated successfully" })
  } catch (error) {
    console.error("Error updating destination:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const destinationId = Number.parseInt(params.id)

    await sql`DELETE FROM destinations WHERE id = ${destinationId}`

    return NextResponse.json({ message: "Destination deleted successfully" })
  } catch (error) {
    console.error("Error deleting destination:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
