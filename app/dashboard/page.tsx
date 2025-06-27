import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, User, Package, FileText, LogOut, Phone, Mail, CheckCircle } from "lucide-react"
import { getClientSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { formatCurrency } from "@/lib/utils"
import { logoutUser } from "@/app/actions/auth"
import type { Booking } from "@/lib/types"

async function getClientBookings(clientEmail: string): Promise<Booking[]> {
  const rows = await sql`
    SELECT b.*, tp.title AS tour_title,
           tp.image_url,
           tp.duration_days
    FROM   bookings      b
           LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id
    WHERE  b.customer_email = ${clientEmail}
    ORDER  BY b.booking_date DESC
    LIMIT  5
  `
  return rows as Booking[]
}

async function getClientStats(clientEmail: string) {
  const [bookingsResult, totalSpentResult] = await Promise.all([
    sql`SELECT COUNT(*) AS count
        FROM   bookings
        WHERE  customer_email = ${clientEmail}`,
    sql`SELECT COALESCE(SUM(total_price), 0) AS total
        FROM   bookings
        WHERE  customer_email = ${clientEmail}
        AND    payment_status = 'paid'`,
  ])

  return {
    totalBookings: Number.parseInt(bookingsResult[0].count),
    totalSpent: Number.parseFloat(totalSpentResult[0].total),
  }
}

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getClientSession()

  if (!session) {
    redirect("/auth/login")
  }

  const bookings = await getClientBookings(session.email)
  const stats = await getClientStats(session.email)
  const showBookingSuccess = searchParams.booking === "success"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Kyodai Tour&Travel Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Kyodai Tour&Travel
                </span>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Halo, {session.name}</span>
              <form action={logoutUser}>
                <Button variant="outline" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Booking Success Alert */}
        {showBookingSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Booking Berhasil!</h3>
                <p className="text-green-700">
                  Terima kasih! Booking Anda telah berhasil diproses. Kami akan menghubungi Anda segera untuk konfirmasi
                  lebih lanjut.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Selamat Datang, {session.name}!</h1>
          <p className="text-xl text-gray-600">Kelola perjalanan dan booking Anda dengan mudah</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">Perjalanan Anda</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</div>
              <p className="text-xs text-muted-foreground">Yang sudah dibayar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Member</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Silver</div>
              <p className="text-xs text-muted-foreground">Member aktif</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link href="/packages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Cari Paket Tour</h3>
                <p className="text-sm text-gray-600">Temukan destinasi impian</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/bookings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Riwayat Booking</h3>
                <p className="text-sm text-gray-600">Lihat semua perjalanan</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/invoices">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-semibold">Invoice</h3>
                <p className="text-sm text-gray-600">Download invoice</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <User className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">Profil Saya</h3>
                <p className="text-sm text-gray-600">Edit informasi</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Booking Terbaru</CardTitle>
              <Link href="/dashboard/bookings">
                <Button variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={booking.image_url || "/placeholder.svg?height=64&width=64"}
                      alt={booking.tour_title || "Tour"}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.tour_title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(booking.departure_date).toLocaleDateString("id-ID")}</span>
                      <span className="mx-2">•</span>
                      <span>{booking.participants} peserta</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(booking.total_price)}</p>
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Belum ada booking</p>
                  <Link href="/packages">
                    <Button>Mulai Jelajahi</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Butuh Bantuan?</h3>
                <p className="text-gray-600">Tim customer service kami siap membantu Anda 24/7</p>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex items-center bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Center
                </Button>
                <Button className="flex items-center bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
