import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Tag } from '../Tag'

export type TagsEditorProps = {
  id?: string
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: boolean
  describedBy?: string
  /** Tags wrap onto more lines (Textarea). Off keeps them on one line (Input). */
  wrap?: boolean
}

/** The tags and the text box that adds new ones. Press Enter or comma to add, Backspace on an empty box to remove the last. */
export function TagsEditor({ id, tags, onChange, placeholder, disabled, required, error, describedBy, wrap }: TagsEditorProps) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const t = draft.trim().replace(/,$/, '')
    if (t && !tags.includes(t)) onChange([...tags, t])
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className={`hot-field__tags${wrap ? ' hot-field__tags--wrap' : ''}`}>
      {tags.map((t) => (
        <Tag key={t} onRemove={disabled ? undefined : () => onChange(tags.filter((x) => x !== t))} removeLabel={`Remove ${t}`}>{t}</Tag>
      ))}
      <input
        id={id}
        className="hot-field__control hot-field__tag-input"
        value={draft}
        disabled={disabled}
        required={required && !tags.length}
        placeholder={tags.length ? undefined : placeholder}
        aria-invalid={error || undefined}
        aria-describedby={describedBy}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
      />
    </div>
  )
}
