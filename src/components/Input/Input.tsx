import { isValidElement, useCallback, useId, useState } from 'react'
import type { ChangeEvent, InputHTMLAttributes, ReactNode, Ref } from 'react'
import { Icon } from '../../icons'
import { FormField } from './FormField'
import type { FieldSize, ForcedState } from './FormField'
import { TagsEditor } from './TagsEditor'
import { CountryList } from './CountryList'
import { toCountry } from './flags'
import type { Country, ListedCountry } from './flags'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  /** Gives access to the text box itself, for example to focus it. Passed on to the `<input>`. */
  ref?: Ref<HTMLInputElement>
  /** Label shown above the field. Optional: leave it out for a field without one (the placeholder then names it for screen readers). */
  label?: ReactNode
  /** Small text below the field. Turns red when `error` is set. */
  helperText?: ReactNode
  /** Shows the error border and red helper text. */
  error?: boolean
  /** sm = 32px, md = 40px tall. */
  size?: FieldSize
  /** Content before the text, such as a 14px `<Icon>` or a fixed string like "https://". */
  prefix?: ReactNode
  /** Makes it a search field: a 16px search icon before the text and `type="search"`. Use with `size="sm"` inside lists and menus. */
  search?: boolean
  /** Content after the text: a 14px or 16px `<Icon>` (for example a chevron on a dropdown field), short text such as a unit, or `{ count: true }` for a live "0/50" counter (needs `maxLength`). */
  suffix?: ReactNode | { count: true }
  /** A divided action on the right edge (Figma "With CTA"), for example "Copy". */
  action?: { label: string; onClick?: () => void }
  /** Stretch to the width of the parent instead of 320px. */
  fullWidth?: boolean
  /** Turns the field into a tags input. Typed text becomes a removable Tag on Enter or comma. */
  tags?: string[]
  /** Initial tags when the field manages them itself. */
  defaultTags?: string[]
  onTagsChange?: (tags: string[]) => void
  /** Turns the field into a phone input, with a country button before the number. */
  country?: Country
  /** Called when the country button is pressed. Use it to open your own list instead of the built-in one. */
  onCountryClick?: () => void
  /** A list of countries. When given, pressing the country button opens the country list. Import `countries` for the product's list. */
  countries?: ListedCountry[]
  /** Which country in `countries` starts ticked in the list, for example "US". */
  countryId?: string
  /** Called with the country the person picked from the list. */
  onCountryChange?: (country: ListedCountry) => void
  /** Shows the country list open. Leave out to let the button open and close it. */
  countryListOpen?: boolean
  /** Storybook only: pins hover, focus or disabled so it can be shown without interaction. */
  forceState?: ForcedState
}

function isCountSuffix(s: unknown): s is { count: true } {
  return typeof s === 'object' && s !== null && !isValidElement(s) && 'count' in s
}

export function Input({
  label, helperText, error, size = 'md', prefix, search, suffix, action, fullWidth, forceState, tags, defaultTags, onTagsChange, country, onCountryClick, countries, countryId, onCountryChange, countryListOpen,
  id: idProp, className, disabled, required, maxLength, value, defaultValue, onChange, ...rest
}: InputProps) {
  const generated = useId()
  const id = idProp ?? generated
  const tagsMode = tags !== undefined || defaultTags !== undefined
  const [innerTags, setInnerTags] = useState(defaultTags ?? [])
  const currentTags = tags ?? innerTags
  const [listOpen, setListOpen] = useState(false)
  // The button shows the `country` you pass until the person picks another one from the list
  const [pickedId, setPickedId] = useState<string | undefined>()
  const activeId = pickedId ?? countryId
  const picked = pickedId ? countries?.find((c) => c.id === pickedId) : undefined
  const shownCountry = picked ? toCountry(picked) : country
  const open = countryListOpen ?? listOpen
  const closeList = useCallback(() => setListOpen(false), [])
  const [length, setLength] = useState(String(value ?? defaultValue ?? '').length)
  const wantsCount = isCountSuffix(suffix)
  const count = wantsCount && maxLength ? `${value === undefined ? length : String(value).length}/${maxLength}` : null

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target
    if (shownCountry) {
      // Phone input: keep only digits, spaces, hyphens and brackets. This also cleans pasted text.
      const cleaned = el.value.replace(/[^\d\s()-]/g, '')
      if (cleaned !== el.value) {
        const caret = (el.selectionStart ?? cleaned.length) - (el.value.length - cleaned.length)
        el.value = cleaned
        el.setSelectionRange(Math.max(caret, 0), Math.max(caret, 0))
      }
    }
    setLength(el.value.length)
    onChange?.(e)
  }

  const setTags = (next: string[]) => {
    setInnerTags(next)
    onTagsChange?.(next)
  }

  return (
    <FormField
      id={id} label={label} required={required} helperText={helperText} error={error} disabled={disabled}
      size={size} fullWidth={fullWidth} className={[className, tagsMode && 'hot-field--tags', countries && 'hot-field--has-country-list'].filter(Boolean).join(' ') || undefined} forceState={forceState}
      boxClassName={action ? 'hot-field__box--action' : undefined}
    >
      {shownCountry && (
        <button
          type="button" className="hot-field__country" disabled={disabled}
          onClick={() => (countries ? setListOpen((o) => !o) : onCountryClick?.())}
          aria-label={`Country: ${shownCountry.name} ${shownCountry.dialCode}`} aria-haspopup="dialog" aria-expanded={countries ? open : undefined}
        >
          <span className="hot-field__flag" aria-hidden="true">{shownCountry.flag}</span>
          <span className="hot-field__dial">{shownCountry.dialCode}</span>
          <span className="hot-field__chevron" aria-hidden="true">
            <Icon name="chevrondown" size={16} />
          </span>
        </button>
      )}
      {search && <span className="hot-field__affix hot-field__affix--search" aria-hidden="true"><Icon name="search" size={16} /></span>}
      {prefix && !search && <span className={`hot-field__affix${typeof prefix === 'string' ? '' : ' hot-field__affix--icon'}`}>{prefix}</span>}
      {tagsMode ? (
        <TagsEditor
          id={id} tags={currentTags} onChange={setTags} placeholder={rest.placeholder} disabled={disabled} required={required}
          error={error} describedBy={helperText ? `${id}-helper` : undefined}
        />
      ) : (
        <input
          {...rest}
          id={id}
          type={shownCountry ? 'tel' : search ? 'search' : rest.type}
          inputMode={shownCountry ? 'tel' : rest.inputMode}
          autoComplete={shownCountry ? 'tel-national' : rest.autoComplete}
          className="hot-field__control"
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? `${id}-helper` : undefined}
          aria-label={rest['aria-label'] ?? (!label && typeof rest.placeholder === 'string' ? rest.placeholder : undefined)}
        />
      )}
      {count && <span className="hot-field__affix hot-field__count">{count}</span>}
      {suffix && !wantsCount && <span className={`hot-field__affix${typeof suffix === 'string' ? '' : ' hot-field__affix--icon'}`}>{suffix as ReactNode}</span>}
      {countries && shownCountry && open && (
        <CountryList
          countries={countries} selectedId={activeId} onClose={closeList}
          onSelect={(c) => {
            setPickedId(c.id)
            setListOpen(false)
            onCountryChange?.(c)
          }}
        />
      )}
      {action && (
        <button type="button" className="hot-field__action" disabled={disabled} onClick={action.onClick}>{action.label}</button>
      )}
    </FormField>
  )
}
