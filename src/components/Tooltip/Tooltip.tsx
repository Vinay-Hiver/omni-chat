import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactElement, ReactNode } from 'react'
import './Tooltip.css'

export type TooltipBubbleProps = {
  children: ReactNode
  className?: string
}

/** Just the dark bubble, with no positioning. */
export function TooltipBubble({ children, className }: TooltipBubbleProps) {
  return <span className={['hot-tooltip', className].filter(Boolean).join(' ')}>{children}</span>
}

export type TooltipProps = {
  /** The text shown in the bubble. */
  content: ReactNode
  /** The element the tooltip describes. It must accept `aria-describedby`. */
  children: ReactElement<{ 'aria-describedby'?: string }>
  /** Which side of the element the bubble appears on. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Force it open or closed. Leave out to show on hover and keyboard focus. */
  open?: boolean
  /** Draws the bubble on the page itself instead of inside the element's container, so a parent that clips or sits under other content cannot hide it. Use it for tooltips inside navs and panels. */
  portal?: boolean
  /** With `portal`: a CSS selector for a parent, for example `.hot-main-nav`. The bubble is placed next to that parent's edge instead of the element's edge. */
  boundary?: string
  /** With `portal`: the space in px between the bubble and the edge it sits next to. Default 6. */
  gap?: number
}

/** How long the pointer or focus must stay before the tooltip appears, in milliseconds. */
const SHOW_DELAY = 300

export function Tooltip({ content, children, placement = 'top', open, portal, boundary, gap = 6 }: TooltipProps) {
  const id = useId()
  const [hovered, setHovered] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const wrap = useRef<HTMLSpanElement>(null)
  const [point, setPoint] = useState<{ x: number; y: number }>()
  const visible = open ?? hovered

  // For the portal bubble: find the spot next to the element, and keep it there while the page moves.
  useLayoutEffect(() => {
    if (!portal || !visible) return
    const place = () => {
      const own = wrap.current?.getBoundingClientRect()
      if (!own) return
      const edge = boundary ? wrap.current?.closest(boundary)?.getBoundingClientRect() : undefined
      // Left and right use the parent's edge when a boundary is given; the vertical centre always follows the element.
      const r = new DOMRect(edge ? (placement === 'left' || placement === 'right' ? edge.left : own.left) : own.left, edge && (placement === 'top' || placement === 'bottom') ? edge.top : own.top, edge && (placement === 'left' || placement === 'right') ? edge.width : own.width, edge && (placement === 'top' || placement === 'bottom') ? edge.height : own.height)
      if (placement === 'left' || placement === 'right') { r.y = own.top; r.height = own.height }
      if (placement === 'top' || placement === 'bottom') { r.x = own.left; r.width = own.width }
      setPoint(
        placement === 'top' ? { x: r.left + r.width / 2, y: r.top - gap }
        : placement === 'bottom' ? { x: r.left + r.width / 2, y: r.bottom + gap }
        : placement === 'left' ? { x: r.left - gap, y: r.top + r.height / 2 }
        : { x: r.right + gap, y: r.top + r.height / 2 },
      )
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [portal, visible, placement, boundary, gap])

  const show = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setHovered(true), SHOW_DELAY)
  }
  const hide = () => {
    clearTimeout(timer.current)
    setHovered(false)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <span
      ref={wrap}
      className="hot-tooltip-wrap"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {cloneElement(children, { 'aria-describedby': visible ? id : undefined })}
      {visible && !portal && (
        <span id={id} role="tooltip" className={`hot-tooltip hot-tooltip--floating hot-tooltip--${placement}`}>
          {content}
        </span>
      )}
      {visible && portal && point && createPortal(
        <span id={id} role="tooltip" className={`hot-tooltip hot-tooltip--portal hot-tooltip--portal-${placement}`} style={{ left: point.x, top: point.y }}>
          {content}
        </span>,
        document.body,
      )}
    </span>
  )
}
