import { createElement } from 'react'
import type { SVGProps } from 'react'
import { iconData } from './iconData'
import type { IconName, IconSize } from './iconData'

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'width' | 'height'> & {
  /** Icon name from the HOT icon set: the Figma name in lowercase with no spaces, e.g. `whatsapp`. */
  name: IconName
  /**
   * Artwork size in px. Each size is drawn separately in Figma with its own stroke weight:
   * 14 (stroke 1.1, non-actionable), 16 (stroke 1.3, actionable, default), 24 (stroke 1.5). 30 is only for the file-type icons (`filepdf`, `filexls`, ...).
   */
  size?: IconSize
  /** Accessible name. Leave empty for decorative icons, which are hidden from screen readers. */
  title?: string
}

const sizes: IconSize[] = [14, 16, 24, 30]

/** Uses the requested size when it exists for this icon, otherwise the closest drawn size. */
function pickSize(name: IconName, wanted: IconSize): IconSize {
  const available = sizes.filter((s) => iconData[name][s])
  return available.includes(wanted)
    ? wanted
    : available.sort((a, b) => Math.abs(a - wanted) - Math.abs(b - wanted))[0]
}

export function Icon({ name, size = 16, title, ...rest }: IconProps) {
  const drawn = pickSize(name, size)
  const elements = iconData[name][drawn] ?? []
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${drawn} ${drawn}`}
      fill="none"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {elements.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
    </svg>
  )
}
