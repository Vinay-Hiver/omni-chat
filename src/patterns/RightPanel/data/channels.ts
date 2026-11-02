import type { ChannelDef, ChannelId } from './types'

/** What each channel's right panel contains, in its default order. */
export const channels: Record<ChannelId, ChannelDef> = {
  chat: {
    id: 'chat',
    label: 'Chat',
    tabs: ['sharedInbox'],
    top: { title: 'inboxName', fields: ['assignee', 'status', 'tags'] },
    sections: [
      { section: 'contact', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'account', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'chatDetails', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'previousConversations', defaultExpanded: true, emptyValue: 'Empty' },
    ],
    footer: ['customizeWidgets'],
  },

  slack: {
    id: 'slack',
    label: 'Slack',
    tabs: ['sharedInbox'],
    top: { title: 'inboxName', fields: ['assignee', 'status', 'tags'] },
    sections: [
      { section: 'contact', title: 'Customer details', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'conversation', fields: ['slackChannel', 'slackThread', 'initiatedAt'], defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'customFields', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'previousConversations', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'notes', defaultExpanded: true, emptyValue: 'Empty' },
    ],
    footer: ['customizeWidgets'],
  },

  whatsapp: {
    id: 'whatsapp',
    label: 'WhatsApp',
    tabs: ['sharedInbox'],
    top: { title: 'inboxName', fields: ['assignee', 'status', 'tags'] },
    sections: [
      // A dash, not "Empty", shows in the contact fields; the custom fields use "Empty".
      { section: 'contact', fields: ['contactName', 'email', 'phone', 'username'], defaultExpanded: true, emptyValue: '-' },
      { section: 'conversation', defaultExpanded: true, emptyValue: '-' },
      { section: 'customFields', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'notes', defaultExpanded: true, emptyValue: 'Empty' },
    ],
    footer: ['customizeWidgets'],
  },

  sms: {
    id: 'sms',
    label: 'SMS',
    tabs: ['sharedInbox'],
    top: { title: 'inboxName', fields: ['assignee', 'status', 'tags'] },
    sections: [
      { section: 'contact', defaultExpanded: true, emptyValue: '-' },
      { section: 'account', defaultExpanded: true, emptyValue: '-' },
      { section: 'conversation', defaultExpanded: true, emptyValue: '-' },
    ],
    footer: ['customizeWidgets'],
  },

  email: {
    id: 'email',
    label: 'Email',
    // Email shows the ticket ID above the assignee.
    tabs: ['sharedInbox'],
    top: { title: 'inboxName', fields: ['ticketId', 'assignee', 'status', 'tags'] },
    sections: [
      { section: 'customFields', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'emailAccount', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'emailContact', defaultExpanded: true, emptyValue: 'Empty' },
      { section: 'activity', defaultExpanded: true, emptyValue: 'Empty' },
    ],
    footer: ['customizeWidgets'],
  },
}

export const channelIds = Object.keys(channels) as ChannelId[]
