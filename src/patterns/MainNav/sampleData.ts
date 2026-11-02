import type { MainNavItem } from './MainNav'

/** The Main nav's example icons, shared by the Main nav and Page layout stories. */
export const navSampleItems: MainNavItem[] = [
  { id: 'conversations', label: 'Conversations', icon: 'conversations' },
  { id: 'notifications', label: 'Notifications', icon: 'notification' },
  { id: 'templates', label: 'Templates', icon: 'movetofolder' },
  { id: 'customers', label: 'Customers', icon: 'contact' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'admin', label: 'Admin Panel', icon: 'setting' },
]
export const navSampleFooterItems: MainNavItem[] = [
  { id: 'help', label: 'Help Center', icon: 'helpchat' },
  { id: 'chat', label: 'Instant Chat Support (24x7)', icon: 'chatsupport' },
]
export const navSampleIds = navSampleItems.map((i) => i.id)


/** The account menu's example person, shared by the Main nav and Page layout stories. */
export const navSampleUserMenu = { name: 'Praveen Borawar', email: 'praveen.b@hiverhq.co.in', availability: 'Available on Chat, Email and Voice' }
