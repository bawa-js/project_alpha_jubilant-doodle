// /app/api/stock/route.ts
import { NextResponse } from 'next/server'
import { sanityFetch } from '@/sanity/lib/live'
import { PRODUCTS_BY_IDS_QUERY } from '@/lib/sanity-groq-queries/products'

export async function POST(req: Request) {
  try {
    const { ids } = await req.json()

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid ids' }, { status: 400 })
    }

    const result = await sanityFetch({ query: PRODUCTS_BY_IDS_QUERY, params: { ids } })

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Stock API error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
