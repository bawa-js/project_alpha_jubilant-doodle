'use client'

import React from 'react'
import type { CartItem } from '@/lib/store/cart-store'

export interface StockInfo {
  productId: string
  currentStock: number
  isOutOfStock: boolean
  exceedsStock: boolean
  availableQuantity: number
}

export type StockMap = Map<string, StockInfo>

interface UseCartStockReturn {
  stockMap: StockMap
  isLoading: boolean
  hasStockIssues: boolean
  refetch: () => void
}

/**
 * Fetches current stock levels for cart items
 * Returns stock info map and loading state
 * Designed for use in cart and checkout components to validate stock before purchase directly from Sanity, ensuring real-time accuracy
 */
export function useCartStock(items: CartItem[]): UseCartStockReturn {
  const [stockMap, setStockMap] = React.useState<StockMap>(new Map())
  const [isLoading, setIsLoading] = React.useState(false)

  const refetch = React.useRef<() => void>(() => {})

  React.useEffect(() => {
    let cancelled = false

    async function fetchStock() {
      if (items.length === 0) {
        setStockMap(new Map())
        return
      }

      setIsLoading(true)

      try {
        const productIds = items.map((item) => item.productId)

        const res = await fetch('/api/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: productIds }),
        })

        if (!res.ok) {
          throw new Error('Failed to fetch stock')
        }

        const products = await res.json()

        if (cancelled) return

        const map = new Map<string, StockInfo>()

        for (const item of items) {
          const product = products.find((p: { _id: string }) => p._id === item.productId)

          const currentStock = product?.stock ?? 0

          map.set(item.productId, {
            productId: item.productId,
            currentStock,
            isOutOfStock: currentStock === 0,
            exceedsStock: item.quantity > currentStock,
            availableQuantity: Math.min(item.quantity, currentStock),
          })
        }

        setStockMap(map)
      } catch (error) {
        console.error('Failed to fetch stock:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    refetch.current = fetchStock

    fetchStock()

    return () => {
      cancelled = true
    }
  }, [items])

  const hasStockIssues = Array.from(stockMap.values()).some((info) => info.isOutOfStock || info.exceedsStock)

  return { stockMap, isLoading, hasStockIssues, refetch: () => refetch.current() }
}
