import { Checkbox } from '../../components/Checkbox'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'

export type ActivityEvent = { icon: IconName; text: string; time: string }
export type ActivityDay = { day: string; events: ActivityEvent[] }

export type ActivityNotesProps = {
  /** The days of activity, newest first. Each day has a divider and a list of events. */
  days: ActivityDay[]
  /** Called when the "Add a note" box is pressed. */
  onAddNote?: () => void
  /** Whether "Show only notes" is ticked. */
  onlyNotes?: boolean
  onOnlyNotesChange?: (value: boolean) => void
}

/**
 * The content of the "Activity & Notes" section: an "Add a note" box, a "Show only notes" tick, and the activity grouped by day.
 * Put it inside a `RightPanelSection`. Temporary: the note box and the day divider are plain markup, because there is no note input or divider component yet.
 */
export function ActivityNotes({ days, onAddNote, onlyNotes, onOnlyNotesChange }: ActivityNotesProps) {
  return (
    <div className="hot-rp-activity">
      <div className="hot-rp-activity__compose">
        <button type="button" className="hot-rp-activity__note" onClick={onAddNote}>+ Add a note</button>
        <div className="hot-rp-activity__only">
          <Checkbox label="Show only notes" checked={onlyNotes} onChange={(e) => onOnlyNotesChange?.(e.target.checked)} />
        </div>
      </div>
      {days.map((d) => (
        <div key={d.day} className="hot-rp-activity__day">
          <div className="hot-rp-activity__divider" role="separator" aria-label={d.day}>
            <span className="hot-rp-activity__line" />
            <span className="hot-rp-activity__pill">{d.day}</span>
            <span className="hot-rp-activity__line" />
          </div>
          <ul className="hot-rp-activity__list">
            {d.events.map((e) => (
              <li key={e.text} className="hot-rp-activity__item">
                <span className="hot-rp-activity__icon"><Icon name={e.icon} size={14} /></span>
                <div className="hot-rp-activity__text">
                  <span className="hot-rp-activity__what">{e.text}</span>
                  <span className="hot-rp-activity__time">{e.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
