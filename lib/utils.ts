import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Format a price amount with the specified currency symbol.
 * @param amount The price amount to format and it would be number
 * @param currency The currency symbol to use
 * @returns The formatted price string
 */
export function formatPrice(amount: number | null, currency: string = '₹'): string | null {
  if (amount === null || amount === undefined) return null
  return `${currency}${amount.toFixed(2)}`
}
