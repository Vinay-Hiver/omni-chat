import type { ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import { emptyStateIconFor } from './emptyStateIcons'
import type { EmptyStateIconName } from './emptyStateIcons'
import './EmptyState.css'

export type EmptyStateProps = {
  /** An icon name from the empty-state icon set (for example `signature` or `search`), or your own element. */
  icon: EmptyStateIconName | ReactNode
  /** The heading, for example "No signatures yet". */
  title: string
  /** One or two lines under the heading that say what to do next. */
  description: string
  /** The main action, when there is one, for example a primary `Button`. */
  action?: ReactNode
  className?: string
}

function Glyph({ name }: { name: EmptyStateIconName }) {
  return <Icon name={emptyStateIconFor(name)} size={24} />
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={['hot-empty-state', className].filter(Boolean).join(' ')}>
      <div className="hot-empty-state__body">
        <span className="hot-empty-state__icon">{typeof icon === 'string' ? <Glyph name={icon as EmptyStateIconName} /> : icon}</span>
        <div className="hot-empty-state__text">
          <p className="hot-empty-state__title">{title}</p>
          <p className="hot-empty-state__description">{description}</p>
        </div>
      </div>
      {action && <div className="hot-empty-state__action">{action}</div>}
    </div>
  )
}
