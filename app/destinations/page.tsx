import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"
import { sql } from "@/lib/db"
import type { Destination } from "@/lib/types"

async function getDestinations(): Promise<Destination[]> {
  const result = await sql`
    SELECT * FROM destinations
    ORDER BY name ASC
  `
  return result as Destination[]
}

async function getDestinationStats(destinationId: number) {
  const result = await sql`
    SELECT COUNT(*) as package_count
    FROM tour_packages
    WHERE destination_id = ${destinationId} AND is_active = true
  `
  return Number.parseInt(result[0].package_count)
}

export default async function DestinationsPage() {
  const destinations = await getDestinations()

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
              <Link href="/packages" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Paket Tour
              </Link>
              <Link href="/destinations" className="text-blue-600 font-semibold">
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
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Destinasi Wisata Indonesia</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Jelajahi keindahan alam dan budaya Indonesia yang memukau. Dari pantai eksotis hingga pegunungan yang
            menawan.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>

          {destinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Destinasi akan segera hadir!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

async function DestinationCard({ destination }: { destination: Destination }) {
  const packageCount = await getDestinationStats(destination.id)

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-64">
        <Image
          src={destination.image_url || "/placeholder.svg?height=300&width=400"}
          alt={destination.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold">{destination.name}</h3>
          <p className="text-sm opacity-90">{destination.country}</p>
        </div>
      </div>
      <CardContent className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-3">{destination.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Package className="h-4 w-4 mr-2" />
            <span className="text-sm">{packageCount} paket tour</span>
          </div>
          <Link href={`/packages?destination=${encodeURIComponent(destination.name)}`}>
            <Button size="sm">Lihat Paket</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
