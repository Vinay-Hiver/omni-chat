import type { SectionDef } from './types'

/** Every section the right panel can show. A channel picks from these and may rename a section or change its fields. */
export const sections: Record<string, SectionDef> = {
  contact: { id: 'contact', title: 'Contact details', icon: 'contact', type: 'fields', fields: ['contactName', 'email', 'phone'] },
  account: { id: 'account', title: 'Account details', icon: 'building', type: 'fields', fields: ['accountName', 'domain', 'accountContact'] },
  conversation: { id: 'conversation', title: 'Conversation details', icon: 'conversation', type: 'fields', fields: ['initiatedAt'] },
  chatDetails: { id: 'chatDetails', title: 'Chat details', icon: 'chatinbox', type: 'fields', fields: ['initiatedFrom', 'initiatedAt', 'location', 'osDevice', 'browser', 'ipAddress', 'userAgent'] },
  customFields: { id: 'customFields', title: 'Custom fields', icon: 'text', type: 'customFields', viewAll: true },
  previousConversations: { id: 'previousConversations', title: 'Previous Conversations', icon: 'previousconversations', type: 'list', emptyListText: 'There are no other chats associated to this contact', viewAll: true },
  notes: { id: 'notes', title: 'Notes', icon: 'note', type: 'notes' },
  emailAccount: { id: 'emailAccount', title: 'Account', icon: 'building', type: 'insights', fields: ['accountNameAvatar', 'domain', 'accountContacts', 'accountConversations'] },
  emailContact: { id: 'emailContact', title: 'Contact', icon: 'contact', type: 'fields', fields: ['contactNameAvatar', 'email', 'contactAccount', 'contactConversations'], more: true },
  activity: { id: 'activity', title: 'Activity & Notes', icon: 'clock', type: 'activity' },
}
