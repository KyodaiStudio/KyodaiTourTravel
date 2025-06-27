import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Calendar, MapPin } from "lucide-react"
import { getClientSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { logoutUser } from "@/app/actions/auth"
import { ProfileForm } from "./profile-form"

async function getClientStats(clientEmail: string) {
  const [bookingsResult, totalSpentResult, joinDateResult] = await Promise.all([
    sql`SELECT COUNT(*) AS count FROM bookings WHERE customer_email = ${clientEmail}`,
    sql`SELECT COALESCE(SUM(total_price), 0) AS total FROM bookings WHERE customer_email = ${clientEmail} AND payment_status = 'paid'`,
    sql`SELECT created_at FROM clients WHERE email = ${clientEmail}`,
  ])

  return {
    totalBookings: Number.parseInt(bookingsResult[0].count),
    totalSpent: Number.parseFloat(totalSpentResult[0].total),
    joinDate: joinDateResult[0]?.created_at || new Date(),
  }
}

export default async function ProfilePage() {
  const session = await getClientSession()

  if (!session) {
    redirect("/auth/login")
  }

  const stats = await getClientStats(session.email)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Kyodai Tour&Travel Logo" width={32} height={32} className="rounded-lg" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Kyodai Tour&Travel
                </span>
                <p className="text-xs text-gray-500">Profil Saya</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Halo, {session.name}</span>
              <form action={logoutUser}>
                <Button variant="outline" type="submit">
                  Keluar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">Profil Saya</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Profil Saya</h1>
          <p className="text-xl text-gray-600">Kelola informasi akun dan preferensi Anda</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <ProfileForm session={session} />
          </div>

          {/* Stats & Info */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Ringkasan Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{session.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{session.name}</h3>
                  <p className="text-gray-600">{session.email}</p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Booking</span>
                    <span className="font-semibold">{stats.totalBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Pengeluaran</span>
                    <span className="font-semibold">Rp {stats.totalSpent.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Sejak</span>
                    <span className="font-semibold">{new Date(stats.joinDate).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status Member</span>
                    <span className="font-semibold text-blue-600">Silver</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/bookings">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Lihat Riwayat Booking
                  </Button>
                </Link>
                <Link href="/dashboard/invoices">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </Link>
                <Link href="/packages">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    Jelajahi Paket Tour
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
