import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { generateSessionToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json()

    // Check if email already exists
    const existingClient = await sql`
      SELECT id FROM clients WHERE email = ${email}
    `

    if (existingClient.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    // Create new client (in production, hash the password)
    const result = await sql`
      INSERT INTO clients (name, email, phone, password)
      VALUES (${name}, ${email}, ${phone}, ${password})
      RETURNING id, name, email
    `

    const client = result[0]
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create session
    await sql`
      INSERT INTO client_sessions (client_id, session_token, expires_at)
      VALUES (${client.id}, ${sessionToken}, ${expiresAt})
    `

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("client_session", sessionToken, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return NextResponse.json({ success: true, client })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
