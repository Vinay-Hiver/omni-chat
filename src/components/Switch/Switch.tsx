import type { InputHTMLAttributes, ReactNode } from 'react'
import './Switch.css'

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  /** Regular is 32x16, large is 40x20. */
  size?: 'regular' | 'large'
  /** Optional text next to the switch. */
  label?: ReactNode
  /** Storybook only: pins a visual state so it can be shown without interaction. */
  forceState?: 'hover' | 'focus'
}

export function Switch({ size = 'regular', label, forceState, className, disabled, ...rest }: SwitchProps) {
  const classes = ['hot-switch', `hot-switch--${size}`, disabled && 'hot-switch--disabled', className].filter(Boolean).join(' ')
  return (
    <label className={classes} data-force-state={forceState}>
      <input {...rest} type="checkbox" role="switch" className="hot-switch__input" disabled={disabled} />
      <span className="hot-switch__track" aria-hidden="true">
        <span className="hot-switch__knob" />
      </span>
      {label}
    </label>
  )
}
