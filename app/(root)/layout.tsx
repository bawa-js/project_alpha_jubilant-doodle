import { ClerkProvider } from '@clerk/nextjs'

import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <main>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </main>
    </ClerkProvider>
  )
}
