import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { generateSessionToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Check admin credentials (password: kyodai123)
    const result = await sql`
      SELECT * FROM admin_users 
      WHERE email = ${email}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    const admin = result[0]

    // Simple password check (in production, use proper hashing)
    // For demo: admin@kyodai.com / kyodai123
    if (password !== "kyodai123") {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create admin session
    await sql`
      INSERT INTO admin_sessions (admin_id, session_token, expires_at)
      VALUES (${admin.id}, ${sessionToken}, ${expiresAt})
    `

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", sessionToken, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return NextResponse.json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email } })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
