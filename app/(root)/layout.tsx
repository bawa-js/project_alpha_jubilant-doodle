import { ClerkProvider } from '@clerk/nextjs'

import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { SanityLive } from '@/sanity/lib/live'
import { CartStoreProvider } from '@/lib/store/cart-store-provider'
import { ChatStoreProvider } from '@/lib/store/chat-store-provider'
import { Header } from '@/components/shared/header'
import { CartSheet } from '@/components/shared/cart-sheet'

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <ChatStoreProvider>
          <Header />
          <main>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position='bottom-center' />
          </main>
          <CartSheet />
          <SanityLive />
        </ChatStoreProvider>
      </CartStoreProvider>
    </ClerkProvider>
  )
}
