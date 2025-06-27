import Link from "next/link"
import Image from "next/image"

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Syarat dan Ketentuan</h1>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Penerimaan Syarat</h2>
              <p className="text-gray-600 leading-relaxed">
                Dengan menggunakan layanan Kyodai Tour&Travel, Anda menyetujui untuk terikat oleh syarat dan ketentuan
                yang berlaku.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Pemesanan dan Pembayaran</h2>
              <p className="text-gray-600 leading-relaxed">
                Semua pemesanan harus dikonfirmasi dengan pembayaran sesuai dengan ketentuan yang berlaku. Pembayaran
                dapat dilakukan melalui transfer bank atau metode pembayaran lain yang tersedia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Pembatalan dan Pengembalian Dana</h2>
              <p className="text-gray-600 leading-relaxed">
                Pembatalan dapat dilakukan dengan ketentuan sebagai berikut:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>30 hari sebelum keberangkatan: pengembalian 100%</li>
                <li>15-29 hari sebelum keberangkatan: pengembalian 75%</li>
                <li>7-14 hari sebelum keberangkatan: pengembalian 50%</li>
                <li>Kurang dari 7 hari: tidak ada pengembalian</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Tanggung Jawab</h2>
              <p className="text-gray-600 leading-relaxed">
                Kyodai Tour&Travel bertanggung jawab untuk memberikan layanan sesuai dengan yang dijanjikan. Namun, kami
                tidak bertanggung jawab atas kejadian di luar kendali kami seperti cuaca buruk, bencana alam, atau
                keadaan kahar lainnya.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Perubahan Itinerary</h2>
              <p className="text-gray-600 leading-relaxed">
                Kyodai Tour&Travel berhak mengubah itinerary jika diperlukan karena alasan keamanan, cuaca, atau kondisi
                lain yang tidak dapat dihindari. Kami akan berusaha memberikan alternatif terbaik.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Asuransi Perjalanan</h2>
              <p className="text-gray-600 leading-relaxed">
                Kami sangat menyarankan semua peserta untuk memiliki asuransi perjalanan yang memadai. Kyodai
                Tour&Travel tidak bertanggung jawab atas biaya medis atau kehilangan barang pribadi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Kontak</h2>
              <p className="text-gray-600 leading-relaxed">
                Untuk pertanyaan lebih lanjut mengenai syarat dan ketentuan ini, silakan hubungi kami di
                info@tourtravel.com atau +62 812-3456-7890.
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
