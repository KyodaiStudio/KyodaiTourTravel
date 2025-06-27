"use client"

import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Calendar, MapPin, Users, Phone, Mail } from "lucide-react"
import { getClientSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import type { Booking } from "@/lib/types"

async function getInvoiceData(bookingId: string, clientEmail: string): Promise<Booking | null> {
  const result = await sql`
    SELECT b.*, tp.title AS tour_title,
           tp.image_url,
           tp.duration_days,
           tp.description,
           d.name as destination_name,
           d.country
    FROM   bookings b
           LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id
           LEFT JOIN destinations d ON tp.destination_id = d.id
    WHERE  b.id = ${bookingId}
    AND    b.customer_email = ${clientEmail}
    AND    b.status IN ('confirmed', 'completed')
  `
  return (result[0] as Booking) || null
}

interface InvoicePageProps {
  params: { id: string }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const session = await getClientSession()

  if (!session) {
    redirect("/auth/login")
  }

  const invoice = await getInvoiceData(params.id, session.email)

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invoice tidak ditemukan</h1>
          <Link href="/dashboard/invoices">
            <Button>Kembali ke Invoice</Button>
          </Link>
        </div>
      </div>
    )
  }

  const invoiceNumber = `INV-${invoice.id.toString().padStart(6, "0")}`

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
                <p className="text-xs text-gray-500">Invoice Detail</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 print:hidden">
          <Link href="/dashboard/invoices" className="flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Invoice
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">{invoiceNumber}</span>
        </div>

        {/* Invoice */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-lg" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kyodai Tour&Travel</h1>
                    <p className="text-sm text-gray-600">Explore Indonesia</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Jl. Wisata Indah No. 123</p>
                  <p>Jakarta Selatan, 12345</p>
                  <p>Indonesia</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
                <p className="text-lg font-semibold text-blue-600">{invoiceNumber}</p>
                <p className="text-sm text-gray-600">
                  Tanggal: {new Date(invoice.booking_date).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Tagihan Kepada:</h3>
                <div className="text-gray-600">
                  <p className="font-medium">{invoice.customer_name}</p>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{invoice.customer_email}</span>
                  </div>
                  {invoice.customer_phone && (
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{invoice.customer_phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Detail Perjalanan:</h3>
                <div className="text-gray-600">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Keberangkatan: {new Date(invoice.departure_date).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Peserta: {invoice.participants} orang</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Destinasi: {invoice.destination_name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Details */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="flex items-start space-x-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={invoice.image_url || "/placeholder.svg?height=96&width=96"}
                    alt={invoice.tour_title || "Tour"}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{invoice.tour_title}</h3>
                  <p className="text-gray-600 text-sm">{invoice.description}</p>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold text-gray-800">Deskripsi</th>
                    <th className="text-center py-3 font-semibold text-gray-800">Qty</th>
                    <th className="text-right py-3 font-semibold text-gray-800">Harga Satuan</th>
                    <th className="text-right py-3 font-semibold text-gray-800">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{invoice.tour_title}</p>
                        <p className="text-sm text-gray-600">Paket tour {invoice.duration_days} hari</p>
                      </div>
                    </td>
                    <td className="text-center py-4">{invoice.participants}</td>
                    <td className="text-right py-4">
                      Rp {(invoice.total_price / invoice.participants).toLocaleString("id-ID")}
                    </td>
                    <td className="text-right py-4 font-semibold">Rp {invoice.total_price.toLocaleString("id-ID")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>Rp {invoice.total_price.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Pajak (0%):</span>
                  <span>Rp 0</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-orange-500">Rp {invoice.total_price.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <h4 className="font-semibold text-blue-800 mb-2">Catatan:</h4>
                <p className="text-blue-700">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 border-t pt-6">
              <p className="mb-2">Terima kasih telah mempercayai Kyodai Tour&Travel!</p>
              <p>Untuk pertanyaan, hubungi kami di info@kyodaitourtravel.com atau +62 812-3456-7890</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
