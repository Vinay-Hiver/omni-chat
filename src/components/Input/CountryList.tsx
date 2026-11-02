import { useEffect, useMemo, useRef, useState } from 'react'
import { ListItem } from '../List'
import { Input } from './Input'
import type { ListedCountry } from './flags'
import '../Dropdown/Dropdown.css'
import './CountryList.css'

export type CountryListProps = {
  countries: ListedCountry[]
  /** The selected country's id, for example "US". */
  selectedId?: string
  onSelect: (country: ListedCountry) => void
  onClose: () => void
}

/** The country list that opens from the phone input's country button. Behaviour follows the product: search by name, flag, name and dial code per row, a blue tick on the selected row, and "No results found". */
export function CountryList({ countries, selectedId, onSelect, onClose }: CountryListProps) {
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? countries.filter((c) => c.name.toLowerCase().includes(q)) : countries
  }, [countries, query])

  useEffect(() => {
    searchRef.current?.focus()
    const onDown = (e: MouseEvent) => {
      // A press on the country button toggles the list itself, so ignore it here
      const target = e.target as Element
      if (rootRef.current && !rootRef.current.contains(target) && !target.closest('.hot-field__country')) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div ref={rootRef} className="hot-dropdown hot-country-list" role="dialog" aria-label="Choose a country">
      <div className="hot-dropdown__search">
        <Input
          search size="sm" fullWidth ref={searchRef}
          placeholder="Search countries..." aria-label="Search countries"
          value={query} onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <ul className="hot-dropdown__list hot-country-list__list" role="listbox" aria-label="Countries">
        {shown.map((c) => (
          <li key={c.id} role="presentation">
            <ListItem
              role="option"
              aria-selected={c.id === selectedId}
              rightElement={c.id === selectedId}
              leading={<span className="hot-list-el hot-country-list__flag" aria-hidden="true">{c.flag}</span>}
              label={<span className="hot-country-list__text">{c.name}<span className="hot-country-list__dial">{c.dialCode}</span></span>}
              onClick={() => onSelect(c)}
            />
          </li>
        ))}
        {!shown.length && <li className="hot-country-list__empty">No results found</li>}
      </ul>
    </div>
  )
}
