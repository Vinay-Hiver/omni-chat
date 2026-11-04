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
}

const convo = (view: ChatConversation['view'], i: number, title: string, avatarColor: ChatConversation['avatarColor'], date: string, preview: string): ChatConversation => ({
  id: `${CHAT_INBOX.id}-${view}-${i}`,
  view, title, avatarColor, date, preview,
  messages: [
    { kind: 'incoming', text: preview, time: `${date}, 10:0${i + 1} AM` },
    { kind: 'agent-text', text: 'Sure, happy to help with that!', time: `${date}, 10:0${i + 2} AM`, sender: 'John Cole' },
  ],
})

/**
 * The conversations of "Chat Support 01" from the linked-conversations prototype (src/omni/data/channelChats.js):
 * two Unassigned and two Mine. Every other conversation is an anonymous visitor with a generated username.
 */
export const chatConversations: ChatConversation[] = [
  convo('unassigned', 0, 'Priya Nair', 'violet', 'Jul 23', 'The chat widget is not loading on mobile'),
  convo('unassigned', 1, 'summer-wave-360', 'red', 'Jul 22', 'Is the pro plan available monthly?'),
  convo('mine', 0, 'Sofia Reyes', 'purple', 'Jul 21', 'Can we get a demo for our team next week?'),
  convo('mine', 1, 'misty-night-872', 'green', 'Jul 20', 'How do I reset my password?'),
]
