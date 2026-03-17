import { Skeleton } from '@/components/ui/skeleton'

export function CategoryTilesSkeleton() {
  return (
    <div className='relative'>
      <div className='scrollbar-hide flex gap-4 overflow-x-auto py-4 pr-4 pl-8 sm:pr-6 sm:pl-12 lg:pr-8 lg:pl-10'>
        {/* All Products tile skeleton */}
        <div className='shrink-0 overflow-hidden rounded-xl'>
          <Skeleton className='h-32 w-56 sm:h-56 sm:w-80' />
        </div>

        {/* Category tiles skeletons */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='shrink-0 overflow-hidden rounded-xl'>
            <Skeleton className='h-32 w-56 sm:h-56 sm:w-80' />
          </div>
        ))}
      </div>
    </div>
  )
}
