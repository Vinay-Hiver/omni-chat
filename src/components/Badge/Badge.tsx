import type { HTMLAttributes, ReactNode } from 'react'
import './Badge.css'

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** What is shown, usually a count such as `+99`. */
  children: ReactNode
  /** Default is grey, primary is blue, important is red. */
  type?: 'default' | 'primary' | 'important'
}

export function Badge({ children, type = 'default', className, ...rest }: BadgeProps) {
  return (
    <span className={['hot-badge', `hot-badge--${type}`, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  )
}
