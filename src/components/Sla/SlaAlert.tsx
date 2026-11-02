import type { HTMLAttributes } from 'react'
import { Icon } from '../../icons/Icon'
import { slaMessage, slaNames } from './sla'
import type { SlaKind, SlaStatus } from './sla'
import './Sla.css'

export type SlaAlertProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  /** Which time the alert is about: first response time (`frt`) or resolution time (`rt`). */
  kind: SlaKind
  /** Where that time stands. Sets the colours and the wording. */
  status: SlaStatus
  /** The time shown in the text, for example "6:00 PM tomorrow". The words around it come from `kind` and `status`. */
  time: string
  /** Makes the whole bar a button, for example to open the details. Without it the bar is plain. */
  onClick?: () => void
}

export function SlaAlert({ kind, status, time, onClick, className, ...rest }: SlaAlertProps) {
  const message = slaMessage(kind, status, time)
  const classes = ['hot-sla-alert', `hot-sla-alert--${status}`, onClick && 'hot-sla-alert--button', className].filter(Boolean).join(' ')
  const content = (
    <>
      <span className="hot-sla-alert__main">
        <span className="hot-sla-alert__badge" aria-hidden="true"><Icon name="boltfilled" /></span>
        <span className="hot-sla-alert__message">{message}</span>
      </span>
      <Icon name="chevrondown" size={14} />
    </>
  )
  const label = `${slaNames[kind]}: ${message}`
  return onClick ? (
    <button type="button" className={classes} aria-label={label} onClick={onClick} {...(rest as HTMLAttributes<HTMLButtonElement>)}>{content}</button>
  ) : (
    <div className={classes} role="group" aria-label={label} {...(rest as HTMLAttributes<HTMLDivElement>)}>{content}</div>
  )
}
