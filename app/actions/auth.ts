"use server"

import { redirect } from "next/navigation"
import { clearClientSession, clearAdminSession } from "@/lib/auth"

export async function logoutUser() {
  await clearClientSession()
  redirect("/")
}

export async function logoutAdmin() {
  await clearAdminSession()
  redirect("/admin/login")
}
