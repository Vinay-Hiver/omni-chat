import type { ComponentProps } from 'react'
import type { Avatar } from '../../components/Avatar'

/** The one chat inbox, named as in Admin panel > Shared Inbox > Chat Inboxes. */
export const CHAT_INBOX = { id: 'chat-support', name: 'Chat-Support' }

/** `event` is a line across the thread, such as "John Cole has joined the conversation". */
export type ChatMessage = { kind: 'incoming' | 'agent-text' | 'event'; text: string; time: string; sender?: string }

export type ChatConversation = {
  id: string
  /** The sidebar view it sits in. */
  view: 'unassigned' | 'bot' | 'mine'
  title: string
  avatarColor: ComponentProps<typeof Avatar>['color']
  date: string
  preview: string
  messages: ChatMessage[]
  /** Started from /chat-interaction: replies go to the visitor's tab instead of a canned answer. */
  live?: boolean
  /** Live chats only: who it is assigned to (`none` while the bot has it). */
  assignee?: string
  /** Live chats only: ended by either side. */
  closed?: boolean
}

/** No sample conversations: every view starts empty, and chats from /chat-interaction fill them (see liveChats.ts). */
export const chatConversations: ChatConversation[] = []
