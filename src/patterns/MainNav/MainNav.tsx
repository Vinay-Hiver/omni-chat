import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import { Avatar } from '../../components/Avatar'
import { Tooltip } from '../../components/Tooltip'
import { HelpMenu, UserMenu } from './MainNavMenus'
import type { UserMenuProps } from './MainNavMenus'
import './MainNav.css'

export type MainNavIcon = IconName

export type MainNavItem = {
  /** Unique id, also the value passed to `onChange`. */
  id: string
  /** Shown as a tooltip and read by screen readers. */
  label: string
  icon: MainNavIcon
}

export type MainNavProps = {
  /** The icons under the logo. */
  items: MainNavItem[]
  /** The `id` of the selected item. */
  value?: string
  onChange?: (id: string) => void
  /** The small icons above the avatar, such as help and chat. */
  footerItems?: MainNavItem[]
  onFooterClick?: (id: string) => void
  /** The person's letter, shown at the bottom. `showStatus` adds the online or offline dot (off by default). Leave out to hide the avatar. */
  user?: { initial: string; name?: string; showStatus?: boolean; status?: 'online' | 'offline' }
  /** Fills the menu that opens from the avatar. Leave out for an avatar that does nothing when clicked. */
  userMenu?: Omit<UserMenuProps, 'onSelect'>
  /** Opens the Help Center menu when the footer item with the id `help` is clicked. On by default. */
  helpMenu?: boolean
  /** Called when a row in either menu is chosen. `menu` says which one, `id` which row. The menu closes afterwards. */
  onMenuSelect?: (menu: 'user' | 'help', id: string) => void
  /** Storybook only: pins hover on one item (by `id`), or shows a menu open without clicking. */
  forceHoverId?: string
  forceMenu?: 'user' | 'help'
  className?: string
}

/** A menu that floats to the right of the nav, with its bottom edge level with the button that opened it. */
function Flyout({ trigger, onClose, children }: { trigger: HTMLElement | null; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; bottom: number } | null>(null)
  useLayoutEffect(() => {
    if (!trigger) return
    const r = trigger.closest('.hot-main-nav')?.getBoundingClientRect() ?? trigger.getBoundingClientRect()
    const t = trigger.getBoundingClientRect()
    setPos({ left: r.right + 8, bottom: window.innerHeight - t.bottom - 4 })
  }, [trigger])
  // The menu is hidden until it is placed, so the first row takes focus once it is visible
  useEffect(() => {
    if (pos) ref.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [pos])
  useEffect(() => {
    const down = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (!ref.current?.contains(el) && !trigger?.contains(el)) onClose()
    }
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') { onClose(); trigger?.focus() } }
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key) }
  }, [trigger, onClose])
  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = [...(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLElement)
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus()
  }
  return createPortal(
    <div ref={ref} className="hot-menu-flyout" style={pos ? { left: pos.left, bottom: pos.bottom } : { visibility: 'hidden' }} onKeyDown={move}>
      {children}
    </div>,
    document.body,
  )
}

function NavIcon({ icon }: { icon: MainNavIcon }): ReactNode {
  return <Icon name={icon as IconName} size={16} />
}

function HiverLogo() {
  return (
    <svg className="hot-main-nav__logo" width={24} height={26.875} viewBox="0 0 24 26.875" fill="none" role="img" aria-label="Hiver">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.70161 0.521303C10.8878 -0.173767 12.3516 -0.173767 13.5378 0.521303L21.3323 5.08866C22.5114 5.77954 23.2371 7.05231 23.2371 8.42924V17.5952C23.2371 18.9721 22.5114 20.2449 21.3323 20.9357L13.5378 25.5031C12.3516 26.1982 10.8878 26.1982 9.70161 25.5031L1.90699 20.9357C0.727952 20.2449 0.00223246 18.9721 0.00223246 17.5952V8.42924C0.00223246 7.05231 0.727952 5.77954 1.90699 5.08866L9.70161 0.521303Z"
        fill="#FDB022"
      />
      <path d="M12.5896 12.4383C14.2855 12.4383 15.6603 13.813 15.6603 15.509V19.3276C13.9645 19.3275 12.5897 17.9528 12.5896 16.257V12.4383ZM7.98262 6.94277C9.67848 6.94277 11.054 8.31765 11.0542 10.0134V18.9996C9.35833 18.9996 7.98273 17.6248 7.98262 15.9289V6.94277Z" fill="var(--slateSurfaceDarkest)" />
    </svg>
  )
}

