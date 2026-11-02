import type { HTMLAttributes } from 'react'
import './Loader.css'

export type LoaderProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** What a screen reader says. */
  label?: string
}

/** A 48px spinner that shows something is loading. */
export function Loader({ label = 'Loading', className, ...rest }: LoaderProps) {
  return <span role="status" aria-label={label} className={['hot-loader', className].filter(Boolean).join(' ')} {...rest} />
}
