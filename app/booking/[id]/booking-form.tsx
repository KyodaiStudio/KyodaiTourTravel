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
import { Separator } from "@/components/ui/separator"
import { CreditCard } from "lucide-react"
import type { TourPackage } from "@/lib/types"

interface BookingFormProps {
  pkg: TourPackage
  session: any
}

export function BookingForm({ pkg, session }: BookingFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [participants, setParticipants] = useState(1)
  const [formData, setFormData] = useState({
    departureDate: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: session.name,
          customerEmail: session.email,
          customerPhone: session.phone || "",
          tourPackageId: pkg.id,
          participants,
          totalPrice: pkg.price * participants,
          departureDate: formData.departureDate,
          notes: formData.notes,
        }),
      })

      if (response.ok) {
        // Redirect to dashboard instead of success page
        router.push("/dashboard?booking=success")
      } else {
        alert("Terjadi kesalahan saat memproses booking")
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
      alert("Terjadi kesalahan saat memproses booking")
    } finally {
      setSubmitting(false)
    }
  }

  const totalPrice = pkg.price * participants

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pre-filled User Data (Read-only) */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">Data Pemesan</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-blue-700">Nama Lengkap</Label>
                <Input value={session.name} disabled className="bg-white" />
              </div>
              <div>
                <Label className="text-sm text-blue-700">Email</Label>
                <Input value={session.email} disabled className="bg-white" />
              </div>
            </div>
            {session.phone && (
              <div className="mt-4">
                <Label className="text-sm text-blue-700">No. Telepon</Label>
                <Input value={session.phone} disabled className="bg-white" />
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="participants">Jumlah Peserta *</Label>
              <Select
                value={participants.toString()}
                onValueChange={(value) => setParticipants(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(pkg.max_participants)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} orang
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="departureDate">Tanggal Keberangkatan *</Label>
              <Input
                id="departureDate"
                type="date"
                required
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Catatan Tambahan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Permintaan khusus, alergi makanan, dll."
              rows={3}
            />
          </div>

          <Separator />

          {/* Total Price */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total Pembayaran</span>
              <span className="text-orange-500">Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {participants} peserta × Rp {pkg.price.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">Informasi Pembayaran</h3>
            </div>
            <p className="text-blue-700 text-sm">
              Setelah booking dikonfirmasi, Anda akan menerima instruksi pembayaran melalui email. Pembayaran dapat
              dilakukan melalui transfer bank atau payment gateway yang tersedia.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full bg-orange-500 hover:bg-orange-600" disabled={submitting}>
            {submitting ? "Memproses..." : "Konfirmasi Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
