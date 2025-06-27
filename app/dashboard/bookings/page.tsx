import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, ArrowLeft, Eye, Download } from "lucide-react"
import { getClientSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { logoutUser } from "@/app/actions/auth"
import type { Booking } from "@/lib/types"

async function getClientBookings(clientEmail: string, status?: string): Promise<Booking[]> {
  if (status && status !== "all") {
    const result = await sql`
      SELECT b.*, tp.title AS tour_title,
             tp.image_url,
             tp.duration_days,
             d.name as destination_name
      FROM   bookings b
             LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id
             LEFT JOIN destinations d ON tp.destination_id = d.id
      WHERE  b.customer_email = ${clientEmail}
      AND    b.status = ${status}
      ORDER  BY b.booking_date DESC
    `
    return result as Booking[]
  } else {
    const result = await sql`
      SELECT b.*, tp.title AS tour_title,
             tp.image_url,
             tp.duration_days,
             d.name as destination_name
      FROM   bookings b
             LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id
             LEFT JOIN destinations d ON tp.destination_id = d.id
      WHERE  b.customer_email = ${clientEmail}
      ORDER  BY b.booking_date DESC
    `
    return result as Booking[]
  }
}

interface BookingsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const session = await getClientSession()

  if (!session) {
    redirect("/auth/login")
  }

  const statusFilter = typeof searchParams.status === "string" ? searchParams.status : "all"
  const bookings = await getClientBookings(session.email, statusFilter)

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
                <p className="text-xs text-gray-500">Riwayat Booking</p>
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
          <span className="text-gray-700">Riwayat Booking</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Riwayat Booking</h1>
          <p className="text-xl text-gray-600">Lihat semua perjalanan dan booking Anda</p>
        </div>

        {/* Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form method="GET" className="flex gap-4">
            <Select name="status" defaultValue={statusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Filter</Button>
          </form>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-4 gap-0">
                  {/* Image */}
                  <div className="relative h-48 md:h-auto">
                    <Image
                      src={booking.image_url || "/placeholder.svg?height=200&width=300"}
                      alt={booking.tour_title || "Tour"}
                      fill
                      className="object-cover"
                    />
                    <Badge
                      className={`absolute top-4 left-4 ${
                        booking.status === "confirmed"
                          ? "bg-green-500"
                          : booking.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-6">
                    <h3 className="text-xl font-semibold mb-2">{booking.tour_title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{booking.destination_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Keberangkatan: {new Date(booking.departure_date).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{booking.participants} peserta</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Booking: {new Date(booking.booking_date).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <strong>Catatan:</strong> {booking.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-6 flex flex-col justify-between">
                    <div className="text-right mb-4">
                      <div className="text-2xl font-bold text-orange-500">
                        Rp {booking.total_price.toLocaleString("id-ID")}
                      </div>
                      <div className="text-sm text-gray-500">Total pembayaran</div>
                    </div>
                    <div className="space-y-2">
                      <Link href={`/packages/${booking.tour_package_id}`}>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Paket
                        </Button>
                      </Link>
                      {booking.status === "confirmed" && (
                        <Link href={`/dashboard/invoices/${booking.id}`}>
                          <Button size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Booking</h3>
              <p className="text-gray-600 mb-6">Anda belum memiliki riwayat booking. Mulai jelajahi paket tour kami!</p>
              <Link href="/packages">
                <Button>Jelajahi Paket Tour</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
