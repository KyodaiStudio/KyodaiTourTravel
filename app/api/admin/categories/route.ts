import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const categories = await sql`
      SELECT id, name, description, created_at
      FROM categories
      ORDER BY name ASC
    `

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ message: "Gagal mengambil data kategori" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Nama kategori wajib diisi" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO categories (name, description)
      VALUES (${name}, ${description || ""})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ message: "Gagal membuat kategori" }, { status: 500 })
  }
}
