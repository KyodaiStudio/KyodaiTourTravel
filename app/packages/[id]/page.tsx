import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Users, Star, Calendar, CheckCircle, XCircle } from "lucide-react"
import { sql } from "@/lib/db"
import { formatCurrency } from "@/lib/utils"
import type { TourPackage, Review } from "@/lib/types"
import { notFound } from "next/navigation"

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

async function getPackageReviews(packageId: string): Promise<Review[]> {
  const result = await sql`
    SELECT * FROM reviews
    WHERE tour_package_id = ${packageId}
    ORDER BY created_at DESC
  `
  return result as Review[]
}

async function getRelatedPackages(categoryId: number, currentId: string): Promise<TourPackage[]> {
  const result = await sql`
    SELECT tp.*, c.name as category_name, d.name as destination_name
    FROM tour_packages tp
    LEFT JOIN categories c ON tp.category_id = c.id
    LEFT JOIN destinations d ON tp.destination_id = d.id
    WHERE tp.category_id = ${categoryId} AND tp.id != ${currentId} AND tp.is_active = true
    ORDER BY tp.created_at DESC
    LIMIT 3
  `
  return result as TourPackage[]
}

interface PageProps {
  params: { id: string }
}

export default async function PackageDetailPage({ params }: PageProps) {
  const pkg = await getPackage(params.id)

  if (!pkg) {
    notFound()
  }

  const reviews = await getPackageReviews(params.id)
  const relatedPackages = await getRelatedPackages(pkg.category_id, params.id)

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const itineraryItems = pkg.itinerary ? pkg.itinerary.split("\n").filter((item) => item.trim()) : []
  const includesItems = pkg.includes ? pkg.includes.split(",").map((item) => item.trim()) : []
  const excludesItems = pkg.excludes ? pkg.excludes.split(",").map((item) => item.trim()) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="Kyodai Tour&Travel Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-gray-800">Kyodai Tour&Travel</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link href="/packages" className="text-blue-600 font-semibold">
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
          <Link href="/admin">
            <Button variant="outline">Admin</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link href="/packages" className="text-gray-500 hover:text-gray-700">
                  Paket Tour
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-900">{pkg.title}</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={pkg.image_url || "/placeholder.svg?height=400&width=800"}
                alt={pkg.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-orange-500 text-white">{pkg.category_name}</Badge>
            </div>

            {/* Package Info */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{pkg.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{pkg.destination_name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{pkg.duration_days} Hari</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Max {pkg.max_participants} orang</span>
                </div>
                {reviews.length > 0 && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">({reviews.length} review)</span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">{pkg.description}</p>

              {/* Itinerary */}
              {itineraryItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Itinerary</h3>
                  <div className="space-y-3">
                    {itineraryItems.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Includes & Excludes */}
              <div className="grid md:grid-cols-2 gap-6">
                {includesItems.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-green-600">Termasuk</h3>
                    <ul className="space-y-2">
                      {includesItems.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {excludesItems.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-red-600">Tidak Termasuk</h3>
                    <ul className="space-y-2">
                      {excludesItems.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Review Pelanggan</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{review.customer_name}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <Card className="sticky top-4 mb-6">
              <CardHeader>
                <CardTitle className="text-center">
                  <span className="text-3xl font-bold text-orange-500">{formatCurrency(pkg.price)}</span>
                  <span className="text-gray-500 text-lg">/orang</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/booking/${pkg.id}`}>
                  <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Beli Paket Tour
                  </Button>
                </Link>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Konfirmasi instan</p>
                  <p>✓ Pembatalan gratis 24 jam</p>
                  <p>✓ Guide berpengalaman</p>
                  <p>✓ Asuransi perjalanan</p>
                </div>
              </CardContent>
            </Card>

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Paket Serupa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedPackages.map((relatedPkg) => (
                      <Link key={relatedPkg.id} href={`/packages/${relatedPkg.id}`}>
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={relatedPkg.image_url || "/placeholder.svg?height=64&width=64"}
                              alt={relatedPkg.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">{relatedPkg.title}</h4>
                            <p className="text-orange-500 font-semibold text-sm">{formatCurrency(relatedPkg.price)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
