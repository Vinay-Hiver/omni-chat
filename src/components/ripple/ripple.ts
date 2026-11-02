import type { MouseEvent } from 'react'
import './ripple.css'

/**
 * The click ripple, copied from the product's PrimeVue Ripple: a circle as wide as the longer side
 * of the element grows from the click point and fades out over 400ms.
 * Put it on an element's `onMouseDown`. The element needs `position: relative` and `overflow: hidden`.
 */
export function startRipple(event: MouseEvent<HTMLElement>) {
  const el = event.currentTarget
  let ink = el.querySelector<HTMLSpanElement>(':scope > .hot-ripple')
  if (!ink) {
    ink = document.createElement('span')
    ink.className = 'hot-ripple'
    ink.setAttribute('role', 'presentation')
    ink.setAttribute('aria-hidden', 'true')
    ink.addEventListener('animationend', () => ink?.classList.remove('hot-ripple--active'))
    el.appendChild(ink)
  }
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  ink.classList.remove('hot-ripple--active')
  ink.style.width = `${size}px`
  ink.style.height = `${size}px`
  ink.style.left = `${event.clientX - rect.left - size / 2}px`
  ink.style.top = `${event.clientY - rect.top - size / 2}px`
  void ink.offsetWidth // lets a second click restart the animation
  ink.classList.add('hot-ripple--active')
}
