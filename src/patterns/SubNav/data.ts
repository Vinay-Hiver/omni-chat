import type { IconName } from '../../icons/iconData'

/** The channels (inbox types) that have a Sub-nav in the admin panel. */
export type SubNavChannelId = 'email' | 'slack' | 'chat' | 'voice' | 'sms' | 'whatsapp'

/** One page the Sub-nav can link to. Defined once and used by any channel that has it. */
export type SubNavItemDef = {
  id: string
  label: string
  /** An icon name from the HOT icon set. */
  icon: IconName
}

/** The small arrow beside the heading, which switches to another inbox: a boxed button, a bare arrow, or nothing. */
export type SubNavSwitcher = 'box' | 'plain' | 'none'

export type SubNavChannelDef = {
  id: SubNavChannelId
  /** The heading: the channel's name. */
  label: string
  /** Whether a small line (the inbox's email address) sits under the heading. */
  subtitle: boolean
  switcher: SubNavSwitcher
  /** The list, in order. Ids of `subNavLibrary`. */
  items: string[]
  /** The item that is selected when the page opens. */
  defaultSelected: string
}

/** Every page the Sub-nav can show, from the Figma frame "Section 2" (3205:4444). */
export const subNavLibrary: Record<string, SubNavItemDef> = {
  members: { id: 'members', label: 'Members', icon: 'user' },
  autoAssignment: { id: 'autoAssignment', label: 'Auto Assignment', icon: 'rightwithcircle' },
  aliases: { id: 'aliases', label: 'Aliases', icon: 'alias' },
  customFields: { id: 'customFields', label: 'Custom Fields', icon: 'listview' },
  automations: { id: 'automations', label: 'Automations', icon: 'setting' },
  sla: { id: 'sla', label: 'SLA', icon: 'responsetime' },
  tickets: { id: 'tickets', label: 'Tickets', icon: 'ticket' },
  csat: { id: 'csat', label: 'CSAT', icon: 'csat' },
  collaboration: { id: 'collaboration', label: 'Collaboration', icon: 'share' },
  settings: { id: 'settings', label: 'Settings', icon: 'setting' },
  slackChannels: { id: 'slackChannels', label: 'Slack Channels', icon: 'slackchannel' },
  conversationRules: { id: 'conversationRules', label: 'Conversation Rules', icon: 'conversationrules' },
  aiAgent: { id: 'aiAgent', label: 'AI Agent', icon: 'aiagent' },
  preChatForm: { id: 'preChatForm', label: 'Pre-chat Form', icon: 'file' },
  widgetDesign: { id: 'widgetDesign', label: 'Widget Design', icon: 'widgetdesign' },
  transcript: { id: 'transcript', label: 'Transcript', icon: 'transcript' },
  widgetScript: { id: 'widgetScript', label: 'Widget Script', icon: 'code3' }, // the DS calls it Code 3
  messages: { id: 'messages', label: 'Messages', icon: 'conversationrules' }, // same icon as Conversation Rules
  generalSettings: { id: 'generalSettings', label: 'General settings', icon: 'setting' },
  configuration: { id: 'configuration', label: 'Configuration', icon: 'adminsettings' },
  // Schedule
  shifts: { id: 'shifts', label: 'Shifts', icon: 'calander' },
  businessHours: { id: 'businessHours', label: 'Business Hours', icon: 'clock' },
  // Settings
  identityAccess: { id: 'identityAccess', label: 'Identity & Access', icon: 'identity' },
  deliverability: { id: 'deliverability', label: 'Deliverability', icon: 'building' },
  plansBilling: { id: 'plansBilling', label: 'Plans & Billing', icon: 'wallet' },
  account: { id: 'account', label: 'Account', icon: 'account' },
}

/** What each channel's Sub-nav contains, in its order. */
/** The admin sections (not inboxes) that have a Sub-nav: Schedule and Settings, from the Figma frames 3209:9296 and 3209:9947. */
export type AdminSubNavId = 'schedule' | 'settings'
export type AdminSubNavDef = { id: AdminSubNavId; label: string; items: string[]; defaultSelected: string }

export const adminSubNavs: Record<AdminSubNavId, AdminSubNavDef> = {
  schedule: { id: 'schedule', label: 'Schedule', items: ['shifts', 'businessHours'], defaultSelected: 'shifts' },
  settings: { id: 'settings', label: 'Settings', items: ['identityAccess', 'deliverability', 'plansBilling', 'account'], defaultSelected: 'identityAccess' },
}

/** An admin section's Sub-nav with every id replaced by its definition. */
export function getAdminSubNav(id: AdminSubNavId) {
  const section = adminSubNavs[id]
  return {
    ...section,
    items: section.items.map((itemId) => {
      const item = subNavLibrary[itemId]
      if (!item) throw new Error(`Sub-nav data: "${id}" uses unknown item "${itemId}"`)
      return item
    }),
  }
}

export const subNavChannels: Record<SubNavChannelId, SubNavChannelDef> = {
  email: {
    id: 'email', label: 'Email', subtitle: true, switcher: 'box', defaultSelected: 'members',
    items: ['members', 'autoAssignment', 'aliases', 'customFields', 'automations', 'sla', 'tickets', 'csat', 'collaboration', 'settings'],
  },
  slack: {
    id: 'slack', label: 'Slack', subtitle: false, switcher: 'box', defaultSelected: 'members',
    items: ['members', 'slackChannels', 'conversationRules', 'autoAssignment', 'sla', 'customFields', 'csat', 'settings'],
  },
  chat: {
    id: 'chat', label: 'Chat', subtitle: false, switcher: 'box', defaultSelected: 'aiAgent',
    items: ['aiAgent', 'members', 'autoAssignment', 'preChatForm', 'widgetDesign', 'transcript', 'widgetScript', 'settings'],
  },
  voice: {
    id: 'voice', label: 'Voice', subtitle: false, switcher: 'box', defaultSelected: 'members',
    items: ['members', 'messages', 'settings'],
  },
  sms: {
    id: 'sms', label: 'SMS', subtitle: false, switcher: 'box', defaultSelected: 'members',
    items: ['members', 'generalSettings'],
  },
  whatsapp: {
    id: 'whatsapp', label: 'WhatsApp', subtitle: false, switcher: 'box', defaultSelected: 'members',
    items: ['members', 'configuration', 'generalSettings'],
  },
}

export const subNavChannelIds = Object.keys(subNavChannels) as SubNavChannelId[]

/** A channel's Sub-nav with every id replaced by its definition. */
export function getSubNav(id: SubNavChannelId) {
  const channel = subNavChannels[id]
  return {
    ...channel,
    items: channel.items.map((itemId) => {
      const item = subNavLibrary[itemId]
      if (!item) throw new Error(`Sub-nav data: channel "${id}" uses unknown item "${itemId}"`)
      return item
    }),
  }
}

/** Checks the data for mistakes (an unknown item, a duplicate, a missing default). Returns a list of problems; empty means it is fine. */
export function validateSubNav(): string[] {
  const problems: string[] = []
  for (const channel of Object.values(subNavChannels)) {
    const seen = new Set<string>()
    for (const itemId of channel.items) {
      if (!subNavLibrary[itemId]) problems.push(`${channel.id}: unknown item "${itemId}"`)
      if (seen.has(itemId)) problems.push(`${channel.id}: "${itemId}" is listed twice`)
      seen.add(itemId)
    }
    if (!channel.items.includes(channel.defaultSelected)) problems.push(`${channel.id}: the default item "${channel.defaultSelected}" is not in its list`)
  }
  return problems
}
