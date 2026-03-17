import { ClerkProvider } from '@clerk/nextjs'

import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { SanityLive } from '@/sanity/lib/live'
import { CartStoreProvider } from '@/lib/store/cart-store-provider'
import { ChatStoreProvider } from '@/lib/store/chat-store-provider'
import { Header } from '@/components/shared/header'

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <CartStoreProvider>
        <ChatStoreProvider>
          <Header />
          <main>
            <TooltipProvider>{children}</TooltipProvider>
            <SanityLive />
            <Toaster position='bottom-center' />
          </main>
        </ChatStoreProvider>
      </CartStoreProvider>
    </ClerkProvider>
  )
}
