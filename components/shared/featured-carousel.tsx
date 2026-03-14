'use client'
import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight } from 'lucide-react'

import { cn, formatPrice } from '@/lib/utils'
import { Carousel, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { FEATURED_PRODUCTS_QUERYResult } from '@/sanity.types'

interface FeaturedCarouselProps {
  products: FEATURED_PRODUCTS_QUERYResult
}

export function FeaturedCarousel(props: FeaturedCarouselProps) {
  // From Shadcn UI's Carousel Docs...You can listen to events using the api instance from setApi
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  if (props.products.length === 0) return null

  return (
    <div className='relative w-full bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950'>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: 'start' }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]}
        className='w-full'>
        <CarouselContent className='ml-0'>
          {props.products.map((product) => (
            <CarouselItem key={product._id} className='pl-0'>
              <FeaturedSlide product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows - positioned inside */}
        <CarouselPrevious className='left-4 border-zinc-700 bg-zinc-800/80 text-white hover:bg-zinc-700 hover:text-white sm:left-8' />
        <CarouselNext className='right-4 border-zinc-700 bg-zinc-800/80 text-white hover:bg-zinc-700 hover:text-white sm:right-8' />
      </Carousel>

      {/* Dot indicators */}
      {count > 1 && (
        <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6'>
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={`dot-${index}`}
              type='button'
              onClick={() => scrollTo(index)}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                current === index ? 'w-6 bg-white' : 'bg-white/40 hover:bg-white/60',
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type FeaturedProduct = FEATURED_PRODUCTS_QUERYResult[number]

interface FeaturedSlideProps {
  product: FeaturedProduct
}

function FeaturedSlide(props: FeaturedSlideProps) {
  const mainImage = props.product.images?.[0]?.asset?.url

  return (
    <div className='flex min-h-100 flex-col md:min-h-112.5 md:flex-row lg:min-h-125'>
      {/* Image Section - Left side (60% on desktop) */}
      <div className='relative h-64 w-full md:h-auto md:w-3/5'>
        {mainImage ?
          <Image
            src={mainImage}
            alt={props.product.name ?? 'Featured product'}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 60vw'
            priority
          />
        : <div className='flex h-full items-center justify-center bg-zinc-800'>
            <span className='text-zinc-500'>No image</span>
          </div>
        }

        {/* Gradient overlay for image edge blending */}
        <div className='absolute inset-0 hidden bg-linear-to-r from-transparent via-transparent to-zinc-900/90 md:block dark:to-zinc-950/90' />
        <div className='absolute inset-0 bg-linear-to-t from-zinc-900/90 via-transparent to-transparent md:hidden' />
      </div>

      {/* Content Section - Right side (40% on desktop) */}
      <div className='flex w-full flex-col justify-center px-6 py-8 md:w-2/5 md:px-10 lg:px-16'>
        {props.product.category && (
          <Badge
            variant='secondary'
            className='mb-4 w-fit bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'>
            {props.product.category.title}
          </Badge>
        )}

        <h2 className='text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl'>
          {props.product.name}
        </h2>

        {props.product.description && (
          <p className='mt-4 line-clamp-3 text-sm text-zinc-300 sm:text-base lg:text-lg'>
            {props.product.description}
          </p>
        )}

        <p className='mt-6 text-3xl font-bold text-white lg:text-4xl'>{formatPrice(props.product.price)}</p>

        <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
          <Button asChild size='lg' className='bg-white text-zinc-900 hover:bg-zinc-100'>
            <Link href={`/products/${props.product.slug}`}>
              Shop Now
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
