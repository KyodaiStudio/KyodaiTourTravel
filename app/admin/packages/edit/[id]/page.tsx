import { notFound, redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { getAdminSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import Image from "next/image"

interface TourPackage {
  id: number
  title: string
  description: string
  price: number
  duration_days: number
  max_participants: number
  category_id: number
  destination_id: number
  image_url: string
  itinerary: string
  includes: string
  excludes: string
  is_active: boolean
}

interface Category {
  id: number
  name: string
}

interface Destination {
  id: number
  name: string
}

async function getPackage(id: string): Promise<TourPackage | null> {
  const result = await sql`
    SELECT * FROM tour_packages WHERE id = ${id}
  `
  return result.length > 0 ? (result[0] as TourPackage) : null
}

async function getCategories(): Promise<Category[]> {
  const result = await sql`
    SELECT id, name FROM categories ORDER BY name
  `
  return result as Category[]
}

async function getDestinations(): Promise<Destination[]> {
  const result = await sql`
    SELECT id, name FROM destinations ORDER BY name
  `
  return result as Destination[]
}

async function updatePackage(formData: FormData) {
  "use server"

  const session = await getAdminSession()
  if (!session) {
    redirect("/admin/login")
  }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const duration_days = Number.parseInt(formData.get("duration_days") as string)
  const max_participants = Number.parseInt(formData.get("max_participants") as string)
  const category_id = Number.parseInt(formData.get("category_id") as string)
  const destination_id = Number.parseInt(formData.get("destination_id") as string)
  const image_url = formData.get("image_url") as string
  const itinerary = formData.get("itinerary") as string
  const includes = formData.get("includes") as string
  const excludes = formData.get("excludes") as string
  const is_active = formData.get("is_active") === "on"

  try {
    await sql`
      UPDATE tour_packages 
      SET title = ${title},
          description = ${description},
          price = ${price},
          duration_days = ${duration_days},
          max_participants = ${max_participants},
          category_id = ${category_id},
          destination_id = ${destination_id},
          image_url = ${image_url},
          itinerary = ${itinerary},
          includes = ${includes},
          excludes = ${excludes},
          is_active = ${is_active}
      WHERE id = ${id}
    `

    redirect("/admin/packages")
  } catch (error) {
    console.error("Error updating package:", error)
    throw new Error("Failed to update package")
  }
}

export default async function EditPackagePage({ params }: { params: { id: string } }) {
  const session = await getAdminSession()
  if (!session) {
    redirect("/admin/login")
  }

  const packageData = await getPackage(params.id)
  if (!packageData) {
    notFound()
  }

  const [categories, destinations] = await Promise.all([getCategories(), getDestinations()])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/packages" className="text-blue-600 hover:text-blue-800">
            ← Kembali ke Daftar Paket
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Paket Tour</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit: {packageData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updatePackage} className="space-y-6">
              <input type="hidden" name="id" value={packageData.id} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Paket</Label>
                  <Input id="title" name="title" defaultValue={packageData.title} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input id="price" name="price" type="number" defaultValue={packageData.price} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_days">Durasi (Hari)</Label>
                  <Input
                    id="duration_days"
                    name="duration_days"
                    type="number"
                    defaultValue={packageData.duration_days}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_participants">Maksimal Peserta</Label>
                  <Input
                    id="max_participants"
                    name="max_participants"
                    type="number"
                    defaultValue={packageData.max_participants}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategori</Label>
                  <Select name="category_id" defaultValue={packageData.category_id.toString()}>
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
                  <Label htmlFor="destination_id">Destinasi</Label>
                  <Select name="destination_id" defaultValue={packageData.destination_id.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih destinasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((destination) => (
                        <SelectItem key={destination.id} value={destination.id.toString()}>
                          {destination.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL Gambar</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  defaultValue={packageData.image_url}
                  placeholder="https://example.com/image.jpg"
                />
                {packageData.image_url && (
                  <div className="mt-2">
                    <Image
                      src={packageData.image_url || "/placeholder.svg"}
                      alt="Preview"
                      width={200}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={packageData.description}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itinerary">Itinerary</Label>
                <Textarea
                  id="itinerary"
                  name="itinerary"
                  rows={6}
                  defaultValue={packageData.itinerary}
                  placeholder="Day 1: ...&#10;Day 2: ..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="includes">Termasuk</Label>
                <Textarea
                  id="includes"
                  name="includes"
                  rows={4}
                  defaultValue={packageData.includes}
                  placeholder="Hotel, Transport, Guide, dll"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excludes">Tidak Termasuk</Label>
                <Textarea
                  id="excludes"
                  name="excludes"
                  rows={4}
                  defaultValue={packageData.excludes}
                  placeholder="Tiket pesawat, Makan siang, dll"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="is_active" name="is_active" defaultChecked={packageData.is_active} />
                <Label htmlFor="is_active">Paket Aktif</Label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Simpan Perubahan
                </Button>
                <Link href="/admin/packages">
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
