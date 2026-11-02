import { createContext, useContext, useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import './Radio.css'

type GroupContext = {
  name: string
  value: string | undefined
  disabled?: boolean
  onSelect: (value: string) => void
}
const RadioGroupContext = createContext<GroupContext | null>(null)

export type RadioGroupProps = {
  /** Label above the options. */
  label?: ReactNode
  /** Shows the red asterisk after the label. */
  required?: boolean
  /** Selected value when you control it yourself. */
  value?: string
  /** Initially selected value when the group manages itself. */
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
  name?: string
  children: ReactNode
  className?: string
}

export function RadioGroup({ label, required, value, defaultValue, onChange, disabled, name, children, className }: RadioGroupProps) {
  const generated = useId()
  const [inner, setInner] = useState(defaultValue)
  const current = value ?? inner
  const labelId = `${generated}-label`

  return (
    <RadioGroupContext.Provider
      value={{ name: name ?? generated, value: current, disabled, onSelect: (v) => { setInner(v); onChange?.(v) } }}
    >
      <div role="radiogroup" aria-labelledby={label ? labelId : undefined} aria-required={required || undefined} className={['hot-radio-group', className].filter(Boolean).join(' ')}>
        {label && (
          <span className="hot-radio-group__label" id={labelId}>
            {label}
            {required && <span className="hot-radio-group__required" aria-hidden="true">*</span>}
          </span>
        )}
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value'> & {
  /** Value this option stands for inside a RadioGroup. */
  value: string
  /** Text next to the circle. Leave out for a circle on its own. */
  label?: ReactNode
  /** Storybook only: pins keyboard focus so it can be shown without interaction. */
  forceState?: 'focus'
}

export function Radio({ value, label, forceState, className, disabled, checked, onChange, ...rest }: RadioProps) {
  const group = useContext(RadioGroupContext)
  const isDisabled = disabled ?? group?.disabled
  const classes = ['hot-radio', isDisabled && 'hot-radio--disabled', !label && 'hot-radio--bare', className].filter(Boolean).join(' ')

  return (
    <label className={classes} data-force-state={forceState}>
      <input
        {...rest}
        type="radio"
        className="hot-radio__input"
        value={value}
        name={group?.name ?? rest.name}
        disabled={isDisabled}
        checked={group ? group.value === value : checked}
        onChange={(e) => {
          group?.onSelect(value)
          onChange?.(e)
        }}
      />
      <span className="hot-radio__circle" aria-hidden="true" />
      {label}
    </label>
  )
}
