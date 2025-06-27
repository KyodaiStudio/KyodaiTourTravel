"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"

export async function logoutUser() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("client_session")?.value

    if (sessionToken) {
      // Delete session from database
      await sql`DELETE FROM client_sessions WHERE session_token = ${sessionToken}`
    }

    // Clear cookie
    cookieStore.delete("client_session")
  } catch (error) {
    console.error("Logout error:", error)
  }

  redirect("/")
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (sessionToken) {
      // Delete session from database
      await sql`DELETE FROM admin_sessions WHERE session_token = ${sessionToken}`
    }

    // Clear cookie
    cookieStore.delete("admin_session")
  } catch (error) {
    console.error("Admin logout error:", error)
  }

  redirect("/admin/login")
}
