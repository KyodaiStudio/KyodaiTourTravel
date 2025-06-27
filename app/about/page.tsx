import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Shield } from "lucide-react"

export default function AboutPage() {
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
              <Link href="/destinations" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Destinasi
              </Link>
              <Link href="/about" className="text-blue-600 font-semibold">
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
          <h1 className="text-5xl font-bold mb-6">Tentang Kyodai Tour&Travel</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Kami adalah perusahaan tour dan travel terpercaya yang telah melayani ribuan wisatawan untuk menjelajahi
            keindahan Indonesia sejak 2014.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Cerita Kami</h2>
              <p className="text-lg text-gray-600 mb-6">
                Kyodai Tour&Travel didirikan dengan visi untuk memperkenalkan keindahan Indonesia kepada dunia. Kami
                percaya bahwa setiap perjalanan adalah kesempatan untuk menciptakan kenangan yang tak terlupakan.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Dengan pengalaman lebih dari 10 tahun, kami telah melayani lebih dari 50.000 wisatawan dari berbagai
                negara. Tim profesional kami berkomitmen untuk memberikan pelayanan terbaik dan pengalaman wisata yang
                berkesan.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50K+</div>
                  <div className="text-gray-600">Wisatawan Dilayani</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">98%</div>
                  <div className="text-gray-600">Tingkat Kepuasan</div>
                </div>
              </div>
            </div>
            <div className="relative h-96">
              <Image
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600"
                alt="About Us"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nilai-Nilai Kami</h2>
            <p className="text-xl text-gray-600">Prinsip yang memandu setiap langkah perjalanan kami</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Pelayanan Tulus</h3>
                <p className="text-gray-600">
                  Kami melayani dengan sepenuh hati, memastikan setiap detail perjalanan Anda diperhatikan dengan baik.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Keamanan Terjamin</h3>
                <p className="text-gray-600">
                  Keselamatan dan kenyamanan Anda adalah prioritas utama dalam setiap perjalanan yang kami
                  selenggarakan.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Kualitas Terbaik</h3>
                <p className="text-gray-600">
                  Kami berkomitmen memberikan pengalaman wisata berkualitas tinggi dengan standar pelayanan
                  internasional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Tim Profesional Kami</h2>
            <p className="text-xl text-gray-600">Berpengalaman dan berdedikasi untuk perjalanan terbaik Anda</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                    alt="CEO"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Budi Santoso</h3>
                <p className="text-blue-600 mb-2">CEO & Founder</p>
                <p className="text-gray-600 text-sm">15+ tahun pengalaman di industri pariwisata Indonesia</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
                    alt="Operations Manager"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sari Dewi</h3>
                <p className="text-blue-600 mb-2">Operations Manager</p>
                <p className="text-gray-600 text-sm">Ahli dalam perencanaan dan koordinasi perjalanan wisata</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                    alt="Tour Guide"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Andi Wijaya</h3>
                <p className="text-blue-600 mb-2">Senior Tour Guide</p>
                <p className="text-gray-600 text-sm">Guide berpengalaman dengan sertifikasi internasional</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Siap Berpetualang Bersama Kami?</h2>
          <p className="text-xl mb-8">Mari ciptakan kenangan indah di destinasi impian Anda</p>
          <div className="space-x-4">
            <Link href="/packages">
              <Button size="lg" variant="secondary">
                Lihat Paket Tour
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-gray-800 bg-transparent"
              >
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
