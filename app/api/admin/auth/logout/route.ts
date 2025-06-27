import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

async function handleAdminLogout() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (sessionToken) {
      // Delete session from database
      try {
        await sql`DELETE FROM admin_sessions WHERE session_token = ${sessionToken}`
      } catch (error) {
        console.error("Error deleting admin session:", error)
      }
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL("/admin/login", "http://localhost:3000"))

    // Clear the cookie
    response.cookies.delete("admin_session")

    return response
  } catch (error) {
    console.error("Admin logout error:", error)
    // If there's an error, still redirect to admin login
    const response = NextResponse.redirect(new URL("/admin/login", "http://localhost:3000"))
    response.cookies.delete("admin_session")
    return response
  }
}

export async function POST(request: NextRequest) {
  return handleAdminLogout()
}

export async function GET(request: NextRequest) {
  return handleAdminLogout()
}
