import { useId } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../Button'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import './Modal.css'

export type ModalProps = {
  /** The heading. */
  title: string
  /** Standard has a header bar, the content and the actions on the right. Centered has no header bar: a big icon, the title and a single action in the middle. */
  layout?: 'standard' | 'centered'
  /** Width in px. Figma uses 400 and 500. */
  width?: 400 | 500
  /** Standard: a small icon name before the title, such as `delete` for a destructive modal. Centered: your own 44px icon element. */
  icon?: IconName | ReactNode
  /** Shows the close (×) button and calls this when it is pressed. */
  onClose?: () => void
  /** The content under the header. */
  children?: ReactNode
  /** The buttons, for example Cancel and a primary Button. They line up on the right. */
  actions?: ReactNode
  className?: string
}

export function Modal({ title, layout = 'standard', width = 400, icon, onClose, children, actions, className }: ModalProps) {
  const titleId = useId()
  const classes = ['hot-modal', `hot-modal--${layout}`, className].filter(Boolean).join(' ')
  const close = onClose && (
    <Button iconOnly variant="ghost" size="xs" className="hot-modal__close" aria-label="Close" onClick={onClose}>
      <Icon name="close" size={14} />
    </Button>
  )

  if (layout === 'centered') {
    return (
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={classes} style={{ width }}>
        {close && <div className="hot-modal__corner">{close}</div>}
        <div className="hot-modal__centered-body">
          {icon && <span className="hot-modal__big-icon">{icon}</span>}
          <div className="hot-modal__centered-heading">
            <h2 className="hot-modal__centered-title" id={titleId}>{title}</h2>
            {children && <div className="hot-modal__centered-text">{children}</div>}
          </div>
        </div>
        {actions && <div className="hot-modal__centered-actions">{actions}</div>}
      </div>
    )
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={classes} style={{ width }}>
      <div className={`hot-modal__header${icon ? ' hot-modal__header--icon' : ''}`}>
        <div className="hot-modal__heading">
          {typeof icon === 'string' && <span className="hot-modal__icon"><Icon name={icon as IconName} size={14} /></span>}
          <h2 className="hot-modal__title" id={titleId}>{title}</h2>
        </div>
        {close}
      </div>
      <div className="hot-modal__body">
        {children}
        {actions && <div className="hot-modal__actions">{actions}</div>}
      </div>
    </div>
  )
}

/** A grey note inside a modal, for extra information. */
export function ModalNote({ children }: { children: ReactNode }) {
  return <div className="hot-modal__note">{children}</div>
}

/** Body text for a modal: 14px, subtle. */
export function ModalText({ children }: { children: ReactNode }) {
  return <p className="hot-modal__text">{children}</p>
}
