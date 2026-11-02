import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import './Popover.css'

export type PopoverPlacement = 'bottom-start' | 'bottom-end'

export type PopoverProps = {
  /** Whether the popover is showing. */
  open: boolean
  /** Called when the person clicks outside or presses Escape. Scrolling does not close it: it follows the anchor. */
  onClose: () => void
  /** The element the popover opens under, usually the button that opened it. A press on it does not count as "outside", so the button can toggle the popover itself. */
  anchorRef: RefObject<HTMLElement | null>
  /** Which edge of the anchor the popover lines up with. `bottom-start` = left edges, `bottom-end` = right edges. */
  placement?: PopoverPlacement
  /** The space in px between the anchor and the popover. */
  gap?: number
  /** Stretch to at least the width of the anchor. */
  matchAnchorWidth?: boolean
  /** What goes in it, for example a Dropdown panel. */
  children: ReactNode
  className?: string
}

/**
 * Places any panel under a trigger. It sits on top of the page (in a portal), follows the trigger while the page scrolls,
 * flips above it when there is no room below, and closes on a click outside or Escape.
 */
export function Popover({ open, onClose, anchorRef, placement = 'bottom-start', gap = 4, matchAnchorWidth, children, className }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left?: number; right?: number; minWidth?: number } | null>(null)

  const place = useCallback(() => {
    const anchor = anchorRef.current
    const pop = ref.current
    if (!anchor || !pop) return
    const a = anchor.getBoundingClientRect()
    const h = pop.offsetHeight
    const below = window.innerHeight - a.bottom - gap
    const above = a.top - gap
    // Flip above the anchor when it does not fit below and there is more room above
    const top = h > below && above > below ? Math.max(8, a.top - gap - h) : a.bottom + gap
    setPos({
      top,
      minWidth: matchAnchorWidth ? a.width : undefined,
      ...(placement === 'bottom-end' ? { right: window.innerWidth - a.right } : { left: a.left }),
    })
  }, [anchorRef, gap, matchAnchorWidth, placement])

  useLayoutEffect(() => {
    if (open) place()
    else setPos(null)
  }, [open, place, children])

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!ref.current?.contains(t) && !anchorRef.current?.contains(t)) onClose()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, onClose, place, anchorRef])

  if (!open) return null
  return createPortal(
    <div ref={ref} className={['hot-popover', className].filter(Boolean).join(' ')} style={{ ...pos, visibility: pos ? 'visible' : 'hidden' }}>
      {children}
    </div>,
    document.body,
  )
}
