import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

async function handleLogout() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("client_session")?.value

    if (sessionToken) {
      // Delete session from database
      try {
        await sql`DELETE FROM client_sessions WHERE session_token = ${sessionToken}`
      } catch (error) {
        console.error("Error deleting client session:", error)
      }
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL("/", "http://localhost:3000"))

    // Clear the cookie
    response.cookies.delete("client_session")

    return response
  } catch (error) {
    console.error("Client logout error:", error)
    // If there's an error, still redirect to home
    const response = NextResponse.redirect(new URL("/", "http://localhost:3000"))
    response.cookies.delete("client_session")
    return response
  }
}

export async function POST(request: NextRequest) {
  return handleLogout()
}

export async function GET(request: NextRequest) {
  return handleLogout()
}
