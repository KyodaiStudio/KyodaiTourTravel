import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react"
import { sql } from "@/lib/db"
import { getClientSession } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils"
import type { TourPackage, Review } from "@/lib/types"

async function getFeaturedPackages(): Promise<TourPackage[]> {
  const result = await sql`
    SELECT tp.*, c.name as category_name, d.name as destination_name
    FROM tour_packages tp
    LEFT JOIN categories c ON tp.category_id = c.id
    LEFT JOIN destinations d ON tp.destination_id = d.id
    WHERE tp.is_active = true
    ORDER BY tp.created_at DESC
    LIMIT 6
  `
  return result as TourPackage[]
}

async function getReviews(): Promise<Review[]> {
  const result = await sql`
    SELECT * FROM reviews
    ORDER BY created_at DESC
    LIMIT 6
  `
  return result as Review[]
}

export default async function HomePage() {
  const featuredPackages = await getFeaturedPackages()
  const reviews = await getReviews()
  const session = await getClientSession()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Kyodai Tour&Travel Logo" width={32} height={32} className="rounded-lg" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Kyodai Tour&Travel
                </span>
                <p className="text-xs text-gray-500">Explore Indonesia</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-blue-600 font-semibold">
                Home
              </Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Paket Tour
              </Link>
              <Link href="/destinations" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Destinasi
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Tentang
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Kontak
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[700px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"
            alt="Travel Hero"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Jelajahi Keindahan
              <span className="block text-yellow-300">Indonesia Bersama Kami</span>
            </h1>
            <p className="text-xl mb-8 leading-relaxed opacity-90">
              Temukan pengalaman wisata tak terlupakan dengan paket tour terbaik ke destinasi menakjubkan di seluruh
              Indonesia. Mulai petualangan Anda hari ini!
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/packages">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
                  Lihat Paket Tour
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-2 border-white hover:bg-white hover:text-gray-800 bg-transparent px-8 py-4 text-lg"
                >
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Paket Tour Unggulan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pilihan terbaik untuk liburan impian Anda dengan destinasi eksotis dan pengalaman tak terlupakan
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-56">
                  <Image
                    src={pkg.image_url || "/placeholder.svg?height=200&width=400"}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1">
                    {pkg.category_name}
                  </Badge>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{pkg.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">{pkg.destination_name}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm">{pkg.duration_days} Hari</span>
                    <Users className="h-4 w-4 ml-4 mr-2 text-purple-600" />
                    <span className="text-sm">Max {pkg.max_participants} orang</span>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-2">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-orange-500">{formatCurrency(pkg.price)}</span>
                      <span className="text-gray-500 text-sm">/orang</span>
                    </div>
                    <Link href={`/packages/${pkg.id}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Lihat Detail
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/packages">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 bg-transparent">
                Lihat Semua Paket
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Mengapa Memilih Kami?</h2>
            <p className="text-xl text-gray-600">Kepercayaan dan kepuasan Anda adalah prioritas utama kami</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Star className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pengalaman Terpercaya</h3>
              <p className="text-gray-600 text-lg">
                Lebih dari 10 tahun melayani wisatawan dengan kepuasan 98% dan ribuan testimoni positif
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Guide Profesional</h3>
              <p className="text-gray-600 text-lg">
                Tim guide berpengalaman dan berlisensi resmi dengan pengetahuan mendalam tentang setiap destinasi
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Destinasi Lengkap</h3>
              <p className="text-gray-600 text-lg">
                Jangkauan ke seluruh destinasi wisata terbaik Indonesia dengan paket yang dapat disesuaikan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Testimoni Pelanggan</h2>
            <p className="text-xl text-gray-600">Apa kata mereka tentang pengalaman bersama kami</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-lg italic">"{review.comment}"</p>
                  <div className="font-semibold text-lg text-gray-800">{review.customer_name}</div>
                  <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString("id-ID")}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Siap Memulai Petualangan?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Hubungi kami sekarang dan dapatkan penawaran terbaik untuk liburan impian Anda!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 mb-12">
            <div className="flex items-center text-lg">
              <Phone className="h-6 w-6 mr-3" />
              <span>+62 812-3456-7890</span>
            </div>
            <div className="flex items-center text-lg">
              <Mail className="h-6 w-6 mr-3" />
              <span>info@kyodaitourtravel.com</span>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Hubungi Sekarang
              </Button>
            </Link>
            <Link href="/packages">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-2 border-white hover:bg-white hover:text-gray-800 px-8 py-4 text-lg bg-transparent"
              >
                Lihat Paket Tour
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - IMPROVED DESIGN */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <Image
                  src="/logo.png?height=32&width=32"
                  alt="Kyodai Tour&Travel Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Kyodai Tour&Travel
                  </span>
                  <p className="text-sm text-gray-400">Explore Indonesia</p>
                </div>
              </Link>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Menyediakan layanan tour dan travel terbaik untuk pengalaman wisata tak terlupakan di seluruh Indonesia.
                Kepercayaan dan kepuasan Anda adalah prioritas utama kami.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Menu Utama</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="text-gray-300 hover:text-white transition-colors">
                    Paket Tour
                  </Link>
                </li>
                <li>
                  <Link href="/destinations" className="text-gray-300 hover:text-white transition-colors">
                    Destinasi
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-white">Kontak Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-blue-400" />
                  <span className="text-gray-300">
                    Jl. Wisata Indah No. 123
                    <br />
                    Jakarta Selatan, 12345
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-green-400" />
                  <span className="text-gray-300">+62 812-3456-7890</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-orange-400" />
                  <span className="text-gray-300">info@kyodaitourtravel.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2024 Kyodai Tour&Travel. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
