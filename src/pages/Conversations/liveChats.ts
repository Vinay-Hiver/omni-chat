import { useEffect, useState } from 'react'

/**
 * Chats started from /chat-interaction, shared with Conversations in the same browser.
 * Kept in localStorage, so every tab on this origin sees the same list; the `storage` event tells the other tabs,
 * and a window event tells this one.
 */

/** The signed-in agent across the prototype. */
export const ME = { value: 'john-cole', name: 'John Cole' }

export type LiveMessage = { from: 'visitor' | 'ai' | 'agent' | 'event'; text: string; at: number }

export type LiveChat = {
  id: string
  name: string
  email: string
  /** Assigned to Bot while the AI agent handles it; Mine once it is handed to a person. */
  view: 'bot' | 'mine'
  assignee: 'none' | typeof ME.value
  messages: LiveMessage[]
  updatedAt: number
}

const KEY = 'hot-live-chats'
const EVENT = 'hot-live-chats'

export function readLiveChats(): LiveChat[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

function write(list: LiveChat[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* storage full: this tab still has its copy */ }
  window.dispatchEvent(new Event(EVENT))
}

export function createLiveChat(chat: Omit<LiveChat, 'updatedAt'>) {
  write([{ ...chat, updatedAt: Date.now() }, ...readLiveChats().filter((c) => c.id !== chat.id)])
}

export function updateLiveChat(id: string, change: (chat: LiveChat) => Partial<LiveChat>) {
  write(readLiveChats().map((c) => (c.id === id ? { ...c, ...change(c), updatedAt: Date.now() } : c)))
}

export const addLiveMessage = (id: string, message: Omit<LiveMessage, 'at'>) =>
  updateLiveChat(id, (c) => ({ messages: [...c.messages, { ...message, at: Date.now() }] }))

/** Calls `onChange` whenever any tab changes the live chats. */
export function subscribeLiveChats(onChange: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) onChange() }
  window.addEventListener('storage', onStorage)
  window.addEventListener(EVENT, onChange)
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(EVENT, onChange) }
}

export function useLiveChats() {
  const [chats, setChats] = useState(readLiveChats)
  useEffect(() => subscribeLiveChats(() => setChats(readLiveChats())), [])
  return chats
}
