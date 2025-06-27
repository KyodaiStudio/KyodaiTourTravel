"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, Plus, Edit, Trash2, Eye, Search } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { TourPackage } from "@/lib/types"

export default function AdminPackages() {
  const [packages, setPackages] = useState<TourPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/admin/packages")
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      }
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const deletePackage = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return

    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setPackages(packages.filter((pkg) => pkg.id !== id))
      }
    } catch (error) {
      console.error("Error deleting package:", error)
    }
  }

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(search.toLowerCase()) ||
      pkg.destination_name?.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Kelola Paket Tour</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/admin">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link href="/admin/packages">
            <Button variant="default">Kelola Paket</Button>
          </Link>
          <Link href="/admin/bookings">
            <Button variant="outline">Kelola Booking</Button>
          </Link>
          <Link href="/admin/destinations">
            <Button variant="outline">Kelola Destinasi</Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari paket tour..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/admin/packages/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Paket
            </Button>
          </Link>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={pkg.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-orange-500">{pkg.category_name}</Badge>
                <Badge className={`absolute top-4 right-4 ${pkg.is_active ? "bg-green-500" : "bg-red-500"}`}>
                  {pkg.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{pkg.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{pkg.destination_name}</p>
                <p className="text-lg font-bold text-orange-500 mb-4">{formatCurrency(pkg.price)}</p>
                <div className="flex gap-2">
                  <Link href={`/admin/packages/edit/${pkg.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => deletePackage(pkg.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              {search ? "Tidak ada paket yang ditemukan" : "Belum ada paket tour"}
            </p>
            <Link href="/admin/packages/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Paket Pertama
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
