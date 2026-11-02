import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { startRipple } from '../ripple'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'secondary-filled' | 'ghost' | 'error' | 'neutral'
export type ButtonSize = 'xs' | 'sm' | 'md'

type BaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** Visual style. Figma "Type": Primary, Secondary, Secondary-filled (called "Filled" in Figma), Ghost, Error, Neutral. */
  variant?: ButtonVariant
  /** xs = 28px, sm = 32px, md = 40px tall. */
  size?: ButtonSize
  /** Storybook only: pins a visual state so hover/active can be shown without interaction. */
  'data-force-state'?: 'hover' | 'active' | 'disabled'
}

type LabelButtonProps = BaseProps & {
  iconOnly?: false
  children: ReactNode
  /** 16px icon shown before the label. */
  iconLeft?: ReactNode
  /** 16px icon shown after the label. */
  iconRight?: ReactNode
}

type IconOnlyButtonProps = BaseProps & {
  iconOnly: true
  /** The 16px icon. */
  children: ReactNode
  /** Required: an icon-only button has no visible text. */
  'aria-label': string
}

export type ButtonProps = LabelButtonProps | IconOnlyButtonProps

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, type = 'button', ...rest } = props
  const classes = ['hot-btn', `hot-btn--${variant}`, `hot-btn--${size}`, props.iconOnly && 'hot-btn--icon-only', className]
    .filter(Boolean)
    .join(' ')

  if (props.iconOnly) {
    const { iconOnly: _iconOnly, children, ...buttonProps } = rest as IconOnlyButtonProps
    return (
      <button type={type} className={classes} {...buttonProps} onMouseDown={(e) => { if (!e.currentTarget.disabled) startRipple(e); buttonProps.onMouseDown?.(e) }}>
        <span className="hot-btn__icon" aria-hidden="true">{children}</span>
      </button>
    )
  }

  const { iconOnly: _iconOnly, iconLeft, iconRight, children, ...buttonProps } = rest as LabelButtonProps
  return (
    <button type={type} className={classes} {...buttonProps} onMouseDown={(e) => { if (!e.currentTarget.disabled) startRipple(e); buttonProps.onMouseDown?.(e) }}>
      {iconLeft && <span className="hot-btn__icon" aria-hidden="true">{iconLeft}</span>}
      {children}
      {iconRight && <span className="hot-btn__icon" aria-hidden="true">{iconRight}</span>}
    </button>
  )
}
