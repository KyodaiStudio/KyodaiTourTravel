import { cookies } from "next/headers"
import { sql } from "./db"
import bcrypt from "bcryptjs"

export interface ClientSession {
  id: number
  name: string
  email: string
}

export interface AdminSession {
  id: number
  name: string
  email: string
  role: string
}

export async function getClientSession(): Promise<ClientSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("client_session")?.value

    if (!sessionToken) {
      return null
    }

    const result = await sql`
      SELECT c.id, c.name, c.email
      FROM client_sessions cs
      JOIN clients c ON cs.client_id = c.id
      WHERE cs.session_token = ${sessionToken}
      AND cs.expires_at > NOW()
    `

    return result.length > 0 ? (result[0] as ClientSession) : null
  } catch (error) {
    console.error("Error getting client session:", error)
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (!sessionToken) {
      return null
    }

    const result = await sql`
      SELECT a.id, a.name, a.email, a.role
      FROM admin_sessions ads
      JOIN admin_users a ON ads.admin_id = a.id
      WHERE ads.session_token = ${sessionToken}
      AND ads.expires_at > NOW()
    `

    return result.length > 0 ? (result[0] as AdminSession) : null
  } catch (error) {
    console.error("Error getting admin session:", error)
    return null
  }
}

export async function createClientSession(clientId: number): Promise<string> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await sql`
    INSERT INTO client_sessions (client_id, session_token, expires_at)
    VALUES (${clientId}, ${sessionToken}, ${expiresAt})
  `

  return sessionToken
}

export async function createAdminSession(adminId: number): Promise<string> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await sql`
    INSERT INTO admin_sessions (admin_id, session_token, expires_at)
    VALUES (${adminId}, ${sessionToken}, ${expiresAt})
  `

  return sessionToken
}

export async function deleteClientSession(sessionToken: string): Promise<void> {
  await sql`
    DELETE FROM client_sessions
    WHERE session_token = ${sessionToken}
  `
}

export async function deleteAdminSession(sessionToken: string): Promise<void> {
  await sql`
    DELETE FROM admin_sessions
    WHERE session_token = ${sessionToken}
  `
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
