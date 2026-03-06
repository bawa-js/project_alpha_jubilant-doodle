import { ClerkProvider } from '@clerk/nextjs'

import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { SanityLive } from '@/sanity/lib/live'

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <main>
        <TooltipProvider>{children}</TooltipProvider>
        <SanityLive />
        <Toaster />
      </main>
    </ClerkProvider>
  )
}
