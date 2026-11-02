import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import './AdminSidebar.css'

export type AdminSidebarItem = {
  /** Unique id, also the value passed to `onChange`. */
  id: string
  label: string
  /** Icon name from the HOT icon set, e.g. `setting`. */
  icon: IconName
}

export type AdminSidebarSection = {
  /** The small heading above the items. Leave out for a group without a heading, such as the top item. */
  title?: string
  items: AdminSidebarItem[]
}

export type AdminSidebarProps = {
  /** The heading at the top. */
  title?: string
  sections: AdminSidebarSection[]
  /** The `id` of the selected item. */
  value?: string
  onChange?: (id: string) => void
  /** Storybook only: pins the hover look on one item, by `id`. */
  forceHoverId?: string
  className?: string
}

export function AdminSidebar({ title = 'Admin Panel', sections, value, onChange, forceHoverId, className }: AdminSidebarProps) {
  return (
    <nav className={['hot-admin-sidebar', className].filter(Boolean).join(' ')} aria-label={title}>
      <div className="hot-admin-sidebar__header">{title}</div>
      <div className="hot-admin-sidebar__sections">
        {sections.map((section, si) => (
          <div key={section.title ?? si} className="hot-admin-sidebar__section">
            {section.title && <div className="hot-admin-sidebar__section-title">{section.title}</div>}
            <ul className={`hot-admin-sidebar__list${section.title ? ' hot-admin-sidebar__list--inset' : ''}`}>
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="hot-admin-sidebar__item"
                    aria-current={item.id === value ? 'page' : undefined}
                    data-force-state={item.id === forceHoverId && item.id !== value ? 'hover' : undefined}
                    onClick={() => onChange?.(item.id)}
                  >
                    <Icon name={item.icon} size={16} />
                    <span className="hot-admin-sidebar__label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
