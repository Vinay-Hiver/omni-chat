import { useState } from 'react'
import { Icon } from '../../icons/Icon'
import { Button } from '../../components/Button'
import { Tabs } from '../../components/Tabs'
import { PageBar } from '../SharedInboxes/SharedInboxesPage'
import { ClickToEditOption, GuidedOption, SectionsOption, TabsOption } from './options'
import { useWidgetSettings } from './settings'
import './WidgetDesignOptionsPage.css'

/** Prototype only: the layout options for this page. The switcher is not part of the product. */
const OPTIONS = [
  { value: 'sections', label: '1 · Sections', about: 'One page. Collapsible groups with a summary of each, one open at a time.', Component: SectionsOption },
  { value: 'tabs', label: '2 · Tabs', about: 'Appearance, Launcher and Conversation tabs. Each fits on one screen.', Component: TabsOption },
  { value: 'canvas', label: '3 · Click to edit', about: 'The preview is the page. Click a part of the widget to edit it.', Component: ClickToEditOption },
  { value: 'guided', label: '4 · Guided setup', about: 'Numbered steps for a first-time setup, with a summary of each finished step.', Component: GuidedOption },
]

/**
 * Admin panel > Shared Inbox > a chat inbox > Widget Design. Covers every setting in chat-ux-improvements.md
 * (R2–R8) in four alternative layouts. All options share the same settings, so switching keeps your edits.
 */
export function WidgetDesignOptionsPage() {
  const api = useWidgetSettings()
  const [option, setOption] = useState(OPTIONS[0].value)
  const current = OPTIONS.find((o) => o.value === option) ?? OPTIONS[0]
  const { Component } = current

  return (
    <div className="wd-page">
      <div className="wd-switcher" role="region" aria-label="Prototype layout options">
        <span className="wd-switcher__label"><Icon name="layering" size={14} />Layout option</span>
        <Tabs tabs={OPTIONS.map(({ value, label }) => ({ value, label }))} value={option} onChange={setOption} variant="filled" aria-label="Layout option" />
        <span className="wd-switcher__about">{current.about}</span>
      </div>

      <PageBar
        title="Widget Design"
        action={<Button variant="secondary" size="sm" iconLeft={<Icon name="newtab" size={16} />}>Try live widget</Button>}
      />

      <div className="wd-body"><Component key={option} api={api} /></div>

      <div className={`wd-savebar${api.dirty ? ' wd-savebar--dirty' : ''}`}>
        <span className="wd-savebar__status">{api.dirty ? 'You have unsaved changes. The preview shows them before you save.' : 'All changes saved'}</span>
        <div className="wd-savebar__actions">
          {api.dirty && <Button variant="ghost" size="sm" onClick={api.discard}>Discard</Button>}
          <Button variant="primary" size="sm" disabled={!api.dirty || !api.settings.heading.trim()} onClick={api.save}>Save</Button>
        </div>
      </div>
    </div>
  )
}
