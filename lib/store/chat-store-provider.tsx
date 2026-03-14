'use client'

import React from 'react'
import { useStore } from 'zustand'
import { createChatStore, type ChatStore, type ChatState, defaultInitState } from './chat-store'

// Store API type
export type ChatStoreApi = ReturnType<typeof createChatStore>

// Context
const ChatStoreContext = React.createContext<ChatStoreApi | undefined>(undefined)

// Provider props
interface ChatStoreProviderProps {
  children: React.ReactNode
  initialState?: ChatState
}

/**
 * Chat store provider - creates one store instance per provider
 * Wrap your app/(app) layout with this provider
 */
export const ChatStoreProvider = ({ children, initialState }: ChatStoreProviderProps) => {
  // useState initializer runs ONLY once on the initial mount.
  // This replaces the "if (storeRef.current === null)" logic safely.
  const [store] = React.useState(() => createChatStore(initialState ?? defaultInitState))

  return <ChatStoreContext.Provider value={store}>{children}</ChatStoreContext.Provider>
}

/**
 * Hook to access the chat store with a selector
 * Must be used within ChatStoreProvider
 */
export const useChatStore = <T,>(selector: (store: ChatStore) => T): T => {
  const chatStoreContext = React.useContext(ChatStoreContext)

  if (!chatStoreContext) {
    throw new Error('useChatStore must be used within ChatStoreProvider')
  }

  return useStore(chatStoreContext, selector)
}

// ============================================
// Convenience Hooks
// ============================================

/**
 * Get chat open state
 */
export const useIsChatOpen = () => useChatStore((state) => state.isOpen)

/**
 * Get pending message
 */
export const usePendingMessage = () => useChatStore((state) => state.pendingMessage)

/**
 * Get all chat actions
 * Actions are stable references from zustand, safe to destructure
 */
export const useChatActions = () => {
  const openChat = useChatStore((state) => state.openChat)
  const openChatWithMessage = useChatStore((state) => state.openChatWithMessage)
  const closeChat = useChatStore((state) => state.closeChat)
  const toggleChat = useChatStore((state) => state.toggleChat)
  const clearPendingMessage = useChatStore((state) => state.clearPendingMessage)

  return { openChat, openChatWithMessage, closeChat, toggleChat, clearPendingMessage }
}
