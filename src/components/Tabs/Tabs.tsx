import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { Badge } from '../Badge'
import { startRipple } from '../ripple'
import './Tabs.css'

export type TabItem = {
  value: string
  label: string
  /** Outlined tabs only: a count shown in a Badge after the label. */
  count?: string
  disabled?: boolean
  /** Storybook only: pins hover so it can be shown without interaction. */
  forceState?: 'hover'
}

export type TabsProps = {
  tabs: TabItem[]
  /** The selected tab's value. */
  value: string
  onChange: (value: string) => void
  /** Outlined = underline tabs. Filled = a pill selector (Figma "Filled" and "Type3"). */
  variant?: 'outlined' | 'filled'
  'aria-label'?: string
  className?: string
}

/** The row of tabs only. Show the matching content yourself. */
export function Tabs({ tabs, value, onChange, variant = 'outlined', className, ...rest }: TabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabled = tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0)
    const current = enabled.indexOf(tabs.findIndex((t) => t.value === value))
    const move = (to: number) => {
      const i = enabled[(to + enabled.length) % enabled.length]
      onChange(tabs[i].value)
      refs.current[i]?.focus()
      e.preventDefault()
    }
    if (e.key === 'ArrowRight') move(current + 1)
    else if (e.key === 'ArrowLeft') move(current - 1)
    else if (e.key === 'Home') move(0)
    else if (e.key === 'End') move(enabled.length - 1)
  }

  return (
    <div role="tablist" className={['hot-tabs', `hot-tabs--${variant}`, className].filter(Boolean).join(' ')} onKeyDown={onKeyDown} {...rest}>
      {tabs.map((t, i) => {
        const selected = t.value === value
        return (
          <button
            key={t.value}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="tab"
            className="hot-tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={t.disabled}
            data-force-state={t.forceState}
            onMouseDown={(e) => { if (!t.disabled) startRipple(e) }}
            onClick={() => onChange(t.value)}
          >
            {t.label}
            {variant === 'outlined' && t.count && <Badge type="default">{t.count}</Badge>}
          </button>
        )
      })}
    </div>
  )
}
