import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, Calendar, DollarSign, TrendingUp, Eye } from "lucide-react"
import { getAdminSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { logoutAdmin } from "@/app/actions/auth"

interface DashboardStats {
  totalPackages: number
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
}

interface RecentBooking {
  id: number
  customer_name: string
  tour_title: string
  total_price: number
  status: string
  booking_date: string
}

async function getDashboardStats(): Promise<DashboardStats> {
  const [packagesResult, bookingsResult, revenueResult, pendingResult] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM tour_packages WHERE is_active = true`,
    sql`SELECT COUNT(*) as count FROM bookings`,
    sql`SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE payment_status = 'paid'`,
    sql`SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'`,
  ])

  return {
    totalPackages: Number.parseInt(packagesResult[0].count),
    totalBookings: Number.parseInt(bookingsResult[0].count),
    totalRevenue: Number.parseFloat(revenueResult[0].total),
    pendingBookings: Number.parseInt(pendingResult[0].count),
  }
}

async function getRecentBookings(): Promise<RecentBooking[]> {
  const result = await sql`
    SELECT b.*, tp.title as tour_title
    FROM bookings b
    LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id
    ORDER BY b.booking_date DESC
    LIMIT 10
  `
  return result as RecentBooking[]
}

export default async function AdminDashboard() {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  const stats = await getDashboardStats()
  const recentBookings = await getRecentBookings()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Selamat datang, {session.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat Website
                </Button>
              </Link>
              <form action={logoutAdmin}>
                <Button variant="destructive" type="submit">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/admin">
            <Button variant="default">Dashboard</Button>
          </Link>
          <Link href="/admin/packages">
            <Button variant="outline">Kelola Paket</Button>
          </Link>
          <Link href="/admin/bookings">
            <Button variant="outline">Kelola Booking</Button>
          </Link>
          <Link href="/admin/destinations">
            <Button variant="outline">Kelola Destinasi</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paket</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPackages}</div>
              <p className="text-xs text-muted-foreground">Paket tour aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">Semua booking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground">Total pendapatan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Booking</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Menunggu konfirmasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{booking.customer_name}</h3>
                    <p className="text-sm text-gray-600">{booking.tour_title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.booking_date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rp {booking.total_price.toLocaleString("id-ID")}</p>
                    <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                  </div>
                </div>
              ))}
              {recentBookings.length === 0 && <p className="text-center text-gray-500 py-8">Belum ada booking</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
