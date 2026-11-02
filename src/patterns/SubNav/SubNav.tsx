import { useEffect, useRef, useState } from 'react'
import { Dropdown } from '../../components/Dropdown'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import './SubNav.css'

export type SubNavItem = {
  /** Unique id, also the value passed to `onChange`. */
  id: string
  label: string
  /** An icon name from the HOT icon set. */
  icon: IconName
}

export type SubNavProps = {
  /** The heading at the top, for example the name of the inbox being set up. */
  title: string
  /** The small line under the heading, for example the inbox's email address. */
  subtitle?: string
  items: SubNavItem[]
  /** The `id` of the selected item. */
  value?: string
  onChange?: (id: string) => void
  /** Called when the back arrow is pressed. Leave out to hide the arrow. */
  onBack?: () => void
  /** Called when the title (or the arrow next to it) is pressed, for example to switch to another inbox. Leave out for a plain title. */
  onTitleClick?: () => void
  /** How the arrow beside the title looks: a boxed button (default) or a bare arrow. Only shown when `onTitleClick` is set. */
  switcher?: 'box' | 'plain'
  /** Inboxes to switch between. When given, pressing the heading opens a menu with these (a name, and a smaller line such as the email address). */
  switchOptions?: { value: string; label: string; description?: string }[]
  /** The `value` of the inbox that is open now. It gets the tick in the menu. */
  switchValue?: string
  onSwitch?: (value: string) => void
  /** Storybook only: shows the switch menu open. */
  forceSwitchOpen?: boolean
  /** Storybook only: pins the hover look on one item, by `id`. */
  forceHoverId?: string
  className?: string
}

function ItemIcon({ icon }: { icon: IconName }) {
  return <Icon name={icon} size={16} />
}

export function SubNav({ title, subtitle, items, value, onChange, onBack, onTitleClick, switcher = 'box', switchOptions, switchValue, onSwitch, forceSwitchOpen, forceHoverId, className }: SubNavProps) {
  const canSwitch = !!switchOptions?.length
  const [menuOpen, setMenuOpen] = useState(!!forceSwitchOpen)
  const menuRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!menuOpen) return
    const down = (e: MouseEvent) => { const t = e.target as Node; if (!menuRef.current?.contains(t) && !headRef.current?.contains(t)) setMenuOpen(false) }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuOpen(false); headRef.current?.focus() } }
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key) }
  }, [menuOpen])
  const heading = (
    <>
      <span className="hot-sub-nav__text">
        <span className="hot-sub-nav__title">{title}</span>
        {subtitle && <span className="hot-sub-nav__subtitle">{subtitle}</span>}
      </span>
      {(onTitleClick || canSwitch) && <span className={`hot-sub-nav__switch${switcher === 'plain' ? ' hot-sub-nav__switch--plain' : ''}`} aria-hidden="true"><Icon name="chevrondown" size={16} /></span>}
    </>
  )
  return (
    <nav className={['hot-sub-nav', !onBack && !subtitle && !onTitleClick && !canSwitch && 'hot-sub-nav--simple', className].filter(Boolean).join(' ')} aria-label={title}>
      <div className="hot-sub-nav__header">
        {onBack && (
          <button type="button" className="hot-sub-nav__back" aria-label="Back" onClick={onBack}>
            <Icon name="chevarrowleft" size={16} />
          </button>
        )}
        {onTitleClick || canSwitch ? (
          <button
            ref={headRef} type="button" className="hot-sub-nav__heading hot-sub-nav__heading--button" data-open={menuOpen || undefined}
            aria-haspopup={canSwitch ? 'listbox' : undefined} aria-expanded={canSwitch ? menuOpen : undefined}
            onClick={() => { if (canSwitch) setMenuOpen((o) => !o); onTitleClick?.() }}
          >{heading}</button>
        ) : (
          <div className="hot-sub-nav__heading">{heading}</div>
        )}
      </div>
      {menuOpen && canSwitch && (
        <div ref={menuRef} className="hot-sub-nav__menu">
          <Dropdown options={switchOptions!} value={switchValue} onChange={(v) => { onSwitch?.(String(v)); setMenuOpen(false) }} />
        </div>
      )}
      <ul className="hot-sub-nav__list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="hot-sub-nav__item"
              aria-current={item.id === value ? 'page' : undefined}
              data-force-state={item.id === forceHoverId && item.id !== value ? 'hover' : undefined}
              onClick={() => onChange?.(item.id)}
            >
              <ItemIcon icon={item.icon} />
              <span className="hot-sub-nav__label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
