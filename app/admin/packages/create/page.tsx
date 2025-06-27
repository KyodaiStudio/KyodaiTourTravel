"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Category {
  id: number
  name: string
}

interface Destination {
  id: number
  name: string
  country: string
}

export default function CreatePackagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration_days: "",
    max_participants: "",
    category_id: "",
    destination_id: "",
    image_url: "",
    itinerary: "",
    includes: "",
    excludes: "",
  })

  // Load categories and destinations
  useState(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, destinationsRes] = await Promise.all([
          fetch("/api/admin/categories"),
          fetch("/api/admin/destinations"),
        ])

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        if (destinationsRes.ok) {
          const destinationsData = await destinationsRes.json()
          setDestinations(destinationsData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          duration_days: Number.parseInt(formData.duration_days),
          max_participants: Number.parseInt(formData.max_participants),
          category_id: Number.parseInt(formData.category_id),
          destination_id: Number.parseInt(formData.destination_id),
        }),
      })

      if (response.ok) {
        toast.success("Paket tour berhasil ditambahkan!")
        router.push("/admin/packages")
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal menambahkan paket tour")
      }
    } catch (error) {
      console.error("Error creating package:", error)
      toast.error("Terjadi kesalahan saat menambahkan paket tour")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/packages">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Kelola Paket
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Paket Tour</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Form Tambah Paket Tour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Paket *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Masukkan judul paket tour"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Harga (Rp) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="2500000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_days">Durasi (Hari) *</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => handleInputChange("duration_days", e.target.value)}
                    placeholder="4"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_participants">Maksimal Peserta *</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => handleInputChange("max_participants", e.target.value)}
                    placeholder="20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategori *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange("category_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination_id">Destinasi *</Label>
                  <Select
                    value={formData.destination_id}
                    onValueChange={(value) => handleInputChange("destination_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih destinasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((destination) => (
                        <SelectItem key={destination.id} value={destination.id.toString()}>
                          {destination.name}, {destination.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Deskripsi lengkap paket tour"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL Gambar</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itinerary">Itinerary</Label>
                <Textarea
                  id="itinerary"
                  value={formData.itinerary}
                  onChange={(e) => handleInputChange("itinerary", e.target.value)}
                  placeholder="Day 1: Arrival - Check in hotel..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="includes">Termasuk</Label>
                  <Textarea
                    id="includes"
                    value={formData.includes}
                    onChange={(e) => handleInputChange("includes", e.target.value)}
                    placeholder="Hotel, Transport, Guide..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excludes">Tidak Termasuk</Label>
                  <Textarea
                    id="excludes"
                    value={formData.excludes}
                    onChange={(e) => handleInputChange("excludes", e.target.value)}
                    placeholder="Tiket pesawat, Makan siang..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Paket"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
