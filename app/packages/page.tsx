import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Users, Search } from "lucide-react"
import { sql } from "@/lib/db"
import { getClientSession } from "@/lib/auth"
import { formatCurrency } from "@/lib/utils"
import type { TourPackage, Category, Destination } from "@/lib/types"

async function getPackages(search?: string, category?: string, destination?: string): Promise<TourPackage[]> {
  try {
    // SIMPLE - ambil semua data dulu
    const allPackages = await sql`
      SELECT tp.*, c.name as category_name, d.name as destination_name
      FROM tour_packages tp
      LEFT JOIN categories c ON tp.category_id = c.id
      LEFT JOIN destinations d ON tp.destination_id = d.id
      WHERE tp.is_active = true
      ORDER BY tp.created_at DESC
    `

    // Filter di JavaScript (lebih simple dan pasti jalan)
    let filtered = allPackages as TourPackage[]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (pkg) => pkg.title.toLowerCase().includes(searchLower) || pkg.description.toLowerCase().includes(searchLower),
      )
    }

    if (category && category !== "all") {
      filtered = filtered.filter((pkg) => pkg.category_name === category)
    }

    if (destination && destination !== "all") {
      filtered = filtered.filter((pkg) => pkg.destination_name === destination)
    }

    return filtered
  } catch (error) {
    console.error("Error fetching packages:", error)
    return [] // Return empty array jika error
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const result = await sql`SELECT * FROM categories ORDER BY name`
    return result as Category[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

async function getDestinations(): Promise<Destination[]> {
  try {
    const result = await sql`SELECT * FROM destinations ORDER BY name`
    return result as Destination[]
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return []
  }
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PackagesPage({ searchParams }: PageProps) {
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : "all"
  const destination = typeof searchParams.destination === "string" ? searchParams.destination : "all"

  const packages = await getPackages(search, category, destination)
  const categories = await getCategories()
  const destinations = await getDestinations()
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
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/packages" className="text-blue-600 font-semibold">
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Paket Tour</h1>
          <p className="text-xl text-gray-600">Temukan paket wisata impian Anda</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form method="GET" className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input name="search" placeholder="Cari paket tour..." defaultValue={search} className="pl-10" />
            </div>
            <Select name="category" defaultValue={category}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select name="destination" defaultValue={destination}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Destinasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Destinasi</SelectItem>
                {destinations.map((dest) => (
                  <SelectItem key={dest.id} value={dest.name}>
                    {dest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Cari</Button>
          </form>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages && packages.length > 0 ? (
            packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={pkg.image_url || "/placeholder.svg?height=200&width=400"}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-orange-500">{pkg.category_name}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{pkg.destination_name}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{pkg.duration_days} Hari</span>
                    <Users className="h-4 w-4 ml-4 mr-1" />
                    <span className="text-sm">Max {pkg.max_participants} orang</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-orange-500">{formatCurrency(pkg.price)}</span>
                      <span className="text-gray-500 text-sm">/orang</span>
                    </div>
                    <Link href={`/packages/${pkg.id}`}>
                      <Button>Lihat Detail</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">Tidak ada paket tour yang ditemukan</p>
            </div>
          )}
        </div>

        {(!packages || packages.length === 0) && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Tidak ada paket tour yang ditemukan</p>
            <Link href="/packages">
              <Button className="mt-4 bg-transparent" variant="outline">
                Reset Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
