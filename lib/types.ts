export interface TourPackage {
  id: number
  title: string
  description: string
  price: number
  duration_days: number
  max_participants: number
  image_url?: string
  category_id: number
  destination_id: number
  itinerary?: string
  includes?: string
  excludes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  category_name?: string
  destination_name?: string
  country?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Destination {
  id: number
  name: string
  country: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: number
  tour_package_id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  participants: number
  departure_date: string
  total_price: number
  status: "pending" | "confirmed" | "cancelled"
  payment_status: "pending" | "paid" | "failed"
  special_requests?: string
  booking_date: string
  created_at: string
  updated_at: string
  tour_title?: string
  image_url?: string
  duration_days?: number
}

export interface Review {
  id: number
  tour_package_id: number
  customer_name: string
  customer_email: string
  rating: number
  comment: string
  created_at: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone?: string
  password_hash: string
  created_at: string
  updated_at: string
}

export interface Admin {
  id: number
  username: string
  email: string
  password_hash: string
  role: string
  created_at: string
  updated_at: string
}
