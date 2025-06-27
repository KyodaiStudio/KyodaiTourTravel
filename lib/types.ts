export interface TourPackage {
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
  created_at: string
  category_name?: string
  destination_name?: string
}

export interface Destination {
  id: number
  name: string
  country: string
  description: string
  image_url: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  description: string
  created_at: string
}

export interface Booking {
  id: number
  client_id?: number
  customer_name: string
  customer_email: string
  customer_phone: string
  tour_package_id: number
  departure_date: string
  participants: number
  total_price: number
  status: string
  payment_status: string
  booking_date: string
  notes?: string
  invoice_number?: string
  tour_package_title?: string
}

export interface Review {
  id: number
  tour_package_id: number
  client_id?: number
  customer_name: string
  rating: number
  comment: string
  created_at: string
}

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
  created_at: string
}

export interface Client {
  id: number
  email: string
  name: string
  phone?: string
  address?: string
  created_at: string
}
