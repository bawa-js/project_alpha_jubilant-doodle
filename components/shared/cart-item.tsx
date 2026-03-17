'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCartActions } from '@/lib/store/cart-store-provider'
import { cn, formatPrice } from '@/lib/utils'
import { type CartItem as CartItemType } from '@/lib/store/cart-store'
import { AddToCartButton } from './add-to-cart-btn'
import { StockBadge } from './stock-badge'
import { StockInfo } from '@/hooks/use-cart-stock'

interface CartItemProps {
  item: CartItemType
  stockInfo?: StockInfo
}

export function CartItem(props: CartItemProps) {
  const { removeItem } = useCartActions()

  const isOutOfStock = props.stockInfo?.isOutOfStock ?? false
  const exceedsStock = props.stockInfo?.exceedsStock ?? false
  const currentStock = props.stockInfo?.currentStock ?? 999
  const hasIssue = isOutOfStock || exceedsStock

  return (
    <div className={cn('flex gap-4 py-4', hasIssue && 'rounded-lg bg-red-50 p-3 dark:bg-red-950/30')}>
      {/* Image */}
      <div
        className={cn(
          'relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800',
          isOutOfStock && 'opacity-50',
        )}>
        {props.item.image ?
          <Image src={props.item.image} alt={props.item.name} fill className='object-cover' sizes='80px' />
        : <div className='flex h-full items-center justify-center text-xs text-zinc-400'>No image</div>}
      </div>

      {/* Details */}
      <div className='flex flex-1 flex-col'>
        <div className='flex justify-between'>
          <Link
            href={`/products/${props.item.productId}`}
            className={cn(
              'font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300',
              isOutOfStock && 'text-zinc-400 dark:text-zinc-500',
            )}>
            {props.item.name}
          </Link>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-zinc-400 hover:text-red-500'
            onClick={() => removeItem(props.item.productId)}>
            <Trash2 className='h-4 w-4' />
            <span className='sr-only'>Remove {props.item.name}</span>
          </Button>
        </div>

        <p className='mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100'>
          {formatPrice(props.item.price)}
        </p>

        {/* Stock Badge & Quantity Controls */}
        <div className='mt-2 flex flex-row items-center justify-between gap-2'>
          <StockBadge productId={props.item.productId} stock={currentStock} />
          {!isOutOfStock && (
            <div className='ml-auto flex w-32 self-end'>
              <AddToCartButton
                productId={props.item.productId}
                name={props.item.name}
                price={props.item.price}
                image={props.item.image}
                stock={currentStock}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
