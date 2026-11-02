import type { AdminSidebarSection } from './AdminSidebar'

/** The Admin sidebar's example sections, shared by the Admin sidebar and Page layout stories. */
export const adminSampleSections: AdminSidebarSection[] = [
  { items: [{ id: 'shared-inbox', label: 'Shared Inbox', icon: 'sminbox' }] },
  { title: 'AI', items: [{ id: 'hiver-ai', label: 'Hiver AI', icon: 'ai' }, { id: 'knowledge-hub', label: 'Knowledge Hub', icon: 'file' }] },
  {
    title: 'Self service',
    items: [{ id: 'help-center', label: 'Help Center', icon: 'book' }, { id: 'web-forms', label: 'Web Forms', icon: 'webform' }, { id: 'customer-portal', label: 'Customer Portal', icon: 'customerportal' }],
  },
  {
    title: 'Data & Integrations',
    items: [{ id: 'custom-objects', label: 'Custom Objects', icon: 'customobject' }, { id: 'apps', label: 'Apps', icon: 'apps1' }, { id: 'developer', label: 'Developer', icon: 'developer' }],
  },
  { title: 'Organization', items: [{ id: 'users', label: 'Users', icon: 'user' }, { id: 'schedule', label: 'Schedule', icon: 'clock' }, { id: 'settings', label: 'Settings', icon: 'setting' }] },
]

export const adminSampleIds = adminSampleSections.flatMap((s) => s.items.map((i) => i.id))

