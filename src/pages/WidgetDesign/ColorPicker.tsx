import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'

/** A colour as hue (0–360), saturation and brightness (0–1). */
export type Hsv = { h: number; s: number; v: number }

const clamp = (n: number) => Math.min(1, Math.max(0, n))

export function hsvToHex({ h, s, v }: Hsv) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255).toString(16).padStart(2, '0')
  }
  return `#${f(5)}${f(3)}${f(1)}`
}

/** Reads a computed colour ("#rrggbb" or "rgb(r, g, b)"). Falls back to a violet when it can't be read. */
export function cssToHsv(css: string): Hsv {
  const t = css.trim()
  const rgb = t.startsWith('#')
    ? [1, 3, 5].map((i) => parseInt(t.length === 4 ? t[(i + 1) / 2].repeat(2) : t.slice(i, i + 2), 16))
    : (t.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number)
  if (rgb.length < 3 || rgb.some(Number.isNaN)) return { h: 240, s: 0.6, v: 0.9 }
  const [r, g, b] = rgb.map((n) => n / 255)
  const max = Math.max(r, g, b)
  const d = max - Math.min(r, g, b)
  const h = d === 0 ? 0 : max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return { h: (h * 60 + 360) % 360, s: max === 0 ? 0 : d / max, v: max }
}

/** Calls onMove with the pointer's position inside the element (0–1 on each axis) while it is pressed. */
function drag(onMove: (x: number, y: number) => void) {
  return (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const move = (ev: { clientX: number; clientY: number }) => {
      const r = el.getBoundingClientRect()
      onMove(clamp((ev.clientX - r.left) / r.width), clamp((ev.clientY - r.top) / r.height))
    }
    el.setPointerCapture(e.pointerId)
    move(e)
    el.onpointermove = move
    el.onpointerup = () => { el.onpointermove = null; el.onpointerup = null }
  }
}

/**
 * A saturation/brightness square with a hue strip beside it. The HOT library has no colour picker, so this one lives with the page.
 * Arrow keys move each handle too.
 */
export function ColorPicker({ value, onChange }: { value: Hsv; onChange: (v: Hsv) => void }) {
  const { h, s, v } = value
  const svKeys = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.02
    const next = { ArrowLeft: { s: s - step }, ArrowRight: { s: s + step }, ArrowUp: { v: v + step }, ArrowDown: { v: v - step } }[e.key]
    if (!next) return
    e.preventDefault()
    onChange({ h, s: clamp(next.s ?? s), v: clamp(next.v ?? v) })
  }
  const hueKeys = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 30 : 5
    const d = { ArrowUp: step, ArrowDown: -step }[e.key]
    if (d === undefined) return
    e.preventDefault()
    onChange({ h: Math.min(360, Math.max(0, h + d)), s, v })
  }

  return (
    <div className="hot-wd-picker">
      <div
        className="hot-wd-picker__sv" style={{ '--hue': `hsl(${h} 100% 50%)` } as CSSProperties}
        role="slider" tabIndex={0} aria-label="Saturation and brightness" aria-valuetext={`Saturation ${Math.round(s * 100)}%, brightness ${Math.round(v * 100)}%`}
        onPointerDown={drag((x, y) => onChange({ h, s: x, v: 1 - y }))} onKeyDown={svKeys}
      >
        <span className="hot-wd-picker__dot" style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%` }} />
      </div>
      {/* Red at the top, round through violet, blue, green and yellow, back to red. */}
      <div
        className="hot-wd-picker__hue" role="slider" tabIndex={0} aria-label="Hue" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(h)}
        onPointerDown={drag((_, y) => onChange({ h: (1 - y) * 360, s, v }))} onKeyDown={hueKeys}
      >
        <span className="hot-wd-picker__bar" style={{ top: `${(1 - h / 360) * 100}%` }} />
      </div>
    </div>
  )
}