export function MainNav({ items, value, onChange, footerItems = [], onFooterClick, user, userMenu, helpMenu = true, onMenuSelect, forceHoverId, forceMenu, className }: MainNavProps) {
  const [openMenu, setOpenMenu] = useState<'user' | 'help' | null>(forceMenu ?? null)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const helpRef = useRef<HTMLButtonElement>(null)
  // Storybook's forceMenu needs the trigger to exist before the menu can be placed
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const close = () => setOpenMenu(null)
  const choose = (menu: 'user' | 'help') => (id: string) => { onMenuSelect?.(menu, id); close() }
  return (
    <nav className={['hot-main-nav', className].filter(Boolean).join(' ')} aria-label="Main">
      <div className="hot-main-nav__top">
        <div className="hot-main-nav__logo-cell"><HiverLogo /></div>
        <ul className="hot-main-nav__group">
          {items.map((item) => (
            <li key={item.id}>
              <Tooltip content={item.label} placement="right" portal boundary=".hot-main-nav" gap={2}>
                <button
                  type="button"
                  className="hot-main-nav__item"
                  aria-label={item.label}
                  aria-current={item.id === value ? 'page' : undefined}
                  data-force-state={item.id === forceHoverId && item.id !== value ? 'hover' : undefined}
                  onClick={() => onChange?.(item.id)}
                >
                  <NavIcon icon={item.icon} />
                </button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
      <div className="hot-main-nav__bottom">
        {footerItems.map((item) => (
          <Tooltip key={item.id} content={item.label} placement="right" portal boundary=".hot-main-nav" gap={2}>
            <button
              ref={item.id === 'help' ? helpRef : undefined}
              type="button"
              className="hot-main-nav__footer-item"
              aria-label={item.label}
              aria-haspopup={item.id === 'help' && helpMenu ? 'menu' : undefined}
              aria-expanded={item.id === 'help' && helpMenu ? openMenu === 'help' : undefined}
              data-force-state={item.id === forceHoverId || (item.id === 'help' && openMenu === 'help') ? 'hover' : undefined}
              onClick={() => { if (item.id === 'help' && helpMenu) setOpenMenu((m) => (m === 'help' ? null : 'help')); onFooterClick?.(item.id) }}
            >
              <NavIcon icon={item.icon} />
            </button>
          </Tooltip>
        ))}
        {user && (userMenu ? (
          <button
            ref={avatarRef}
            type="button"
            className="hot-main-nav__avatar-button"
            aria-label={user.name ? `Account menu, ${user.name}` : 'Account menu'}
            aria-haspopup="menu"
            aria-expanded={openMenu === 'user'}
            onClick={() => setOpenMenu((m) => (m === 'user' ? null : 'user'))}
          >
            <Avatar className="hot-main-nav__avatar" initial={user.initial} showStatus={user.showStatus} status={user.status ?? 'online'} />
          </button>
        ) : <Avatar className="hot-main-nav__avatar" initial={user.initial} showStatus={user.showStatus} status={user.status ?? 'online'} title={user.name} />)}
      </div>
      {ready && openMenu === 'user' && userMenu && (
        <Flyout trigger={avatarRef.current} onClose={close}><UserMenu {...userMenu} onSelect={choose('user')} /></Flyout>
      )}
      {ready && openMenu === 'help' && helpMenu && (
        <Flyout trigger={helpRef.current} onClose={close}><HelpMenu onSelect={choose('help')} /></Flyout>
      )}
    </nav>
  )
}
