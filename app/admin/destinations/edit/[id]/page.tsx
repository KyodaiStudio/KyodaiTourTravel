"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Destination {
  id: number
  name: string
  country: string
  description: string
  image_url: string
}

export default function EditDestinationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    const loadDestination = async () => {
      try {
        const response = await fetch(`/api/admin/destinations/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setDestination(data)
          setFormData({
            name: data.name || "",
            country: data.country || "",
            description: data.description || "",
            image_url: data.image_url || "",
          })
        } else {
          toast.error("Destinasi tidak ditemukan")
          router.push("/admin/destinations")
        }
      } catch (error) {
        console.error("Error loading destination:", error)
        toast.error("Gagal memuat data destinasi")
      }
    }

    loadDestination()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/destinations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Destinasi berhasil diperbarui!")
        router.push("/admin/destinations")
      } else {
        const error = await response.json()
        toast.error(error.message || "Gagal memperbarui destinasi")
      }
    } catch (error) {
      console.error("Error updating destination:", error)
      toast.error("Terjadi kesalahan saat memperbarui destinasi")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data destinasi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/destinations">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Kelola Destinasi
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Destinasi</h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Form Edit Destinasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Destinasi *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Masukkan nama destinasi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Negara *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Indonesia"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Deskripsi lengkap destinasi"
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

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
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
