import { NextResponse } from "next/server"
import { getClientSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const session = await getClientSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, address } = body

    // Update client profile
    await sql`
      UPDATE clients 
      SET name = ${name}, phone = ${phone}, address = ${address}
      WHERE email = ${session.email}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
