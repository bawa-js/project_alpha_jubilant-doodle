import React from 'react'

import { sanityFetch } from '@/sanity/lib/live'
// import { ALL_CATEGORIES_QUERY } from '@/sanity/lib/groq-query/categories'
import { FEATURED_PRODUCTS_QUERY } from '@/sanity/lib/groq-query/products'
import { FeaturedCarousel } from '@/components/shared/featured-carousel'

// interface HomePageProps {
//   searchParams: Promise<{
//     q?: string
//     category?: string
//     color?: string
//     material?: string
//     minPrice?: string
//     maxPrice?: string
//     sort?: string
//     inStock?: string
//   }>
// }

export default async function Home() {
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
