import type { IconName } from '../../icons'

/**
 * The empty-state icons: 24px, 2px outline, in the icon set as `emptystate_[name]` (the slug has no underscore, for example
 * `emptystatesignature`). The conversations empty state uses the DS Conversations icon.
 */
export const emptyStateIconNames = ['signature', 'templates', 'chat', 'email', 'slack', 'voice', 'tags', 'businesshours', 'api', 'sharedinbox', 'accounts', 'contacts', 'select', 'note', 'search', 'notification', 'aiagent'] as const

export type EmptyStateIconName = (typeof emptyStateIconNames)[number] | 'conversations'

/** The icon-set name for an empty-state icon. */
export const emptyStateIconFor = (name: EmptyStateIconName): IconName => {
  if (name === 'conversations') return name
  return `emptystate${name}` as IconName
}
