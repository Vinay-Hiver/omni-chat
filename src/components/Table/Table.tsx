import type { ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import { Button } from '../Button'
import { Tooltip } from '../Tooltip'
import './Table.css'

export type TableColumn<Row> = {
  /** Which value of the row to show, when there is no `render`. */
  key: string
  /** The column heading. Leave empty for a column without one. */
  header?: ReactNode
  /**
   * Percentage of the table's width (`'50%'`) or a fixed size (`120` or `'80px'`).
   * Columns without a width share what is left equally, so "first 50%, second 10%, the other two equal"
   * is `['50%', '10%', undefined, undefined]`.
   */
  width?: number | string
  align?: 'left' | 'center' | 'right'
  /** Draw the cell yourself, for example with a Switch or a Badge. */
  render?: (row: Row, index: number) => ReactNode
}

export type TableAction<Row> = {
  /** Icon name from the HOT icon set, e.g. `edit`. */
  icon: IconName
  /** Describes the action. Shown as a tooltip and read by screen readers. */
  label: string
  onClick?: (row: Row, index: number) => void
  /** Draws a thin divider before this action, to set it apart (for example Delete). */
  divided?: boolean
}

export type TableProps<Row> = {
  columns: TableColumn<Row>[]
  rows: Row[]
  /** A stable id for each row. Defaults to the row's position. */
  getRowId?: (row: Row, index: number) => string | number
  /** Icon buttons (1 to 4) that appear at the right end of a row on hover or keyboard focus. */
  rowActions?: TableAction<Row>[]
  /** Makes each row clickable (and reachable with the keyboard): called with the row that was pressed. Pressing a row action does not count. */
  onRowClick?: (row: Row, index: number) => void
  /** Storybook only: pins the hover look on one row (counting from 0). */
  forceHoverRow?: number
  className?: string
  'aria-label'?: string
}

export function Table<Row extends Record<string, unknown>>({ columns, rows, getRowId, rowActions, onRowClick, forceHoverRow, className, ...rest }: TableProps<Row>) {
  return (
    <div className={['hot-table-wrap', className].filter(Boolean).join(' ')}>
      <table className="hot-table" {...rest}>
        <colgroup>
          {columns.map((c) => <col key={c.key} style={c.width !== undefined ? { width: c.width } : undefined} />)}
        </colgroup>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={`hot-table__th${c.align && c.align !== 'left' ? ` hot-table__th--${c.align}` : ''}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={getRowId ? getRowId(row, i) : i}
              className={`hot-table__row${onRowClick ? ' hot-table__row--clickable' : ''}`}
              data-force-state={forceHoverRow === i ? 'hover' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row, i) : undefined}
              onKeyDown={onRowClick ? (e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onRowClick(row, i) } } : undefined}
            >
              {columns.map((c, ci) => (
                <td key={c.key} className={`hot-table__td${c.align && c.align !== 'left' ? ` hot-table__td--${c.align}` : ''}${rowActions && ci === columns.length - 1 ? ' hot-table__td--actions' : ''}`}>
                  {c.render ? c.render(row, i) : (row[c.key] as ReactNode)}
                  {rowActions && ci === columns.length - 1 && (
                    <div className="hot-table__actions" role="group" aria-label="Row actions">
                      {rowActions.slice(0, 4).map((a) => (
                        <span key={a.label} className="hot-table__action-wrap">
                          {a.divided && <span className="hot-table__divider" aria-hidden="true" />}
                          <Tooltip content={a.label} placement="top">
                            <Button iconOnly variant="ghost" size="xs" className="hot-table__action" aria-label={a.label} onClick={(e) => { e.stopPropagation(); a.onClick?.(row, i) }}>
                              <Icon name={a.icon} size={16} />
                            </Button>
                          </Tooltip>
                        </span>
                      ))}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
