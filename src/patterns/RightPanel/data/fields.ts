import type { FieldDef, FooterActionDef, TabDef } from './types'

/** Every field the right panel can show. */
export const fields: Record<string, FieldDef> = {
  // Top section
  ticketId: { id: 'ticketId', label: 'Ticket ID', icon: 'hashnumber', kind: 'text', editable: false },
  assignee: { id: 'assignee', label: 'Assignee', icon: 'assigned', kind: 'assignee', editable: true },
  status: { id: 'status', label: 'Status', icon: 'flag', kind: 'status', editable: true },
  tags: { id: 'tags', label: 'Tags', icon: 'tag', kind: 'tags', editable: true },

  // Contact
  contactName: { id: 'contactName', label: 'Name', icon: 'user', kind: 'text', editable: false },
  contactNameAvatar: { id: 'contactNameAvatar', label: 'Name', icon: 'user', kind: 'avatarText', editable: false },
  email: { id: 'email', label: 'Email', icon: 'mailbox', kind: 'text', editable: false },
  phone: { id: 'phone', label: 'Phone', icon: 'phone', kind: 'text', editable: false },
  username: { id: 'username', label: 'Username', icon: 'identity', kind: 'text', editable: false },
  contactAccount: { id: 'contactAccount', label: 'Account', icon: 'building', kind: 'text', editable: false },
  contactConversations: { id: 'contactConversations', label: 'Conversations', icon: 'previousconversations', kind: 'countLink', editable: false },

  // Account
  accountName: { id: 'accountName', label: 'Account', icon: 'building', kind: 'text', editable: false },
  accountNameAvatar: { id: 'accountNameAvatar', label: 'Name', icon: 'building', kind: 'avatarText', editable: false },
  domain: { id: 'domain', label: 'Domain', icon: 'domain', kind: 'text', editable: false },
  accountContact: { id: 'accountContact', label: 'Contact', icon: 'contact', kind: 'text', editable: false },
  accountContacts: { id: 'accountContacts', label: 'Contacts', icon: 'contact', kind: 'number', editable: false },
  accountConversations: { id: 'accountConversations', label: 'Conversations', icon: 'previousconversations', kind: 'countLink', editable: false },

  // Conversation details (all channels)
  initiatedAt: { id: 'initiatedAt', label: 'Initiated at', icon: 'clock', kind: 'datetime', editable: false },

  // Chat details
  initiatedFrom: { id: 'initiatedFrom', label: 'Initiated from', icon: 'newtab', kind: 'link', editable: false },
  location: { id: 'location', label: 'Location', icon: 'pin', kind: 'text', editable: false },
  osDevice: { id: 'osDevice', label: 'OS / Device', icon: 'connectors', kind: 'text', editable: false },
  browser: { id: 'browser', label: 'Browser', icon: 'view', kind: 'text', editable: false },
  ipAddress: { id: 'ipAddress', label: 'IP Address', icon: 'hashnumber', kind: 'text', editable: false },
  userAgent: { id: 'userAgent', label: 'User agent', icon: 'code', kind: 'longText', editable: false },

  // Slack details
  slackChannel: { id: 'slackChannel', label: 'Channel', icon: 'hashnumber', kind: 'text', editable: false },
  slackThread: { id: 'slackThread', label: 'Slack Thread', icon: 'link', kind: 'link', editable: false },
}

/**
 * Custom fields are not fixed: each workspace creates its own, in four kinds. These are the icon and picker text for each kind.
 * The values themselves come from the workspace, so they are not listed in `fields`.
 */
export const customFieldKinds = {
  dropdown: { icon: 'dropdownrepresentation', kind: 'dropdown', placeholder: 'Select an option' },
  date: { icon: 'calander', kind: 'dateInput', placeholder: 'Select a date' },
  text: { icon: 'text', kind: 'text' },
  number: { icon: 'hashnumber', kind: 'number' },
} as const

/** The actions that can sit at the bottom of the panel, after the last section. */
export const footerActions: Record<FooterActionDef['id'], FooterActionDef> = {
  customizeWidgets: {
    id: 'customizeWidgets',
    label: 'Customize widgets',
    icon: 'setting',
    placement: 'afterLastSection',
    opens: 'sectionVisibility',
    look: { height: 32, radius: 6, paddingX: 12, paddingY: 6, gap: 8, containerPaddingX: 12, containerPaddingY: 20 },
  },
}

/** The tabs that can sit in the bar at the top of the panel. */
export const tabs: Record<string, TabDef> = {
  sharedInbox: { id: 'sharedInbox', label: 'Shared Inbox', icon: 'sminbox' },
}
