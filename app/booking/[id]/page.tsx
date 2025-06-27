import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getClientSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import type { TourPackage } from "@/lib/types"
import { BookingForm } from "./booking-form"

async function getPackage(id: string): Promise<TourPackage | null> {
  const result = await sql`
    SELECT tp.*, c.name as category_name, d.name as destination_name, d.country
    FROM tour_packages tp
    LEFT JOIN categories c ON tp.category_id = c.id
    LEFT JOIN destinations d ON tp.destination_id = d.id
    WHERE tp.id = ${id} AND tp.is_active = true
  `
  return (result[0] as TourPackage) || null
}

interface BookingPageProps {
  params: { id: string }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const session = await getClientSession()

  if (!session) {
    redirect("/auth/login")
  }

  const pkg = await getPackage(params.id)

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Paket tidak ditemukan</h1>
          <Link href="/packages">
            <Button>Kembali ke Paket Tour</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Kyodai Tour&Travel Logo" width={32} height={32} className="rounded-lg" />
            <span className="text-2xl font-bold text-gray-800">Kyodai Tour&Travel</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link href="/packages" className="text-gray-600 hover:text-blue-600">
              Paket Tour
            </Link>
            <Link href="/destinations" className="text-gray-600 hover:text-blue-600">
              Destinasi
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600">
              Tentang
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">
              Kontak
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Paket Tour</h1>
          <p className="text-gray-600">Lengkapi data booking Anda</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm pkg={pkg} session={session} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={pkg.image_url || "/placeholder.svg?height=64&width=64"}
                        alt={pkg.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm line-clamp-2">{pkg.title}</h3>
                      <p className="text-gray-500 text-sm">{pkg.destination_name}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Harga per orang</span>
                      <span>Rp {pkg.price.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Durasi</span>
                      <span>{pkg.duration_days} hari</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                    <p className="font-medium mb-1">Termasuk:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Akomodasi sesuai paket</li>
                      <li>• Transportasi</li>
                      <li>• Guide profesional</li>
                      <li>• Tiket masuk objek wisata</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
