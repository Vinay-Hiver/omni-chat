import { useState } from 'react'
import { Icon } from '../../icons/Icon'
import { Button } from '../../components/Button'
import { Checkbox } from '../../components/Checkbox'
import { Input } from '../../components/Input'
import { Switch } from '../../components/Switch'
import { Textarea } from '../../components/Textarea'
import { PageBar } from '../SharedInboxes/SharedInboxesPage'
import './WidgetDesignPage.css'

/**
 * Admin panel > Shared Inbox > a chat inbox > Widget Design, from the Figma frame 4:96.
 * The settings on the left drive the live widget preview on the right.
 */
export function WidgetDesignPage() {
  const [heading, setHeading] = useState('Chat with us')
  const [tagline, setTagline] = useState('Ask us anything or share your feedback')
  const [filePicker, setFilePicker] = useState(true)
  const [csat, setCsat] = useState(true)
  const [dirty, setDirty] = useState(false)
  const edit = <T,>(set: (v: T) => void) => (v: T) => { set(v); setDirty(true) }

  return (
    <div className="hot-widget-design">
      <PageBar title="Widget Design" action={<Button variant="secondary" size="sm" iconLeft={<Icon name="view" size={16} />}>Try Widget</Button>} />

      <div className="hot-widget-design__body">
        <div className="hot-widget-design__form">
          <div className="hot-widget-design__field">
            <span className="hot-widget-design__label">Widget color</span>
            <button type="button" className="hot-widget-design__swatch" aria-label="Widget color" />
          </div>

          <div className="hot-widget-design__field">
            <span className="hot-widget-design__label">Widget logo</span>
            <div className="hot-widget-design__logo">
              <Button variant="secondary" iconOnly aria-label="Upload logo" className="hot-widget-design__upload"><Icon name="fileimage" size={16} /></Button>
              <span className="hot-widget-design__hint">Recommended size: 250 × 250 px</span>
            </div>
          </div>

          <Input
            label={<>Widget heading <span className="hot-widget-design__required">*</span></>}
            value={heading} maxLength={30} suffix={{ count: true }} fullWidth
            onChange={(e) => edit(setHeading)(e.target.value)}
          />

          <Textarea label="Widget tagline" value={tagline} maxLength={200} showCount fullWidth rows={2} onChange={(e) => edit(setTagline)(e.target.value)} />

          <div className="hot-widget-design__field">
            <span className="hot-widget-design__section">Features</span>
            <Checkbox label="Display file picker on the widget" checked={filePicker} onChange={(e) => edit(setFilePicker)(e.target.checked)} />
          </div>

          <div className="hot-widget-design__card">
            <div className="hot-widget-design__card-text">
              <span className="hot-widget-design__section">CSAT</span>
              <span className="hot-widget-design__card-desc">Show CSAT (Customer satisfaction survey) to the visitor after the chat is closed</span>
            </div>
            <Switch checked={csat} onChange={(e) => edit(setCsat)(e.target.checked)} aria-label="CSAT" />
          </div>
        </div>

        <div className="hot-widget-design__stage">
          <div className="hot-widget-preview" aria-label="Widget preview">
            <div className="hot-widget-preview__header">
              <img className="hot-widget-preview__logo" src="/widget/logo.svg" width={36} height={36} alt="" />
              <div className="hot-widget-preview__titles">
                <span className="hot-widget-preview__title">{heading || 'Chat with us'}</span>
                <span className="hot-widget-preview__tagline">{tagline}</span>
              </div>
              <span className="hot-widget-preview__online" aria-label="Online" />
            </div>
            <div className="hot-widget-preview__content">
              <div className="hot-widget-preview__hero">
                <p className="hot-widget-preview__greeting">Hi there! I am <span className="hot-widget-preview__hivey">Hivey</span></p>
                <p className="hot-widget-preview__intro">Your AI assistant for company name,<br />ask a question or describe your issue</p>
              </div>
              <div className="hot-widget-preview__footer">
                <button type="button" className="hot-widget-preview__start">Start conversation</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hot-widget-design__actions">
        <Button variant="primary" size="sm" disabled={!dirty} onClick={() => setDirty(false)}>Save</Button>
      </div>
    </div>
  )
}
