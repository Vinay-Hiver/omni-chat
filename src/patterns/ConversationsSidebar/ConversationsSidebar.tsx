import { useState } from 'react'
import { Button } from '../../components/Button'
import { startRipple } from '../../components/ripple'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import './ConversationsSidebar.css'

export type ConversationsSidebarView = {
  /** Unique id, also the value passed to `onChange` when the view is chosen. */
  id: string
  label: string
  icon: IconName
  /** How many conversations are in the view. Leave out for a view without a count, such as Tags or Closed. */
  count?: number
}

export type ConversationsSidebarItem = {
  /** Unique id, also the value passed to `onChange`. */
  id: string
  label: string
  /** An icon name from the HOT icon set. */
  icon: IconName
  /** The unread count shown on the right, for example `99+`. Leave out for no count. For an inbox with `views`, the total of the views is shown instead. */
  count?: string
  /** Makes this row an inbox that opens to show its views. */
  views?: ConversationsSidebarView[]
  /** An inbox starts open when this is set. */
  defaultExpanded?: boolean
  /** Shows this icon on hover, in the place of the arrow (for example `settings3` on My Work). It is for display only. */
  hoverIcon?: IconName
}

export type ConversationsSidebarSection = {
  /** The small heading above the items, such as "Shared Inbox". Leave out for a group without a heading. */
  title?: string
  items: ConversationsSidebarItem[]
}

export type ConversationsSidebarProps = {
  /** The heading at the top. */
  title?: string
  sections: ConversationsSidebarSection[]
  /** The `id` of the selected item or view. */
  value?: string
  onChange?: (id: string) => void
  /** Called when the search button is pressed. */
  onSearch?: () => void
  /** Called when the plus button is pressed, for example to start a new conversation. */
  onCreate?: () => void
  /** Called when the arrow next to the plus is pressed, for example to open a menu of things to create. */
  onCreateMenu?: () => void
  /** Called when an inbox opens or closes. */
  onExpandedChange?: (id: string, expanded: boolean) => void
  /** Storybook only: pins the hover look on one item or view, by `id`. */
  forceHoverId?: string
  className?: string
}

function ItemIcon({ icon }: { icon: IconName }) {
  return <Icon name={icon} size={16} />
}

export function ConversationsSidebar({ title = 'Conversations', sections, value, onChange, onSearch, onCreate, onCreateMenu, onExpandedChange, forceHoverId, className }: ConversationsSidebarProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(sections.flatMap((sec) => sec.items.filter((i) => i.defaultExpanded).map((i) => i.id))))
  const toggle = (id: string) => {
    const next = new Set(expanded)
    const open = !next.has(id)
    if (open) next.add(id)
    else next.delete(id)
    setExpanded(next)
    onExpandedChange?.(id, open)
  }
  return (
    <nav className={['hot-conv-sidebar', className].filter(Boolean).join(' ')} aria-label={title}>
      <div className="hot-conv-sidebar__header">
        <h2 className="hot-conv-sidebar__title">{title}</h2>
        <div className="hot-conv-sidebar__actions">
          <Button iconOnly variant="ghost" size="xs" className="hot-conv-sidebar__search" aria-label="Search" onClick={onSearch}>
            <Icon name="search" size={16} />
          </Button>
          <div className="hot-conv-sidebar__split">
            <button type="button" className="hot-conv-sidebar__create" aria-label="New" onClick={onCreate}>
              <Icon name="add" size={16} />
            </button>
            <button type="button" className="hot-conv-sidebar__menu" aria-label="More options" onClick={onCreateMenu}>
              <Icon name="chevrondown" size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="hot-conv-sidebar__sections">
        {sections.map((section, si) => (
          <div key={section.title ?? si} className="hot-conv-sidebar__section">
            {section.title && <div className="hot-conv-sidebar__section-title">{section.title}</div>}
            <ul className="hot-conv-sidebar__list">
              {section.items.map((item) => {
                const hover = item.id === forceHoverId && item.id !== value ? 'hover' : undefined
                if (!item.views) {
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`hot-conv-sidebar__item${section.title ? ' hot-conv-sidebar__item--grouped' : ''}`}
                        aria-current={item.id === value ? 'page' : undefined}
                        data-force-state={hover}
                        onMouseDown={startRipple}
                        onClick={() => onChange?.(item.id)}
                      >
                        <span className="hot-conv-sidebar__item-main">
                          <ItemIcon icon={item.icon} />
                          <span className="hot-conv-sidebar__label">{item.label}</span>
                        </span>
                        {item.count && <span className="hot-conv-sidebar__count">{item.count}</span>}
                      </button>
                    </li>
                  )
                }
                const open = expanded.has(item.id)
                const total = item.views.reduce((sum, v) => sum + (v.count ?? 0), 0)
                const shown = item.count ?? (total > 0 ? (total > 99 ? '99+' : String(total)) : undefined)
                const panelId = `${item.id}-views`
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="hot-conv-sidebar__item hot-conv-sidebar__item--grouped hot-conv-sidebar__inbox"
                      aria-expanded={open}
                      aria-controls={panelId}
                      data-expanded={open}
                      data-force-state={item.id === forceHoverId ? 'hover' : undefined}
                      onMouseDown={startRipple}
                      onClick={() => toggle(item.id)}
                    >
                      <span className="hot-conv-sidebar__item-main">
                        <ItemIcon icon={item.icon} />
                        <span className="hot-conv-sidebar__label">{item.label}</span>
                      </span>
                      {/* Closed: the total, and an arrow in its place on hover. Open: nothing, and a downward arrow on hover. */}
                      <span className="hot-conv-sidebar__slot">
                        {!open && shown && <span className="hot-conv-sidebar__count">{shown}</span>}
                        <span className={`hot-conv-sidebar__chevron${item.hoverIcon ? ' hot-conv-sidebar__chevron--static' : ''}`} aria-hidden="true"><Icon name={item.hoverIcon ?? 'chevronright'} size={16} /></span>
                      </span>
                    </button>
                    <div className="hot-conv-sidebar__views-wrap" data-open={open}>
                      <ul className="hot-conv-sidebar__views" id={panelId}>
                        {item.views.map((view) => (
                          <li key={view.id}>
                            <button
                              type="button"
                              className="hot-conv-sidebar__view"
                              aria-current={view.id === value ? 'page' : undefined}
                              data-force-state={view.id === forceHoverId && view.id !== value ? 'hover' : undefined}
                              onMouseDown={startRipple}
                              onClick={() => onChange?.(view.id)}
                            >
                              <ItemIcon icon={view.icon} />
                              <span className="hot-conv-sidebar__label">{view.label}</span>
                              {view.count !== undefined && <span className="hot-conv-sidebar__view-count">{view.count > 99 ? '99+' : view.count}</span>}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
