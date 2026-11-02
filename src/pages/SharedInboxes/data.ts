import type { IconName } from '../../icons/iconData'
import type { SubNavChannelId } from '../../patterns/SubNav/data'

/** How an email inbox is connected to its mailbox. */
export type AccountType = 'Outlook User Account' | 'Outlook Shared Mailbox' | 'Forwarding Mailbox' | 'Distribution List or Microsoft 365 Group'

export type Inbox = {
  id: string
  name: string
  /** Only email inboxes have an address; it shows under the heading of their settings and in the list. */
  email?: string
  /** Only email inboxes have one; it shows in the list. */
  accountType?: AccountType
}

export type InboxChannel = {
  id: SubNavChannelId
  /** The name in the Shared Inboxes sub-nav and the page heading, for example "Chat Inboxes". */
  label: string
  /** One inbox of this channel, for the "Create ..." button, for example "Chat Inbox". */
  singular: string
  icon: IconName
  inboxes: Inbox[]
}

/** The channels in the Shared Inboxes sub-nav, in order, with one chat inbox, Chat-Support; the other channels are empty. */
export const sharedInboxChannels: InboxChannel[] = [
  {
    id: 'email', label: 'Email Inboxes', singular: 'Email Inbox', icon: 'mailbox',
    inboxes: [],
  },
  {
    id: 'slack', label: 'Slack Inboxes', singular: 'Slack Inbox', icon: 'slack',
    inboxes: [],
  },
  {
    id: 'chat', label: 'Chat Inboxes', singular: 'Chat Inbox', icon: 'chatinbox',
    inboxes: [{ id: 'chat-support', name: 'Chat-Support' }],
  },
  {
    id: 'whatsapp', label: 'WhatsApp Inboxes', singular: 'WhatsApp Inbox', icon: 'whatsapp',
    inboxes: [],
  },
  {
    id: 'voice', label: 'Voice Inboxes', singular: 'Voice Inbox', icon: 'voice',
    inboxes: [],
  },
  {
    id: 'sms', label: 'SMS Inboxes', singular: 'SMS Inbox', icon: 'sms',
    inboxes: [],
  },
]
