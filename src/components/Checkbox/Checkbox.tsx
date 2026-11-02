import { useEffect, useRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import './Checkbox.css'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  /** Text next to the box. Leave out for a box on its own. */
  label?: ReactNode
  /** Shows the dash instead of the check. The box looks selected. */
  indeterminate?: boolean
  /** Shows the red error border. */
  invalid?: boolean
  /** Storybook only: pins keyboard focus so it can be shown without interaction. */
  forceState?: 'focus'
}

export function Checkbox({ label, indeterminate, invalid, forceState, className, disabled, required, ...rest }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate
  }, [indeterminate])

  const classes = [
    'hot-checkbox', indeterminate && 'hot-checkbox--indeterminate', invalid && 'hot-checkbox--invalid',
    disabled && 'hot-checkbox--disabled', !label && 'hot-checkbox--bare', className,
  ].filter(Boolean).join(' ')

  return (
    <label className={classes} data-force-state={forceState}>
      <input ref={ref} type="checkbox" className="hot-checkbox__input" disabled={disabled} required={required} aria-invalid={invalid || undefined} {...rest} />
      <span className="hot-checkbox__box" aria-hidden="true">
        <svg className="hot-checkbox__mark hot-checkbox__check" viewBox="0 0 8 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 3.2 3 5 7 1" />
        </svg>
        <svg className="hot-checkbox__mark hot-checkbox__dash" viewBox="0 0 8 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 1h6" />
        </svg>
      </span>
      {label && (
        <span className="hot-checkbox__label">
          {label}
          {required && <span className="hot-checkbox__required" aria-hidden="true">*</span>}
        </span>
      )}
    </label>
  )
}
