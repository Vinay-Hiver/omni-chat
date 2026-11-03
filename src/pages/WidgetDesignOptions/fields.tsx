import { useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import { Button } from '../../components/Button'
import { Checkbox } from '../../components/Checkbox'
import { Input } from '../../components/Input'
import { Radio, RadioGroup } from '../../components/Radio'
import { Switch } from '../../components/Switch'
import { Textarea } from '../../components/Textarea'
import { COLOR_OPTIONS, DEFAULT_WELCOME, MAX_LAUNCHER_BYTES, SAMPLE_AGENT, VERIFICATION_SECRET } from './settings'
import type { AgentNameMode, WidgetSettingsApi } from './settings'

/**
 * One component per setting. Every layout option uses these, so the options differ only in how the page is organised,
 * never in what a field does. Each takes the shared settings (`api`) and an optional `onFocus`, which lets an option
 * switch the preview to the part being edited.
 */
type FieldProps = { api: WidgetSettingsApi; onFocus?: () => void }

export function ColorField({ api, onFocus }: FieldProps) {
  return (
    <div className="wd-field">
      <span className="wd-label" id="wd-color-label">Brand colour</span>
      <div className="wd-swatches" role="radiogroup" aria-labelledby="wd-color-label">
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c.token} type="button" role="radio" aria-checked={api.settings.color === c.token} aria-label={c.label} title={c.label}
            className={`wd-swatch${api.settings.color === c.token ? ' wd-swatch--on' : ''}`}
            style={{ '--swatch': `var(${c.token})` } as CSSProperties}
            onClick={() => { api.set('color', c.token); onFocus?.() }}
          >
            {api.settings.color === c.token && <Icon name="tick" size={14} />}
          </button>
        ))}
      </div>
      <span className="wd-hint">Used for the header, buttons, visitor messages and the launcher.</span>
    </div>
  )
}

export function LogoField({ onFocus }: FieldProps) {
  return (
    <div className="wd-field">
      <span className="wd-label">Widget logo</span>
      <div className="wd-upload-row">
        <img className="wd-thumb" src="/widget/logo.svg" width={40} height={40} alt="Current widget logo" />
        <div className="wd-upload-text">
          <div className="wd-upload-buttons"><Button variant="secondary" size="xs" onClick={onFocus}>Replace</Button></div>
          <span className="wd-hint">Shown in the widget header. Recommended 250 × 250 px.</span>
        </div>
      </div>
    </div>
  )
}

export function HeadingField({ api, onFocus }: FieldProps) {
  return (
    <Input
      label={<>Heading <span className="wd-required">*</span></>} value={api.settings.heading} maxLength={30} suffix={{ count: true }} fullWidth
      error={!api.settings.heading.trim()} helperText={!api.settings.heading.trim() ? 'Add a heading. Visitors see it at the top of the widget.' : undefined}
      onFocus={onFocus} onChange={(e) => api.set('heading', e.target.value)}
    />
  )
}

export function TaglineField({ api, onFocus }: FieldProps) {
  return <Textarea label="Tagline" value={api.settings.tagline} maxLength={200} showCount fullWidth rows={2} onFocus={onFocus} onChange={(e) => api.set('tagline', e.target.value)} />
}

export function WelcomeField({ api, onFocus }: FieldProps) {
  const custom = api.settings.welcome.trim() && api.settings.welcome.trim() !== DEFAULT_WELCOME
  return (
    <div className="wd-field wd-field--stretch">
      <Input
        label="Welcome message" value={api.settings.welcome} maxLength={120} suffix={{ count: true }} fullWidth placeholder={DEFAULT_WELCOME}
        helperText="Shown under “Hi there!” on the widget home. Leave it empty to use the default."
        onFocus={onFocus} onChange={(e) => api.set('welcome', e.target.value)}
      />
      {custom && <button type="button" className="wd-text-button" onClick={() => api.set('welcome', DEFAULT_WELCOME)}>Reset to default</button>}
    </div>
  )
}

export function LauncherIconField({ api, onFocus }: FieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const icon = api.settings.launcherIcon
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    // Errors show inline and the previous icon is kept (R2).
    if (!['image/png', 'image/jpeg'].includes(file.type)) { setError('Use a PNG or JPG image. SVG and GIF aren’t supported.'); return }
    if (file.size > MAX_LAUNCHER_BYTES) { setError('This image is over 1 MB. Try a smaller one.'); return }
    setError(null)
    api.set('launcherIcon', { url: URL.createObjectURL(file), name: file.name })
    onFocus?.()
  }
  return (
    <div className="wd-field">
      <span className="wd-label">Launcher icon</span>
      <div className="wd-upload-row">
        <span className="wd-launcher-thumb">{icon ? <img src={icon.url} alt="" /> : <Icon name="chatsupport" size={16} />}</span>
        <div className="wd-upload-text">
          <div className="wd-upload-buttons">
            <Button variant="secondary" size="xs" onClick={() => { onFocus?.(); fileRef.current?.click() }}>{icon ? 'Replace' : 'Upload image'}</Button>
            {icon && <Button variant="ghost" size="xs" onClick={() => { api.set('launcherIcon', null); setError(null) }}>Use default</Button>}
          </div>
          <span className="wd-hint">{icon ? icon.name : 'PNG or JPG up to 1 MB. Replaces the default chat bubble.'}</span>
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={onFile} />
      </div>
      {error && <span className="wd-error" role="alert"><Icon name="erroricon" size={14} />{error}</span>}
    </div>
  )
}

