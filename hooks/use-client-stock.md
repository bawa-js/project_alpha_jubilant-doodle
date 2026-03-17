## First we have created this component however due to sanityFetch from sanity live can only be used within server component else Next js will start complain hence due to that we have to move to the different approach for the use-cart-hook to check the live the stock from the sanity directly.

import { type CartItem } from '@/lib/store/cart-store' import { PRODUCTS_BY_IDS_QUERY } from
'@/lib/sanity-groq-queries/products' import { sanityFetch } from '@/sanity/lib/live'

export interface StockInfo { productId: string currentStock: number isOutOfStock: boolean exceedsStock:
boolean availableQuantity: number }

export type StockMap = Map<string, StockInfo>

interface GetCartStockReturn { stockMap: StockMap hasStockIssues: boolean }

/\*\*

- Fetches current stock levels for cart items (non-hook version)
- Useful for server-side validation or checkout logic \*/ export async function getCartStock( items:
  CartItem[] ): Promise<GetCartStockReturn> { if (!items.length) { return { stockMap: new Map(),
  hasStockIssues: false, } }

try { const productIds = items.map((item) => item.productId)

    const products = await sanityFetch({
      query: PRODUCTS_BY_IDS_QUERY,
      params: { ids: productIds },
    })

    const map: StockMap = new Map()

    for (const item of items) {
      const product = products.data.find(
        (p: { _id: string }) => p._id === item.productId
      )

      const currentStock = product?.stock ?? 0

      map.set(item.productId, {
        productId: item.productId,
        currentStock,
        isOutOfStock: currentStock === 0,
        exceedsStock: item.quantity > currentStock,
        availableQuantity: Math.min(item.quantity, currentStock),
      })
    }

    const hasStockIssues = Array.from(map.values()).some(
      (info) => info.isOutOfStock || info.exceedsStock
    )

    return {
      stockMap: map,
      hasStockIssues,
    }

} catch (error) { console.error('Failed to fetch stock:', error)

    return {
      stockMap: new Map(),
      hasStockIssues: true,
    }

} }

## The other way to do is to use the 'client' instead of 'sanityFetch' which can be used within 'use client' directive

"use client";

import { useEffect, useState, useCallback, useMemo } from "react"; import { client } from
"@/sanity/lib/client"; import { PRODUCTS_BY_IDS_QUERY } from "@/lib/sanity/queries/products"; import type {
CartItem } from "@/lib/store/cart-store";

export interface StockInfo { productId: string; currentStock: number; isOutOfStock: boolean; exceedsStock:
boolean; availableQuantity: number; }

export type StockMap = Map<string, StockInfo>;

interface UseCartStockReturn { stockMap: StockMap; isLoading: boolean; hasStockIssues: boolean; refetch: () =>
void; }

/\*\*

- Fetches current stock levels for cart items
- Returns stock info map and loading state \*/ export function useCartStock(items: CartItem[]):
  UseCartStockReturn { const [stockMap, setStockMap] = useState<StockMap>(new Map()); const [isLoading,
  setIsLoading] = useState(false);

// Memoize product IDs to use as stable dependency const productIds = useMemo( () => items.map((item) =>
item.productId), [items] );

const fetchStock = useCallback(async () => { if (items.length === 0) { setStockMap(new Map()); return; }

    setIsLoading(true);

    try {
      const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
        ids: productIds,
      });

      const newStockMap = new Map<string, StockInfo>();

      for (const item of items) {
        const product = products.find(
          (p: { _id: string }) => p._id === item.productId
        );
        const currentStock = product?.stock ?? 0;

        newStockMap.set(item.productId, {
          productId: item.productId,
          currentStock,
          isOutOfStock: currentStock === 0,
          exceedsStock: item.quantity > currentStock,
          availableQuantity: Math.min(item.quantity, currentStock),
        });
      }

      setStockMap(newStockMap);
    } catch (error) {
      console.error("Failed to fetch stock:", error);
    } finally {
      setIsLoading(false);
    }

}, [items, productIds]);

useEffect(() => { fetchStock(); }, [fetchStock]);

const hasStockIssues = Array.from(stockMap.values()).some( (info) => info.isOutOfStock || info.exceedsStock );

return { stockMap, isLoading, hasStockIssues, refetch: fetchStock, }; }
