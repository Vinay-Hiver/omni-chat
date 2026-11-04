import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import { Button } from '../../components/Button'
import { Dropdown } from '../../components/Dropdown'
import { Input } from '../../components/Input'
import { Popover } from '../../components/Popover'
import { Radio, RadioGroup } from '../../components/Radio'
import { Switch } from '../../components/Switch'
import { Tabs } from '../../components/Tabs'
import { Tag } from '../../components/Tag'
import { Textarea } from '../../components/Textarea'
import { ColorPicker, cssToHsv, hsvToHex } from './ColorPicker'
import { DEFAULT_WELCOME, loadSettings, readAsDataUrl, saveSettings } from './widgetSettings'
import type { WidgetSettings } from './widgetSettings'
import type { Hsv } from './ColorPicker'
import { PageBar } from '../SharedInboxes/SharedInboxesPage'
import './WidgetDesignPage.css'

const SAMPLE_AGENT = 'John Cole'
const VERIFICATION_SECRET = 'hv_live_7f3a9c21e84b4d0f9a6e52c1b8d3f047'
const MAX_LAUNCHER_BYTES = 1024 * 1024
const MAX_LOGO_PX = 250
const DEFAULT_LOGO = '/widget/logo-placeholder.svg' // Figma 28:19568, shown until a logo is uploaded
const AVATARS = ['/widget/avatar-1.jpg', '/widget/avatar-2.png', '/widget/avatar-3.png', '/widget/avatar-4.jpg']

/** The widget colour starts on the violet token; picking a colour replaces it with that colour. */
const DEFAULT_COLOR = '--primarySurfaceDefault'

type GroupId = 'appearance' | 'launcher' | 'conversation'
type Preview = 'home' | 'launcher' | 'chat'
type AgentName = 'full' | 'first' | 'hidden'
/** Two layouts to compare: collapsible cards, or underline tabs with one group's fields at a time. */
type Layout = 'cards' | 'tabs'
/** Two designs for reaching previous conversations in the widget: a ⋮ menu in the chat header (Figma 33:25930), or a Chat / History bar at the bottom (Figma 33:25931). */
type HistoryDesign = 'menu' | 'nav'
const PAST_CHATS = [{ id: 1, date: '12 Oct' }, { id: 2, date: '12 Oct' }, { id: 3, date: '12 Oct' }]
/** Each group has its own preview, so opening a group turns the preview to the part it changes. */
const PREVIEW_FOR: Record<GroupId, Preview> = { appearance: 'home', launcher: 'launcher', conversation: 'chat' }

/** Untitled UI "dots-vertical" (HOT has no such icon). Strokes in currentColor, so it takes the button's text colour. */
export function DotsVertical() {
  const dot = (y: number) => <path d={`M12 ${y + 1}a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z`} />
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dot(12)}{dot(5)}{dot(19)}
    </svg>
  )
}

/** A collapsible card: the title bar, and the fields under it when open (Figma 20:14589). In the tabs layout, just the open group's fields. */
function Group({ title, open, onToggle, layout, children }: { title: string; open: boolean; onToggle: () => void; layout: Layout; children: ReactNode }) {
  if (layout === 'tabs') return open ? <section className="hot-wd-panel" aria-label={title}>{children}</section> : null
  return (
    <section className={`hot-wd-group${open ? ' hot-wd-group--open' : ''}`}>
      <button type="button" className="hot-wd-group__head" aria-expanded={open} onClick={onToggle}>
        <span>{title}</span>
        <Icon name={open ? 'chevrontop' : 'chevrondown'} size={16} />
      </button>
      {open && <div className="hot-wd-group__body">{children}</div>}
    </section>
  )
}

