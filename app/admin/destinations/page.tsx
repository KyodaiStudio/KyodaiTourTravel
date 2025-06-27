"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, Plus, Edit, Trash2, Eye, Search } from "lucide-react"
import type { Destination } from "@/lib/types"

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/admin/destinations")
      if (response.ok) {
        const data = await response.json()
        setDestinations(data)
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDestination = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus destinasi ini?")) return

    try {
      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setDestinations(destinations.filter((dest) => dest.id !== id))
      }
    } catch (error) {
      console.error("Error deleting destination:", error)
    }
  }

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(search.toLowerCase()) ||
      dest.country.toLowerCase().includes(search.toLowerCase()),
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
              <h1 className="text-2xl font-bold text-gray-800">Kelola Destinasi</h1>
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
            <Button variant="outline">Kelola Paket</Button>
          </Link>
          <Link href="/admin/bookings">
            <Button variant="outline">Kelola Booking</Button>
          </Link>
          <Link href="/admin/destinations">
            <Button variant="default">Kelola Destinasi</Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari destinasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/admin/destinations/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Destinasi
            </Button>
          </Link>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <Card key={dest.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={dest.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={dest.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{dest.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{dest.country}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dest.description}</p>
                <div className="flex gap-2">
                  <Link href={`/admin/destinations/edit/${dest.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => deleteDestination(dest.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              {search ? "Tidak ada destinasi yang ditemukan" : "Belum ada destinasi"}
            </p>
            <Link href="/admin/destinations/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Destinasi Pertama
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
