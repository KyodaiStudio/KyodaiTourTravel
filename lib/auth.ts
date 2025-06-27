import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production")

export interface ClientSession {
  id: number
  email: string
  name: string
  phone?: string
}

export interface AdminSession {
  id: number
  username: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createClientToken(payload: ClientSession): Promise<string> {
  return new SignJWT({ ...payload, type: "client" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function createAdminToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload, type: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

export async function getClientSession(): Promise<ClientSession | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("client-token")?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload || payload.type !== "client") {
      return null
    }

    return {
      id: payload.id as number,
      email: payload.email as string,
      name: payload.name as string,
      phone: payload.phone as string,
    }
  } catch (error) {
    console.error("Error getting client session:", error)
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("admin-token")?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload || payload.type !== "admin") {
      return null
    }

    return {
      id: payload.id as number,
      username: payload.username as string,
      email: payload.email as string,
      role: payload.role as string,
    }
  } catch (error) {
    console.error("Error getting admin session:", error)
    return null
  }
}

export async function setClientSession(session: ClientSession): Promise<void> {
  const token = await createClientToken(session)
  const cookieStore = cookies()

  cookieStore.set("client-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function setAdminSession(session: AdminSession): Promise<void> {
  const token = await createAdminToken(session)
  const cookieStore = cookies()

  cookieStore.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function clearClientSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("client-token")
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("admin-token")
}
