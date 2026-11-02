import { useMemo, useState } from 'react'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '../Button'
import { Input } from '../Input'
import { ListAvatar, ListCheck, ListIcon, ListItem, ListRadio } from '../List'
import { Icon } from '../../icons'
import type { IconName } from '../../icons'
import type { AvatarColor } from '../Avatar'
import './Dropdown.css'

export type DropdownOption = {
  value: string
  label: string
  /** A smaller grey line under the label (for example an email address). A row with one shows a tick when it is the selected row. */
  description?: string
  /** Avatar style only: shows the status dot on this row's avatar. Off by default. */
  showStatus?: boolean
  /** Avatar style only, with `showStatus`: online (default) or offline. */
  status?: 'online' | 'offline'
  /** Avatar style only: the colour of the avatar. */
  color?: AvatarColor
  /** An icon for this row (a 14px icon from the icon set). It wins over the list's variant, so one list can mix icon rows with avatar or text rows, for example a "None" row above a list of people. */
  icon?: IconName
  /** With `icon`: puts the icon on a round grey fill (the hover colour), the way an avatar looks. Without it the icon stands alone. */
  iconBackground?: boolean
  /** Anything else for the left side of this row, for example a `ListAvatar` or `ListIcon`. Wins over `icon` and the variant. */
  leading?: React.ReactNode
}
export type DropdownVariant = 'default' | 'avatar' | 'icon' | 'checkbox' | 'radio'

export type DropdownProps = {
  /** What each row looks like. `default` is text only. */
  variant?: DropdownVariant
  options: DropdownOption[]
  /** Heading at the top of the panel. */
  title?: string
  /** Selected value (a list of values for `checkbox`). */
  value?: string | string[]
  defaultValue?: string | string[]
  onChange?: (value: string | string[]) => void
  /** Shows a search box above the options. */
  searchable?: boolean
  searchPlaceholder?: string
  /** Lets the person drag the rows into a new order. A drag handle shows on the right of a row when it is hovered. */
  reorderable?: boolean
  /** Called with the option values in their new order. The options are shown in the order you pass them, so pass them back in this order. */
  onReorder?: (values: string[]) => void
  /** Shows Cancel and Apply buttons below the options. */
  actions?: { cancelLabel?: string; applyLabel?: string; onCancel?: () => void; onApply?: () => void }
  className?: string
}

/** A row that can be dragged by the handle on its right. While dragged it follows the pointer and the other rows slide out of the way. */
function SortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <li
      ref={setNodeRef}
      role="presentation"
      className={`hot-dropdown__row${isDragging ? ' hot-dropdown__row--dragging' : ''}`}
      style={{ transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 2 : undefined }}
    >
      {children}
      <button type="button" className="hot-dropdown__grip" aria-label="Drag to reorder" onClick={(e) => e.stopPropagation()} {...attributes} {...listeners}>
        <Icon name="drag" size={14} />
      </button>
    </li>
  )
}

/** The menu panel only. Place it under a trigger yourself, for example with a popover. */
export function Dropdown({
  variant = 'default', options, title, value, defaultValue, onChange, searchable, searchPlaceholder = 'Search', reorderable, onReorder, actions, className,
}: DropdownProps) {
  const [inner, setInner] = useState<string | string[] | undefined>(defaultValue)
  const [query, setQuery] = useState('')
  const current = value ?? inner
  const selectedList = Array.isArray(current) ? current : current ? [current] : []
  const multi = variant === 'checkbox'
  // Rows without a checkbox or radio show a blue tick on the selected row
  const showTick = variant !== 'checkbox' && variant !== 'radio'

  const shown = useMemo(() => options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase())), [options, query])

  const choose = (v: string) => {
    const next = multi ? (selectedList.includes(v) ? selectedList.filter((x) => x !== v) : [...selectedList, v]) : v
    setInner(next)
    onChange?.(next)
  }

  const leadingFor = (o: DropdownOption) => {
    const on = selectedList.includes(o.value)
    if (o.leading) return o.leading
    if (o.icon) return <ListIcon name={o.icon} background={o.iconBackground} />
    switch (variant) {
      case 'avatar': return <ListAvatar initial={o.label} showStatus={o.showStatus} status={o.status ?? 'online'} color={o.color} />
      case 'icon': return undefined
      case 'checkbox': return <ListCheck selected={on} />
      case 'radio': return <ListRadio selected={on} />
      default: return undefined
    }
  }

  // Rows can only be dragged when the whole list is showing (not while it is filtered by a search).
  const canReorder = !!reorderable && !query.trim()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const values = options.map((o) => o.value)
    onReorder?.(arrayMove(values, values.indexOf(String(active.id)), values.indexOf(String(over.id))))
  }

  const row = (o: DropdownOption) => (
    <ListItem
      compact={!o.description} role="option" aria-selected={selectedList.includes(o.value)} label={o.label} description={o.description} leading={leadingFor(o)}
      rightElement={(!!o.description || showTick) && selectedList.includes(o.value)} trailing="check" onClick={() => choose(o.value)}
    />
  )

  const classes = ['hot-dropdown', !actions && 'hot-dropdown--no-actions', !searchable && 'hot-dropdown--no-search', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {title && <div className="hot-dropdown__title">{title}</div>}

      {searchable && (
        <div className="hot-dropdown__search">
          <Input search size="sm" fullWidth placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={searchPlaceholder} />
        </div>
      )}

      {canReorder ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis, restrictToParentElement]} onDragEnd={onDragEnd}>
          <SortableContext items={options.map((o) => o.value)} strategy={verticalListSortingStrategy}>
            <ul className="hot-dropdown__list" role="listbox" aria-multiselectable={multi || undefined} aria-label={title}>
              {shown.map((o) => <SortableRow key={o.value} id={o.value}>{row(o)}</SortableRow>)}
            </ul>
          </SortableContext>
        </DndContext>
      ) : (
        <ul className="hot-dropdown__list" role="listbox" aria-multiselectable={multi || undefined} aria-label={title}>
          {shown.map((o) => <li key={o.value} role="presentation">{row(o)}</li>)}
          {!shown.length && <li className="hot-dropdown__empty">No results</li>}
        </ul>
      )}

      {actions && (
        <div className="hot-dropdown__actions">
          <Button variant="secondary" size="sm" onClick={actions.onCancel}>{actions.cancelLabel ?? 'Cancel'}</Button>
          <Button variant="primary" size="sm" onClick={actions.onApply}>{actions.applyLabel ?? 'Apply'}</Button>
        </div>
      )}
    </div>
  )
}
