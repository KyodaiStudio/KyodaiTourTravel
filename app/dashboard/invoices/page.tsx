import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, Calendar } from "lucide-react"
import { getClientSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { logoutUser } from "@/app/actions/auth"
import type { Booking } from "@/lib/types"

async function getClientInvoices(clientEmail: string): Promise<Booking[]> {
  const result = await sql`
    SELECT b.*, tp.title AS tour_title,
           tp.image_url,
           tp.duration_days,
           d.name as destination_name
    FROM   bookings b
           LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id
           LEFT JOIN destinations d ON tp.destination_id = d.id
    WHERE  b.customer_email = ${clientEmail}
    AND    b.status IN ('confirmed', 'completed')
    ORDER  BY b.booking_date DESC
  `
  return result as Booking[]
}

export default async function InvoicesPage() {
  const session = await getClientSession()

  if (!session) {
    redirect("/auth/login")
  }

  const invoices = await getClientInvoices(session.email)

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
                <p className="text-xs text-gray-500">Invoice</p>
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
          <span className="text-gray-700">Invoice</span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Invoice & Pembayaran</h1>
          <p className="text-xl text-gray-600">Download invoice untuk booking yang sudah dikonfirmasi</p>
        </div>

        {/* Invoices List */}
        <div className="grid gap-6">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{invoice.tour_title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(invoice.booking_date).toLocaleDateString("id-ID")}</span>
                        </div>
                        <Badge variant={invoice.status === "confirmed" ? "default" : "secondary"}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-500 mb-2">
                      Rp {invoice.total_price.toLocaleString("id-ID")}
                    </div>
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {invoices.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Invoice</h3>
              <p className="text-gray-600 mb-6">Invoice akan tersedia setelah booking Anda dikonfirmasi</p>
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