export function LauncherLabelField({ api, onFocus }: FieldProps) {
  return (
    <div className="wd-field wd-field--stretch">
      <Input
        label="Launcher label" value={api.settings.launcherLabel} maxLength={30} suffix={{ count: true }} fullWidth placeholder="Optional, for example Chat with us"
        helperText="Turns the launcher into a pill. Leave it empty to show the icon only."
        onFocus={onFocus} onChange={(e) => api.set('launcherLabel', e.target.value)}
      />
      {api.settings.launcherLabel && <ScriptNotice />}
    </div>
  )
}

/** G4: a label set in the widget script wins over this one. */
export function ScriptNotice() {
  return <div className="wd-note"><Icon name="info" size={14} /><span>If your widget script sets a launcher label, visitors see that one instead.</span></div>
}

export function LauncherTooltipField({ api, onFocus }: FieldProps) {
  return (
    <Input
      label="Launcher tooltip" value={api.settings.launcherTooltip} maxLength={60} suffix={{ count: true }} fullWidth placeholder="Optional, for example We usually reply in minutes"
      helperText="Shows when a visitor hovers over or tabs to the launcher. Not shown on touch screens."
      onFocus={onFocus} onChange={(e) => api.set('launcherTooltip', e.target.value)}
    />
  )
}

export function AgentNameField({ api, onFocus }: FieldProps) {
  const first = SAMPLE_AGENT.split(' ')[0]
  return (
    <div className="wd-field">
      <RadioGroup label="Agent name visitors see" name="wd-agent-name" value={api.settings.agentName} onChange={(v) => { api.set('agentName', v as AgentNameMode); onFocus?.() }}>
        <Radio value="full" label={`Full name: ${SAMPLE_AGENT}`} />
        <Radio value="first" label={`First name: ${first}`} />
        <Radio value="hidden" label="Hidden: show the widget heading and logo instead" />
      </RadioGroup>
      <span className="wd-hint">Applies to messages, typing indicators and transcript emails. Bots keep their names, and agents in Hiver always see full names.</span>
    </div>
  )
}

export function FilePickerField({ api, onFocus }: FieldProps) {
  return <Checkbox label="Let visitors attach files" checked={api.settings.filePicker} onChange={(e) => { api.set('filePicker', e.target.checked); onFocus?.() }} />
}

/** A row with a title, a line of description and a switch, optionally with more under it when on. */
export function ToggleRow({ title, description, checked, onChange, children }: { title: string; description: string; checked: boolean; onChange: (on: boolean) => void; children?: ReactNode }) {
  return (
    <div className="wd-toggle">
      <div className="wd-toggle__top">
        <div className="wd-toggle__text">
          <span className="wd-toggle__title">{title}</span>
          <span className="wd-hint wd-hint--body">{description}</span>
        </div>
        <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={title} />
      </div>
      {checked && children && <div className="wd-toggle__more">{children}</div>}
    </div>
  )
}

export function CsatField({ api }: FieldProps) {
  return <ToggleRow title="Satisfaction survey (CSAT)" description="Ask visitors to rate the chat after it’s closed." checked={api.settings.csat} onChange={(v) => api.set('csat', v)} />
}

export function HistoryField({ api, onFocus }: FieldProps) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(VERIFICATION_SECRET).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <ToggleRow
      title="Previous conversations" description="Returning visitors can see and continue their past chats with this inbox."
      checked={api.settings.history} onChange={(v) => { api.set('history', v); onFocus?.() }}
    >
      <p className="wd-hint wd-hint--body">
        Anonymous visitors see their history in the same browser only. To show it across devices, your developers sign each logged-in visitor with this secret.
      </p>
      <Input label="Identity verification secret" value={VERIFICATION_SECRET} readOnly fullWidth size="sm" action={{ label: copied ? 'Copied' : 'Copy', onClick: copy }} />
      <a className="wd-link" href="#identity-verification" onClick={(e) => e.preventDefault()}><Icon name="code" size={14} />Developer setup guide</a>
    </ToggleRow>
  )
}
