import Link from 'next/link'

import { formatPrice } from '@/lib/utils'
import { type PRODUCT_BY_SLUG_QUERYResult } from '@/sanity.types'
import { StockBadge } from './stock-badge'
import { AddToCartButton } from './add-to-cart-btn'
import { AskAISimilarButton } from './ask-ai-btn'

interface ProductInfoProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>
}

export function ProductInfo(props: ProductInfoProps) {
  const imageUrl = props.product.images?.[0]?.asset?.url

  return (
    <div className='flex flex-col'>
      {/* Category */}
      {props.product.category && (
        <Link
          href={`/?category=${props.product.category.slug}`}
          className='text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'>
          {props.product.category.title}
        </Link>
      )}

      {/* Title */}
      <h1 className='mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100'>{props.product.name}</h1>

      {/* Price */}
      <p className='mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100'>
        {formatPrice(props.product.price)}
      </p>

      {/* Description */}
      {props.product.description && (
        <p className='mt-4 text-zinc-600 dark:text-zinc-400'>{props.product.description}</p>
      )}

      {/* Stock & Add to Cart */}
      <div className='mt-6 flex flex-col gap-3'>
        <StockBadge productId={props.product._id} stock={props.product.stock ?? 0} />
        <AddToCartButton
          productId={props.product._id}
          name={props.product.name ?? 'Unknown Product'}
          price={props.product.price ?? 0}
          image={imageUrl ?? undefined}
          stock={props.product.stock ?? 0}
        />
        <AskAISimilarButton productName={props.product.name ?? 'this product'} />
      </div>

      {/* Metadata */}
      <div className='mt-6 space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800'>
        {props.product.material && (
          <div className='flex justify-between text-sm'>
            <span className='text-zinc-500 dark:text-zinc-400'>Material</span>
            <span className='font-medium text-zinc-900 capitalize dark:text-zinc-100'>
              {props.product.material}
            </span>
          </div>
        )}
        {props.product.color && (
          <div className='flex justify-between text-sm'>
            <span className='text-zinc-500 dark:text-zinc-400'>Color</span>
            <span className='font-medium text-zinc-900 capitalize dark:text-zinc-100'>
              {props.product.color}
            </span>
          </div>
        )}
        {props.product.dimensions && (
          <div className='flex justify-between text-sm'>
            <span className='text-zinc-500 dark:text-zinc-400'>Dimensions</span>
            <span className='font-medium text-zinc-900 dark:text-zinc-100'>{props.product.dimensions}</span>
          </div>
        )}
        {props.product.assemblyRequired !== null && (
          <div className='flex justify-between text-sm'>
            <span className='text-zinc-500 dark:text-zinc-400'>Assembly</span>
            <span className='font-medium text-zinc-900 dark:text-zinc-100'>
              {props.product.assemblyRequired ? 'Required' : 'Not required'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