/** One row of the Features list (Figma 30:20239): a title, a description and a switch. Extra content shows under it when on. */
function ToggleCard({ title, description, checked, onChange, children }: { title: string; description: string; checked: boolean; onChange: (on: boolean) => void; children?: ReactNode }) {
  return (
    <div className="hot-wd-card">
      <div className="hot-wd-card__top">
        <div className="hot-wd-card__text">
          <span className="hot-wd-card__title">{title}</span>
          <span className="hot-wd-card__desc">{description}</span>
        </div>
        <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={title} />
      </div>
      {checked && children && <div className="hot-wd-card__more">{children}</div>}
    </div>
  )
}

/**
 * Admin panel > Shared Inbox > a chat inbox > Widget Design (Figma 20:14496 Appearance, 20:15738 Launcher, 20:15220 Conversation).
 * The settings from chat-ux-improvements.md sit in three groups, one open at a time, and the preview on the right
 * follows the open group and updates as the admin types (R8).
 */
export function WidgetDesignPage() {
  const [layout, setLayout] = useState<Layout>('tabs')
  const [open, setOpen] = useState<GroupId | null>('appearance')
  const [preview, setPreview] = useState<Preview>('home')
  // Every setting starts from the last save, so a reload shows what was saved.
  const [saved] = useState(loadSettings)
  // Appearance
  const [color, setColor] = useState(saved.color)
  const [hsv, setHsv] = useState<Hsv>(() => saved.hsv ?? cssToHsv(getComputedStyle(document.documentElement).getPropertyValue(DEFAULT_COLOR)))
  const [hsvPicked, setHsvPicked] = useState(saved.hsv !== null)
  const [colorMenu, setColorMenu] = useState(false)
  const [optionsMenu, setOptionsMenu] = useState(false)
  const [heading, setHeading] = useState(saved.heading)
  const [tagline, setTagline] = useState(saved.tagline)
  const [welcome, setWelcome] = useState(saved.welcome)
  const [logo, setLogo] = useState(saved.logo)
  const [logoError, setLogoError] = useState<string | null>(null)
  // Launcher (R2–R4)
  const [launcherIcon, setLauncherIcon] = useState(saved.launcherIcon)
  const [launcherError, setLauncherError] = useState<string | null>(null)
  const [launcherLabel, setLauncherLabel] = useState(saved.launcherLabel)
  const [launcherTooltip, setLauncherTooltip] = useState(saved.launcherTooltip)
  // Conversation (R5, R7)
  const [agentName, setAgentName] = useState<AgentName>(saved.agentName)
  const [filePicker, setFilePicker] = useState(saved.filePicker)
  const [csat, setCsat] = useState(saved.csat)
  const [history, setHistory] = useState(saved.history)
  const [historyDesign, setHistoryDesign] = useState<HistoryDesign>(saved.historyDesign)
  const [chatView, setChatView] = useState<'chat' | 'history'>('chat')
  const [chatMenu, setChatMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const swatchRef = useRef<HTMLButtonElement>(null)
  const optionsRef = useRef<HTMLButtonElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const chatMenuRef = useRef<HTMLSpanElement>(null)

  // The ⋮ menu closes on a click anywhere outside it, so its button only stays highlighted while the menu is really open.
  useEffect(() => {
    if (!chatMenu) return
    const close = (e: PointerEvent) => { if (!chatMenuRef.current?.contains(e.target as Node)) setChatMenu(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [chatMenu])

  const edit = <T,>(set: (v: T) => void) => (v: T) => { set(v); setDirty(true) }
  const toggle = (g: GroupId) => { setOpen(open === g ? null : g); if (open !== g) setPreview(PREVIEW_FOR[g]) }
  const showTab = (g: GroupId) => { setOpen(g); setPreview(PREVIEW_FOR[g]) }
  // Tabs always show one group, so switching to them opens Appearance if every card was closed.
  const switchLayout = (l: Layout) => { setLayout(l); if (l === 'tabs' && !open) showTab('appearance') }

  const onLauncherFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    // Errors show inline and the previous icon is kept (R2).
    if (!['image/png', 'image/jpeg'].includes(file.type)) { setLauncherError('Use a PNG or JPG image. SVG and GIF aren’t supported.'); return }
    if (file.size > MAX_LAUNCHER_BYTES) { setLauncherError('This image is over 1 MB. Try a smaller one.'); return }
    // Kept as a data URL, so the saved icon also shows after a reload.
    readAsDataUrl(file).then((url) => {
      setLauncherError(null)
      setLauncherIcon({ url, name: file.name })
      setDirty(true)
      setPreview('launcher')
    }, () => setLauncherError('This image couldn’t be read. Try another file.'))
  }

  // The widget logo: PNG or JPG, at most 250 × 250 px. A refused image keeps the current logo. "Change logo" replaces it.
  const onLogoFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) { setLogoError('Use a PNG or JPG image.'); return }
    readAsDataUrl(file).then((url) => {
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth > MAX_LOGO_PX || img.naturalHeight > MAX_LOGO_PX) {
        setLogoError(`Choose an image less than ${MAX_LOGO_PX} × ${MAX_LOGO_PX} pixels.`)
        return
      }
      setLogoError(null)
      setLogo({ url, name: file.name })
      setDirty(true)
      setPreview('home')
    }
    img.onerror = () => setLogoError('This image couldn’t be read. Try another file.')
    img.src = url
    }, () => setLogoError('This image couldn’t be read. Try another file.'))
  }

  // Try Widget: a modal with an empty page and the live widget in its corner, using the settings as they are now.
  const [trying, setTrying] = useState(false)
  // 'closing' keeps the widget on screen while it plays its exit animation.
  const [tryState, setTryState] = useState<'closed' | 'open' | 'closing'>('closed')
  const tryOpen = tryState === 'open'
  // After a click on the launcher, its tooltip stays hidden until the pointer leaves and comes back.
  const [tipQuiet, setTipQuiet] = useState(false)
  const tryWidget = () => { setTrying(true); setTryState('closed') }
  useEffect(() => {
    if (!trying) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setTrying(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [trying])

  const save = () => {
    const settings: WidgetSettings = {
      color, hsv: hsvPicked ? hsv : null, heading, tagline, welcome, logo, launcherIcon, launcherLabel, launcherTooltip,
      agentName, filePicker, csat, history, historyDesign,
    }
    const ok = saveSettings(settings)
    setSaveError(!ok)
    if (ok) setDirty(false)
  }

  const copySecret = () => {
    navigator.clipboard?.writeText(VERIFICATION_SECRET).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Clearing the welcome message restores the default (R6). Hidden agent names show the widget heading instead (R5).
  const headingShown = heading.trim() || 'Chat with us'
  const welcomeShown = welcome.trim() || DEFAULT_WELCOME
  const agentShown = agentName === 'full' ? SAMPLE_AGENT : agentName === 'first' ? SAMPLE_AGENT.split(' ')[0] : headingShown
  const widgetStyle = { '--widget-color': color } as CSSProperties
  const showHistory = history && chatView === 'history'
  // Design A: the ⋮ menu holds Previous conversations and End chat.
  const historyMenu = history && historyDesign === 'menu' && (
    <span className="hot-wd-menu-anchor" ref={chatMenuRef}>
      <button type="button" className={`hot-wd-icon-btn${chatMenu ? ' hot-wd-icon-btn--on' : ''}`} aria-label="More options" aria-haspopup="menu" aria-expanded={chatMenu} onClick={() => setChatMenu((o) => !o)}>
        <DotsVertical />
      </button>
      {chatMenu && (
        <span className="hot-wd-menu" role="menu">
          <button type="button" role="menuitem" onClick={() => { setChatMenu(false); setChatView('history'); setPreview('chat') }}><span className="hot-wd-mask hot-wd-mask--16" style={{ '--mask': 'url(/widget/clock-fast-forward.svg)' } as CSSProperties} />Previous conversations</button>
          <button type="button" role="menuitem" onClick={() => setChatMenu(false)}><Icon name="logout" size={16} />End chat</button>
        </span>
      )}
    </span>
  )

  // Design B: a Chat / History bar under the widget.
  const historyNav = history && historyDesign === 'nav' && (
    <nav className="hot-wd-nav" aria-label="Widget">
      <button type="button" aria-current={!showHistory || undefined} onClick={() => setChatView('chat')}>
        <span className="hot-wd-mask" style={{ '--mask': 'url(/widget/message-dots-circle.svg)' } as CSSProperties} />Chat
      </button>
      <button type="button" aria-current={showHistory || undefined} onClick={() => { setChatView('history'); setPreview('chat') }}>
        <span className="hot-wd-mask" style={{ '--mask': 'url(/widget/clock-fast-forward.svg)' } as CSSProperties} />History
      </button>
    </nav>
  )
  // The widget's home screen, shared by the preview and the Try Widget modal.
  const homeView = (
      <>
        <div className="hot-wd-widget__header">
          <img className="hot-wd-widget__logo" src={logo?.url ?? DEFAULT_LOGO} width={40} height={40} alt="" />
          <div className="hot-wd-widget__titles">
            <span className="hot-wd-widget__title">{headingShown}</span>
            <span className="hot-wd-widget__subtitle">{tagline}</span>
          </div>
          {historyMenu}
        </div>
        <div className="hot-wd-home">
          <div className="hot-wd-home__hero">
            <div className="hot-wd-avatars">{AVATARS.map((src) => <img key={src} src={src} width={32} height={32} alt="" />)}</div>
            <div className="hot-wd-home__text">
              <p className="hot-wd-home__greeting">Hi there!</p>
              <p className="hot-wd-home__welcome">{welcomeShown}</p>
            </div>
          </div>
        </div>
        <div className="hot-wd-widget__footer"><span className="hot-wd-start">Start Conversation</span></div>
        {historyNav}
      </>
  )

  const pickColor = (next: Hsv) => { setHsv(next); setHsvPicked(true); edit(setColor)(hsvToHex(next)); setPreview('home') }

  return (
    <div className="hot-wd">
      <PageBar
        title={
          <span className="hot-wd__title">
            Widget Design
            <button
              ref={optionsRef} type="button" className="hot-wd-options" aria-haspopup="true" aria-expanded={optionsMenu}
              onClick={() => setOptionsMenu((o) => !o)}
            >
              Design options
              <Icon name="chevrondown" size={16} />
            </button>
            <Popover open={optionsMenu} onClose={() => setOptionsMenu(false)} anchorRef={optionsRef}>
              <div className="hot-wd-options__menu">
                <Dropdown
                  variant="radio" title="Widget design layout" value={layout}
                  onChange={(v) => switchLayout(v as Layout)}
                  options={[{ value: 'cards', label: 'Cards' }, { value: 'tabs', label: 'Tabs' }]}
                />
                <Dropdown
                  variant="radio" title="Previous chat" value={historyDesign}
                  onChange={(v) => { edit(setHistoryDesign)(v as HistoryDesign); setChatView('chat'); setChatMenu(false); setPreview('chat') }}
                  options={[{ value: 'nav', label: 'Bottom nav' }, { value: 'menu', label: 'Overflow menu' }]}
                />
              </div>
            </Popover>
          </span>
        }
        action={
          <span className="hot-wd__actions-bar">
            <Button variant="secondary-filled" size="sm" onClick={tryWidget}>Try Widget</Button>
            {/* The visitor's side on its own page, as a stakeholder would see it on a website. */}
            <Button variant="secondary-filled" size="sm" iconLeft={<Icon name="newtab" size={16} />} onClick={() => window.open('/chat-interaction', '_blank', 'noopener')}>Open in new tab</Button>
          </span>
        } />

      <div className="hot-wd__body">
        <div className={`hot-wd__form hot-wd__form--${layout}`}>
          {layout === 'tabs' && (
            <Tabs
              className="hot-wd__group-tabs" aria-label="Settings" value={open ?? 'appearance'} onChange={(v) => showTab(v as GroupId)}
              tabs={[{ value: 'appearance', label: 'Appearance' }, { value: 'launcher', label: 'Launcher' }, { value: 'conversation', label: 'Conversation' }]}
            />
          )}
          <Group title="Appearance" open={open === 'appearance'} onToggle={() => toggle('appearance')} layout={layout}>
            <div className="hot-wd-field">
              <span className="hot-wd-label">Widget color</span>
              <button ref={swatchRef} type="button" className="hot-wd-swatch" style={widgetStyle} aria-label="Widget color" aria-haspopup="true" aria-expanded={colorMenu} onClick={() => setColorMenu((o) => !o)} />
              <Popover open={colorMenu} onClose={() => setColorMenu(false)} anchorRef={swatchRef}>
                <ColorPicker value={hsv} onChange={pickColor} />
              </Popover>
            </div>

            <div className="hot-wd-field">
              <span className="hot-wd-label">Widget logo</span>
              <div className="hot-wd-logo-row">
                {logo ? (
                  // One logo at a time: to change it, remove this one first.
                  <span className="hot-wd-logo">
                    <img src={logo.url} alt={`Widget logo: ${logo.name}`} />
                    <button type="button" className="hot-wd-logo__remove" aria-label="Remove logo" onClick={() => { setLogo(null); setLogoError(null); setDirty(true) }}>
                      <Icon name="close" size={14} />
                    </button>
                  </span>
                ) : (
                  <button type="button" className="hot-wd-logo hot-wd-logo--empty" aria-label="Upload logo" onClick={() => logoRef.current?.click()}>
                    <Icon name="fileimage" size={16} />
                  </button>
                )}
                <div className="hot-wd-logo-row__text">
                  <button type="button" className="hot-wd-logo-row__action" onClick={() => logoRef.current?.click()}>{logo ? 'Change logo' : 'Upload logo'}</button>
                  {/* An error replaces the guideline, in red, until a valid image is chosen. */}
                  <span className={`hot-wd-logo-row__hint${logoError ? ' hot-wd-logo-row__hint--error' : ''}`} role={logoError ? 'alert' : undefined}>
                    {logoError ?? 'PNG or JPG, up to 250 × 250 px. Square works best.'}
                  </span>
                </div>
                <input ref={logoRef} type="file" accept="image/png,image/jpeg" hidden onChange={onLogoFile} />
              </div>
            </div>

            <Input label="Widget heading" value={heading} maxLength={30} suffix={{ count: true }} fullWidth onFocus={() => setPreview('home')} onChange={(e) => edit(setHeading)(e.target.value)} />
            <Input label="Widget tagline" value={tagline} maxLength={40} suffix={{ count: true }} fullWidth onFocus={() => setPreview('home')} onChange={(e) => edit(setTagline)(e.target.value)} />
            <Textarea
              label="Welcome message" value={welcome} maxLength={120} showCount={welcome.length > 100} fullWidth rows={3} placeholder={DEFAULT_WELCOME}
              helperText="Shown under “Hi there!”. Leave it empty to use the default."
              onFocus={() => setPreview('home')} onChange={(e) => edit(setWelcome)(e.target.value)}
            />
          </Group>

          <Group title="Launcher" open={open === 'launcher'} onToggle={() => toggle('launcher')} layout={layout}>
            <div className="hot-wd-field">
              <span className="hot-wd-label">Launcher icon</span>
              <div className="hot-wd-logo-row">
                {/* Same pattern as Widget logo. With no upload, the default launcher shows, so the admin can match it to the preview. */}
                <span className="hot-wd-logo hot-wd-logo--launcher" style={widgetStyle}>
                  {launcherIcon ? <img src={launcherIcon.url} alt={`Launcher icon: ${launcherIcon.name}`} /> : <Icon name="chatsupport" size={16} />}
                  {launcherIcon && (
                    <button type="button" className="hot-wd-logo__remove" aria-label="Remove launcher icon" onClick={() => { setLauncherIcon(null); setLauncherError(null); setDirty(true) }}>
                      <Icon name="close" size={14} />
                    </button>
                  )}
                </span>
                <div className="hot-wd-logo-row__text">
                  <button type="button" className="hot-wd-logo-row__action" onClick={() => fileRef.current?.click()}>{launcherIcon ? 'Change icon' : 'Upload icon'}</button>
                  {/* An error replaces the guideline, in red, until a valid image is chosen. */}
                  <span className={`hot-wd-logo-row__hint${launcherError ? ' hot-wd-logo-row__hint--error' : ''}`} role={launcherError ? 'alert' : undefined}>
                    {launcherError ?? 'PNG or JPG, up to 1 MB. Replaces the default chat bubble.'}
                  </span>
                </div>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={onLauncherFile} />
              </div>
            </div>

            <Input
              label="Launcher label" value={launcherLabel} maxLength={30} suffix={{ count: true }} fullWidth placeholder="Chat with us"
              helperText={launcherLabel ? 'If your widget script sets a launcher label, visitors see that one instead.' : 'Optional. Turns the launcher into a pill.'}
              onFocus={() => setPreview('launcher')} onChange={(e) => edit(setLauncherLabel)(e.target.value)}
            />
            <Input
              label="Launcher tooltip" value={launcherTooltip} maxLength={60} suffix={{ count: true }} fullWidth placeholder="We reply in minutes"
              helperText="Optional. Shows on hover and keyboard focus, not on touch screens."
              onFocus={() => setPreview('launcher')} onChange={(e) => edit(setLauncherTooltip)(e.target.value)}
            />
          </Group>

          <Group title="Conversation" open={open === 'conversation'} onToggle={() => toggle('conversation')} layout={layout}>
            {/* Figma 30:20320 */}
            <div className="hot-wd-section">
              <span className="hot-wd-section__title">How should agents appear to visitors?</span>
              <RadioGroup className="hot-wd-radios" name="hot-wd-agent-name" value={agentName} onChange={(v) => { edit(setAgentName)(v as AgentName); setPreview('chat') }}>
                <Radio value="full" label={<>Full name <em className="hot-wd-option-eg">(e.g., John Cole)</em></>} />
                <Radio value="first" label={<>First name <em className="hot-wd-option-eg">(e.g., John)</em></>} />
                <Radio value="hidden" label="Name hidden" />
              </RadioGroup>
            </div>

            <div className="hot-wd-section">
              <span className="hot-wd-section__title">Features</span>
              <div className="hot-wd-features">
              <ToggleCard title="File attachments" description="Visitors can attach files and images in the chat" checked={filePicker} onChange={(v) => { edit(setFilePicker)(v); setPreview('chat') }} />
              <ToggleCard title="CSAT" description="Show CSAT (Customer satisfaction survey) to the visitor after the chat is closed" checked={csat} onChange={edit(setCsat)} />
              <ToggleCard
                title="Previous conversations" description="Returning visitors can see and continue past chats with this inbox."
                checked={history} onChange={(v) => { edit(setHistory)(v); setChatView('chat'); setPreview('chat') }}
              >
                <Input label="Identity verification secret" value={VERIFICATION_SECRET} readOnly fullWidth size="sm" action={{ label: copied ? 'Copied' : 'Copy', onClick: copySecret }} />
                <span className="hot-wd-card__desc">Anonymous history stays browser-specific; signed-in users sync across devices.</span>
              </ToggleCard>
              </div>
            </div>
          </Group>
        </div>

        <div className="hot-wd-preview" style={widgetStyle}>
          <Tabs
            className="hot-wd-preview__tabs" variant="filled" aria-label="Preview" value={preview} onChange={(v) => setPreview(v as Preview)}
            tabs={[{ value: 'home', label: 'Home' }, { value: 'launcher', label: 'Launcher' }, { value: 'chat', label: 'Chat' }]}
          />

          {preview === 'launcher' ? (
            <div className="hot-wd-site" aria-label="Launcher preview on a website">
              <div className="hot-wd-site__bar"><span /><span /><span /></div>
              <div className="hot-wd-site__body"><span className="hot-wd-site__line hot-wd-site__line--title" /><span className="hot-wd-site__line" /><span className="hot-wd-site__line" /><span className="hot-wd-site__line hot-wd-site__line--short" /></div>
              <div className="hot-wd-site__launcher">
                <span className={`hot-wd-launcher${launcherLabel ? ' hot-wd-launcher--pill' : ''}`} aria-label={launcherLabel || 'Open chat'}>
                  {launcherIcon ? <img src={launcherIcon.url} alt="" width={24} height={24} onError={() => setLauncherIcon(null)} /> : <span className="hot-wd-launcher__slot"><Icon name="chatsupport" size={24} /></span>}
                  {launcherLabel && <span className="hot-wd-launcher__label">{launcherLabel}</span>}
                  {launcherTooltip && <span className="hot-wd-tooltip" role="tooltip">{launcherTooltip}</span>}
                </span>
              </div>
            </div>
          ) : (
            <div className="hot-wd-widget" aria-label="Widget preview">
              {preview === 'home' ? (
                homeView
              ) : showHistory ? (
                <>
                  {/* Previous conversations: newest first, each opens its transcript. */}
                  <div className="hot-wd-widget__header">
                    {/* The bottom nav already leads back to Chat, so only the menu design needs a back arrow. */}
                    {historyDesign === 'menu' && <button type="button" className="hot-wd-icon-btn" aria-label="Back to chat" onClick={() => setChatView('chat')}><Icon name="arrowback" size={16} style={{ width: 20, height: 20 }} /></button>}
                    <div className="hot-wd-widget__titles">
                      <span className="hot-wd-widget__title">Previous conversations</span>
                      <span className="hot-wd-widget__subtitle">Your older conversations</span>
                    </div>
                  </div>
                  <ul className="hot-wd-past">
                    {PAST_CHATS.map((c) => (
                      <li key={c.id} className="hot-wd-past__row">
                        <span className="hot-wd-past__text">
                          <span className="hot-wd-past__title">Your conversation</span>
                          <span className="hot-wd-past__meta">{c.date}<Tag color="lightBlue">Resolved</Tag></span>
                        </span>
                        <Icon name="chevronright" size={16} />
                      </li>
                    ))}
                  </ul>
                  <div className="hot-wd-widget__footer">
                    <button type="button" className="hot-wd-new-chat" onClick={() => setChatView('chat')}>Start new conversation</button>
                  </div>
                  {historyNav}
                </>
              ) : (
                <>
                  <div className="hot-wd-widget__header">
                    <span className="hot-wd-widget__agent">
                      <img src={agentName === 'hidden' ? logo?.url ?? DEFAULT_LOGO : AVATARS[2]} width={40} height={40} alt="" />
                      <img className="hot-wd-widget__online" src="/widget/online.svg" width={13} height={13} alt="" />
                    </span>
                    <div className="hot-wd-widget__titles">
                      <span className="hot-wd-widget__title">{headingShown}</span>
                      <span className="hot-wd-widget__subtitle">{agentName === 'hidden' ? tagline : `${headingShown} - ${agentShown}`}</span>
                    </div>
                    {historyMenu ? (
                      historyMenu
                    ) : (
                      <img src="/widget/logout.svg" width={20} height={20} alt="End chat" />
                    )}
                  </div>
                  {/* One exchange is enough to show the agent name and the file picker. */}
                  <div className="hot-wd-chat">
                    <div className="hot-wd-msg hot-wd-msg--visitor">
                      <span className="hot-wd-bubble hot-wd-bubble--visitor">Hi, I need help with my order</span>
                    </div>
                    <div className="hot-wd-msg">
                      <span className="hot-wd-bubble hot-wd-bubble--fit">{agentName === 'hidden' ? 'Hi! Happy to help.' : `Hi! I’m ${agentShown}, happy to help.`}</span>
                      <span className="hot-wd-meta">{agentShown}<i />7:21 PM</span>
                    </div>
                  </div>
                  <div className="hot-wd-widget__footer">
                    <div className="hot-wd-composer">
                      <span className="hot-wd-composer__placeholder">Ask me anything!</span>
                      <div className="hot-wd-composer__tools">
                        {filePicker ? <Icon name="attachment" size={16} title="Attach a file" /> : <span />}
                        <span className="hot-wd-composer__send"><img src="/widget/send.svg" width={16} height={16} alt="Send" /></span>
                      </div>
                    </div>
                  </div>
                  {historyNav}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {trying && (
        <div className="hot-wd-try" onPointerDown={(e) => { if (e.target === e.currentTarget) setTrying(false) }}>
          <div className="hot-wd-try__page" role="dialog" aria-modal="true" aria-label="Try widget" style={widgetStyle}>
            <button type="button" className="hot-wd-try__close" aria-label="Close" onClick={() => setTrying(false)}><Icon name="close" size={16} style={{ width: 20, height: 20 }} /></button>
            {tryState !== 'closed' && (
              <div
                className={`hot-wd-widget hot-wd-try__widget${tryState === 'closing' ? ' hot-wd-try__widget--closing' : ''}`} aria-label="Chat widget"
                onAnimationEnd={() => { if (tryState === 'closing') setTryState('closed') }}
              >
                {homeView}
              </div>
            )}
            {/* Closed, it's the launcher as set up; open, it turns into a close button. The tooltip shows on hover or focus only (R4). */}
            <button
              type="button" className={`hot-wd-launcher hot-wd-try__launcher${launcherLabel ? ' hot-wd-launcher--pill' : ''}${tryOpen ? ' hot-wd-try__launcher--open' : ''}${tipQuiet ? ' hot-wd-try__launcher--quiet' : ''}`}
              aria-label={tryOpen ? 'Close chat' : launcherLabel || 'Open chat'} aria-expanded={tryOpen} onClick={() => { setTryState(tryOpen ? 'closing' : 'open'); setTipQuiet(true) }} onPointerLeave={() => setTipQuiet(false)}
            >
              {/* Keyed, so each swap between the bubble and the close icon replays the turn-in animation. */}
              {tryOpen ? <span key="close" className="hot-wd-launcher__slot hot-wd-try__icon"><Icon name="close" size={16} style={{ width: 20, height: 20 }} /></span>
                : launcherIcon ? <img key="image" className="hot-wd-try__icon" src={launcherIcon.url} alt="" width={48} height={48} />
                : <span key="bubble" className="hot-wd-launcher__slot hot-wd-try__icon"><Icon name="chatsupport" size={24} /></span>}
              {/* The label stays mounted and folds away, so the pill's width animates into the circle and back. */}
              {launcherLabel && <span className="hot-wd-launcher__label hot-wd-try__label" aria-hidden={tryOpen}>{launcherLabel}</span>}
              {launcherTooltip && !tryOpen && <span className="hot-wd-tooltip" role="tooltip">{launcherTooltip}</span>}
            </button>
          </div>
        </div>
      )}

      <div className="hot-wd__actions">
        {saveError && <span className="hot-wd__save-error" role="alert">Couldn’t save. The browser’s storage may be full; try smaller images.</span>}
        <Button variant="primary" size="sm" disabled={!dirty} onClick={save}>Save</Button>
      </div>
    </div>
  )
}
