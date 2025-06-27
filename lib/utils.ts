import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID").format(price)
}

export function formatCurrency(price: number): string {
  return `Rp ${formatPrice(price)}`
}
