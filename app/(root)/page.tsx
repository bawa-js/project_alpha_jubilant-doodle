import React, { Suspense } from 'react'

import { sanityFetch } from '@/sanity/lib/live'
import { ALL_CATEGORIES_QUERY } from '@/sanity/lib/groq-query/categories'
import {
  FEATURED_PRODUCTS_QUERY,
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
} from '@/sanity/lib/groq-query/products'
import { FeaturedCarousel } from '@/components/shared/featured-carousel'

interface PageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    color?: string
    material?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    inStock?: string
  }>
}

export default async function Home(props: PageProps) {
  const params = await props.searchParams

  const searchQuery = params.q ?? ''
  const categorySlug = params.category ?? ''
  const color = params.color ?? ''
  const material = params.material ?? ''
  const minPrice = Number(params.minPrice) || 0
  const maxPrice = Number(params.maxPrice) || 0
  const sort = params.sort ?? 'name'
  const inStock = params.inStock === 'true'

  // Select query based on the sort parameter
  const getQuery = () => {
    if (searchQuery && sort === 'relevance') return FILTER_PRODUCTS_BY_RELEVANCE_QUERY

    switch (sort) {
      case 'price-asc':
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY
      case 'price-desc':
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY
      case 'relevance':
        return FILTER_PRODUCTS_BY_RELEVANCE_QUERY
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY
    }
  }

  const { data: categories } = await sanityFetch({ query: ALL_CATEGORIES_QUERY })

  const { data: featuredProducts } = await sanityFetch({ query: FEATURED_PRODUCTS_QUERY })

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-zinc-900'>
      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <React.Suspense fallback={<div>Loading...</div>}>
          <FeaturedCarousel products={featuredProducts} />
        </React.Suspense>
      )}
    </div>
  )
}
