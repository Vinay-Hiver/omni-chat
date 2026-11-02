import type { HTMLAttributes, ReactNode } from 'react'
import './Tag.css'

export type ChipColor = 'default' | 'yellow' | 'lightBlue' | 'green' | 'purple' | 'orange' | 'red' | 'violet'

export type TagProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** The text in the tag. */
  children: ReactNode
  /** 14px icon before the text, such as `<Icon name="tag" size={14} />`. */
  iconLeft?: ReactNode
  /** 14px icon after the text. Ignored when `onRemove` is set. */
  iconRight?: ReactNode
  /** The colour. Default is grey. The others are the seven pastel colours used for coloured tags. */
  color?: ChipColor
  /** Makes the tag removable: adds a border and a small close button that calls this. */
  onRemove?: () => void
  /** Accessible name for the close button. */
  removeLabel?: string
}

export function Tag({ children, iconLeft, iconRight, color = 'default', onRemove, removeLabel = 'Remove', className, ...rest }: TagProps) {
  const classes = ['hot-tag', color !== 'default' && `hot-tag--${color}`, onRemove && 'hot-tag--removable', className].filter(Boolean).join(' ')
  return (
    <span className={classes} {...rest}>
      {iconLeft && <span className="hot-tag__icon" aria-hidden="true">{iconLeft}</span>}
      {children}
      {onRemove ? (
        <button type="button" className="hot-tag__remove" aria-label={removeLabel} onClick={onRemove}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="0.95" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l6 6M9 3L3 9" />
          </svg>
        </button>
      ) : (
        iconRight && <span className="hot-tag__icon" aria-hidden="true">{iconRight}</span>
      )}
    </span>
  )
}
