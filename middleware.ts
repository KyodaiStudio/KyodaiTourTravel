import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAdminSession } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    try {
      const session = await getAdminSession()

      if (!session) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    } catch (error) {
      console.error("Middleware error:", error)
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
