import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Avatar } from '../Avatar'
import type { AvatarProps } from '../Avatar'
import { Icon } from '../../icons'
import type { IconName } from '../../icons'
import './ListItem.css'

/* ---------- Left elements (Figma "List Elements") ---------- */

export type ListAvatarProps = Pick<AvatarProps, 'initial' | 'showStatus' | 'status' | 'size' | 'color'>

/** The Avatar component in the 24px left-element area (18px when small). */
export function ListAvatar({ initial, showStatus, status = 'online', size = 'default', color }: ListAvatarProps) {
  return (
    <span className="hot-list-el" style={size === 'small' ? { width: 18, height: 18 } : undefined}>
      <Avatar initial={initial} showStatus={showStatus} status={status} size={size} color={color} />
    </span>
  )
}

/** 14px icon centered in the 24px element area. With `background` it sits on a round grey fill (the hover colour), like an avatar. */
export function ListIcon({ name, background }: { name: IconName; background?: boolean }) {
  return <span className={`hot-list-el hot-list-icon${background ? ' hot-list-icon--round' : ''}`}><Icon name={name} size={14} /></span>
}

/** Visual-only radio, for rows that are already a button. */
export function ListRadio({ selected }: { selected?: boolean }) {
  return <span className="hot-list-el"><span className={`hot-list-radio${selected ? ' hot-list-radio--on' : ''}`} /></span>
}

/** Visual-only checkbox, for rows that are already a button. */
export function ListCheck({ selected }: { selected?: boolean }) {
  return (
    <span className="hot-list-el">
      <span className={`hot-list-check${selected ? ' hot-list-check--on' : ''}`}>
        <svg viewBox="0 0 8 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3.2 3 5 7 1" /></svg>
      </span>
    </span>
  )
}

/* ---------- The row (Figma "Lists") ---------- */

export type ListItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** The row text. With `description`, this is the heading. */
  label: ReactNode
  /** Smaller grey text under the label (Figma "Lists_Description"). */
  description?: ReactNode
  /** Left element: `ListAvatar`, `ListIcon`, `ListRadio` or `ListCheck`. Leave out for text only. */
  leading?: ReactNode
  /** Shows the right element: a blue check on a label row, or a blue chevron on a row with a description. */
  rightElement?: boolean
  /** Which mark the right element draws: a chevron (default on a row with a description) or a tick (default on a row without one). */
  trailing?: 'chevron' | 'check'
  /** The tighter size used inside dropdown menus (32px, or 28px for text only). */
  compact?: boolean
  /** Storybook only: pins hover or pressed so it can be shown without interaction. */
  forceState?: 'hover' | 'active'
}

export function ListItem({ label, description, leading, rightElement, trailing, compact, forceState, className, type = 'button', ...rest }: ListItemProps) {
  const classes = [
    'hot-list-item', compact && 'hot-list-item--compact', rightElement && 'hot-list-item--right', !leading && 'hot-list-item--no-leading',
    description && 'hot-list-item--description', className,
  ].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} data-force-state={forceState} {...rest}>
      <span className="hot-list-item__main">
        {leading}
        {description ? (
          <span className="hot-list-item__text">
            <span className="hot-list-item__heading">{label}</span>
            <span className="hot-list-item__description">{description}</span>
          </span>
        ) : (
          <span className="hot-list-item__label">{label}</span>
        )}
      </span>
      {rightElement && (
        <span className="hot-list-item__trailing" aria-hidden="true">
          {(trailing ?? (description ? 'chevron' : 'check')) === 'chevron'
            ? <Icon name="chevronright" size={14} />
            : <Icon name="tick" size={14} />}
        </span>
      )}
    </button>
  )
}
