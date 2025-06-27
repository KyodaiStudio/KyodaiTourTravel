import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageId = Number.parseInt(params.id)

    const result = await sql`
      SELECT p.*, d.name as destination_name
      FROM packages p
      LEFT JOIN destinations d ON p.destination_id = d.id
      WHERE p.id = ${packageId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageId = Number.parseInt(params.id)
    const body = await request.json()

    const { name, description, price, duration, max_participants, image_url, destination_id, category, is_active } =
      body

    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !duration ||
      !max_participants ||
      !image_url ||
      !destination_id ||
      !category
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await sql`
      UPDATE packages 
      SET 
        name = ${name},
        description = ${description},
        price = ${price},
        duration = ${duration},
        max_participants = ${max_participants},
        image_url = ${image_url},
        destination_id = ${destination_id},
        category = ${category},
        is_active = ${is_active},
        updated_at = NOW()
      WHERE id = ${packageId}
    `

    return NextResponse.json({ message: "Package updated successfully" })
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageId = Number.parseInt(params.id)

    await sql`DELETE FROM packages WHERE id = ${packageId}`

    return NextResponse.json({ message: "Package deleted successfully" })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
