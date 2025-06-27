import Link from "next/link"
import Image from "next/image"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Kyodai Tour&Travel Logo" width={32} height={32} className="rounded-lg" />
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kyodai Tour&Travel
              </span>
              <p className="text-xs text-gray-500">Explore Indonesia</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Kebijakan Privasi</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-gray-600 leading-relaxed">
                Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti nama, email, nomor
                telepon, dan informasi lainnya yang diperlukan untuk pemesanan tour.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Penggunaan Informasi</h2>
              <p className="text-gray-600 leading-relaxed">
                Informasi yang kami kumpulkan digunakan untuk memproses pemesanan, memberikan layanan pelanggan, dan
                mengirimkan informasi terkait perjalanan Anda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Perlindungan Data</h2>
              <p className="text-gray-600 leading-relaxed">
                Kami berkomitmen untuk melindungi informasi pribadi Anda dengan menggunakan langkah-langkah keamanan
                yang sesuai untuk mencegah akses, penggunaan, atau pengungkapan yang tidak sah.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Berbagi Informasi</h2>
              <p className="text-gray-600 leading-relaxed">
                Kami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa
                persetujuan Anda, kecuali jika diperlukan untuk memberikan layanan yang Anda minta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Hak Anda</h2>
              <p className="text-gray-600 leading-relaxed">
                Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda. Untuk melakukan
                hal tersebut, silakan hubungi kami melalui informasi kontak yang tersedia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Kontak</h2>
              <p className="text-gray-600 leading-relaxed">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di info@tourtravel.com
                atau +62 812-3456-7890.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
