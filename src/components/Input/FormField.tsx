import type { ReactNode } from 'react'
import './Input.css'

export type FieldSize = 'sm' | 'md'
export type ForcedState = 'hover' | 'focus' | 'disabled'

export type FormFieldProps = {
  id: string
  label?: ReactNode
  required?: boolean
  helperText?: ReactNode
  error?: boolean
  disabled?: boolean
  size?: FieldSize
  fullWidth?: boolean
  textarea?: boolean
  className?: string
  /** Storybook only: pins a visual state so it can be shown without interaction. */
  forceState?: ForcedState
  /** Contents of the bordered box: prefix, the control, and suffix. */
  boxClassName?: string
  children: ReactNode
}

/** Shared frame for Input and Textarea: label, bordered box, helper text. */
export function FormField({
  id, label, required, helperText, error, disabled, size = 'md', fullWidth, textarea, className, forceState, boxClassName, children,
}: FormFieldProps) {
  const classes = [
    'hot-field', `hot-field--${size}`, error && 'hot-field--error', disabled && 'hot-field--disabled',
    fullWidth && 'hot-field--full', textarea && 'hot-field--textarea', className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} data-force-state={forceState}>
      {label && (
        <label className="hot-field__label" htmlFor={id}>
          {label}
          {required && <span className="hot-field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className={['hot-field__box', boxClassName].filter(Boolean).join(' ')}>{children}</div>
      {helperText && <div className="hot-field__helper" id={`${id}-helper`}>{helperText}</div>}
    </div>
  )
}
