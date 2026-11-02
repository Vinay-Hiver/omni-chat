import type { ChannelId, ChannelSample } from './types'

/** Example content for each channel, copied from the Figma frames (HOT Storybook - AIBoilerplate, "Right panel by channel"). */
export const samples: Record<ChannelId, ChannelSample> = {
  chat: {
    inboxName: 'hello',
    values: {
      contactName: 'billowing-pond-851',
      initiatedFrom: 'https://www.w3schools.com/html/tryit.asp',
      initiatedAt: 'Oct 07, 2026 05:03 PM',
      location: 'Bengaluru, India',
      osDevice: 'macOS 10.15',
      browser: 'Chrome 151.0',
      ipAddress: '205.254.185.182',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
    },
    previousConversations: [],
  },

  slack: {
    inboxName: 'Slack Inbox 1',
    values: {
      contactName: 'harini',
      email: 'harini@hiverhq.co.in',
      slackChannel: '#all-harinihiverhq4',
      slackThread: 'https://harinihiverhq4.slack.com/archives/C0B0J7SFA3C/p1778489558529899',
      initiatedAt: 'May 11, 2026 02:22 PM',
    },
    customFields: [
      { label: 'Priority', kind: 'dropdown', value: 'High' },
      { label: 'MRR', kind: 'number' },
      { label: 'Account name', kind: 'text' },
      { label: 'Sample', kind: 'text' },
    ],
    previousConversations: [
      { from: 'harini', date: 'Jun 04', preview: 'hey' },
      { from: 'harini', date: 'Jun 04', preview: 'now?' },
      { from: 'harini', date: 'Jun 16', preview: 'hey' },
      { from: 'harini', date: 'Jun 11', preview: 'heyy' },
    ],
  },

  whatsapp: {
    inboxName: "Harini's WA",
    values: { contactName: 'Abhinav', phone: '+918950626006', initiatedAt: 'Oct 06, 2026 10:18 AM' },
    customFields: [
      { label: 'Date', kind: 'dateInput', placeholder: 'Select a date' },
      { label: 'MRR', kind: 'number' },
      { label: 'Account', kind: 'text' },
      { label: 'IT Ticket ID', kind: 'text' },
    ],
  },

  sms: {
    inboxName: 'SMS channel',
    values: { initiatedAt: 'Oct 07, 2026 12:52 PM' },
  },

  email: {
    inboxName: 'Hariniosm01',
    values: {
      ticketId: 'TKT#10',
      contactNameAvatar: 'Channels QA',
      email: 'channelsqa@hiver.space',
      contactAccount: 'hiver.space',
      contactConversations: 13,
      accountNameAvatar: 'hiver.space',
      domain: 'hiver.space',
      accountContacts: 5,
      accountConversations: 38,
    },
    customFields: [
      { label: 'SM dropdown', kind: 'dropdown', placeholder: 'Select an option' },
      { label: 'SM date', kind: 'dateInput', placeholder: 'Select a date' },
      { label: 'SM Text', kind: 'text' },
      { label: 'V2 number', kind: 'number' },
    ],
    insights: { status: 'At Risk', lines: ['A high SLA breach rate is the main concern.', 'Prioritise the conversations where SLAs were missed.'] },
    activity: [
      {
        day: 'Yesterday',
        items: [
          { text: 'Michael Scott self-assigned this conversation', time: '05:00 PM' },
          { text: 'Harini L created a new ticket', time: '12:50 PM' },
        ],
      },
    ],
  },
}
