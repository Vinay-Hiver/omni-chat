import { useId, useState } from 'react'
import type { ChangeEvent, ReactNode, TextareaHTMLAttributes } from 'react'
import { FormField } from '../Input/FormField'
import type { ForcedState } from '../Input/FormField'
import { TagsEditor } from '../Input/TagsEditor'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Label shown above the field. */
  label?: ReactNode
  /** Small text below the field. Turns red when `error` is set. */
  helperText?: ReactNode
  /** Shows the error border and red helper text. */
  error?: boolean
  /** Shows a live "0/500" counter. Needs `maxLength`. */
  showCount?: boolean
  /** Stretch to the width of the parent instead of 320px. */
  fullWidth?: boolean
  /** Turns the field into a tags field. Typed text becomes a removable Tag on Enter or comma, and tags wrap onto more lines. */
  tags?: string[]
  /** Initial tags when the field manages them itself. */
  defaultTags?: string[]
  onTagsChange?: (tags: string[]) => void
  /** Storybook only: pins hover, focus or disabled so it can be shown without interaction. */
  forceState?: ForcedState
}

export function Textarea({
  label, helperText, error, showCount, fullWidth, forceState, tags, defaultTags, onTagsChange,
  id: idProp, className, disabled, required, maxLength, value, defaultValue, onChange, ...rest
}: TextareaProps) {
  const generated = useId()
  const id = idProp ?? generated
  const tagsMode = tags !== undefined || defaultTags !== undefined
  const [innerTags, setInnerTags] = useState(defaultTags ?? [])
  const currentTags = tags ?? innerTags
  const setTags = (next: string[]) => {
    setInnerTags(next)
    onTagsChange?.(next)
  }
  const [length, setLength] = useState(String(value ?? defaultValue ?? '').length)
  const count = showCount && maxLength ? `${value === undefined ? length : String(value).length}/${maxLength}` : null

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLength(e.target.value.length)
    onChange?.(e)
  }

  return (
    <FormField
      id={id} label={label} required={required} error={error} disabled={disabled}
      fullWidth={fullWidth} className={[className, tagsMode && 'hot-field--tags'].filter(Boolean).join(' ') || undefined} forceState={forceState} textarea
      helperText={count ? (
        <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>{helperText}</span>
          <span className="hot-field__count">{count}</span>
        </span>
      ) : helperText}
    >
      {tagsMode ? (
        <TagsEditor
          id={id} tags={currentTags} onChange={setTags} placeholder={rest.placeholder} disabled={disabled} required={required}
          error={error} describedBy={helperText || count ? `${id}-helper` : undefined} wrap
        />
      ) : (
        <textarea
          {...rest}
          id={id}
          className="hot-field__control"
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={error || undefined}
          aria-describedby={helperText || count ? `${id}-helper` : undefined}
          aria-label={rest['aria-label'] ?? (!label && typeof rest.placeholder === 'string' ? rest.placeholder : undefined)}
        />
      )}
    </FormField>
  )
}
