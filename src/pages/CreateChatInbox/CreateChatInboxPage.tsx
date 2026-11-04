import { useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import { Button } from '../../components/Button'
import { Checkbox } from '../../components/Checkbox'
import { Dropdown } from '../../components/Dropdown'
import { Input } from '../../components/Input'
import { Popover } from '../../components/Popover'
import { Tabs } from '../../components/Tabs'
import { Tag } from '../../components/Tag'
import { Tooltip } from '../../components/Tooltip'
import { PageLayout } from '../../patterns/PageLayout'
import { SubNav } from '../../patterns/SubNav'
import { sampleAssignees } from '../../patterns/RightPanel/data/options'
import { ColorPicker, cssToHsv, hsvToHex } from '../WidgetDesign/ColorPicker'
import type { Hsv } from '../WidgetDesign/ColorPicker'
import { DEFAULT_GREETING, DEFAULT_SETTINGS, DEFAULT_WELCOME, readAsDataUrl } from '../WidgetDesign/widgetSettings'
import type { UploadedImage } from '../WidgetDesign/widgetSettings'
import { PageBar } from '../SharedInboxes/SharedInboxesPage'
import '../WidgetDesign/WidgetDesignPage.css'
import './CreateChatInboxPage.css'

const DEFAULT_LOGO = '/widget/logo-placeholder.svg'
const MAX_IMAGE_BYTES = 1024 * 1024
type Step = 'general' | 'widget'
/** Chat is left out: its settings (agent names, features) aren't part of setup. */
type Preview = 'home' | 'launcher'

export type NewChatInbox = { name: string; members: string[]; color: string; logo: UploadedImage | null; heading: string; launcherUseLogo: boolean; launcherIcon: UploadedImage | null; launcherLabel: string }

export type CreateChatInboxPageProps = {
  nav: ReactNode
  sidebar: ReactNode
  /** The back arrow: leaves without creating anything. */
  onCancel: () => void
  /** Next on the last step: the inbox is created. */
  onCreate: (inbox: NewChatInbox) => void
}

/**
 * Create Chat Inbox, in two steps.
 * 1. General Information: the inbox name and its members.
 * 2. Widget Design: only what makes the widget look like the brand (colour, logo, heading, logo on the launcher,
 *    an optional launcher label). Everything else keeps its default and can be changed once the inbox is live.
 */
export function CreateChatInboxPage({ nav, sidebar, onCancel, onCreate }: CreateChatInboxPageProps) {
  const [step, setStep] = useState<Step>('general')
  // Step 1
  const [name, setName] = useState('')
  const [members, setMembers] = useState<string[]>(['john-cole'])
  const [membersOpen, setMembersOpen] = useState(false)
  const membersRef = useRef<HTMLButtonElement>(null)
  // Step 2
  const [hsv, setHsv] = useState<Hsv>(() => cssToHsv(getComputedStyle(document.documentElement).getPropertyValue('--primarySurfaceDefault')))
  const [color, setColor] = useState(DEFAULT_SETTINGS.color)
  const [colorOpen, setColorOpen] = useState(false)
  const swatchRef = useRef<HTMLButtonElement>(null)
  const [logo, setLogo] = useState<UploadedImage | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)
  const logoInput = useRef<HTMLInputElement>(null)
  const [heading, setHeading] = useState(DEFAULT_SETTINGS.heading)
  // Launcher icon: the widget logo by default (the box below the upload is ticked); unticked, an uploaded icon or the chat bubble.
  const [launcherUseLogo, setLauncherUseLogo] = useState(true)
  const [launcherIcon, setLauncherIcon] = useState<UploadedImage | null>(null)
  const [launcherError, setLauncherError] = useState<string | null>(null)
  const launcherInput = useRef<HTMLInputElement>(null)
  const [launcherLabel, setLauncherLabel] = useState('')
  const [preview, setPreview] = useState<Preview>('home')

  const generalDone = name.trim() !== '' && members.length > 0
  const widgetDone = heading.trim() !== ''
  const people = sampleAssignees.filter((p) => members.includes(p.value))

  const onLogoFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) { setLogoError('Use a PNG or JPG image.'); return }
    if (file.size > MAX_IMAGE_BYTES) { setLogoError('This image is over 1 MB. Try a smaller one.'); return }
    readAsDataUrl(file).then((url) => {
      const img = new Image()
      img.onload = () => {
        setLogoError(null)
        setLogo({ url, name: file.name })
        // A new logo switches the launcher to it too; the admin can untick that below the launcher icon.
        setLauncherUseLogo(true)
        setPreview('home')
      }
      img.src = url
    })
  }
  const removeLogo = () => { setLogo(null); setLogoError(null) }
  const launcherUsesLogo = launcherUseLogo && !!logo
  const launcherShown = launcherUsesLogo ? logo : launcherUseLogo ? null : launcherIcon
  const onLauncherFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) { setLauncherError('Use a PNG or JPG image.'); return }
    if (file.size > MAX_IMAGE_BYTES) { setLauncherError('This image is over 1 MB. Try a smaller one.'); return }
    readAsDataUrl(file).then((url) => { setLauncherError(null); setLauncherIcon({ url, name: file.name }); setLauncherUseLogo(false); setPreview('launcher') })
  }
  // ✕ / Remove icon: with the widget logo in use, untick the box (ticking it brings the logo back); otherwise drop the uploaded icon.
  const removeLauncherIcon = () => {
    if (launcherUsesLogo) setLauncherUseLogo(false)
    else { setLauncherIcon(null); setLauncherError(null) }
    setPreview('launcher')
  }

  const subNav = (
    <SubNav
      title="Chat Inbox" onBack={onCancel} value={step}
      // Widget Design opens only once General Information is filled in.
      onChange={(id) => { if (id === 'general' || generalDone) setStep(id as Step) }}
      items={[{ id: 'general', label: 'General Information', icon: 'settings' }, { id: 'widget', label: 'Widget Design', icon: 'widgetdesign' }]}
    />
  )

  const general = (
    <div className="hot-cci">
      <PageBar title="General Information" />
      <div className="hot-cci__body">
        <div className="hot-cci__form">
          <Input label={<>Chat Inbox Name <span className="hot-cci__required">*</span></>} value={name} maxLength={30} suffix={{ count: true }} fullWidth placeholder="Enter your chat inbox name (eg: Live Chat)" onChange={(e) => setName(e.target.value)} />
          <div className="hot-wd-field hot-cci__members">
            <span className="hot-wd-label">Members <span className="hot-cci__required">*</span></span>
            <button ref={membersRef} type="button" className="hot-cci__members-box" aria-haspopup="true" aria-expanded={membersOpen} onClick={() => setMembersOpen((o) => !o)}>
              {people.length ? people.map((p) => <Tag key={p.value}>{p.label.replace(/ \(Me\)$/, '')}</Tag>) : <span className="hot-cci__placeholder">Add members</span>}
            </button>
            <Popover open={membersOpen} onClose={() => setMembersOpen(false)} anchorRef={membersRef}>
              <Dropdown variant="checkbox" searchable searchPlaceholder="Search people" value={members} onChange={(v) => setMembers(v as string[])} options={sampleAssignees.map((p) => ({ value: p.value, label: p.label }))} />
            </Popover>
          </div>
          <Button variant="primary" size="sm" disabled={!generalDone} onClick={() => setStep('widget')}>Next</Button>
        </div>
      </div>
    </div>
  )

  const style = { '--widget-color': color } as CSSProperties
  const widget = (
    <div className="hot-cci">
      <PageBar title="Widget Design" />
      <div className="hot-wd__body">
        <div className="hot-cci__form">
          <p className="hot-cci__intro">Make the widget look like your brand. You can change everything else in Widget Design once the inbox is live.</p>

          <div className="hot-wd-field">
            <span className="hot-wd-label">Widget color</span>
            <button ref={swatchRef} type="button" className="hot-wd-swatch" style={{ background: color }} aria-label="Widget color" aria-haspopup="true" aria-expanded={colorOpen} onClick={() => setColorOpen((o) => !o)} />
            <Popover open={colorOpen} onClose={() => setColorOpen(false)} anchorRef={swatchRef}>
              <ColorPicker value={hsv} onChange={(next) => { setHsv(next); setColor(hsvToHex(next)); setPreview('home') }} />
            </Popover>
          </div>

          <div className="hot-wd-field">
            <span className="hot-wd-label">Widget logo</span>
            <div className="hot-wd-logo-row hot-wd-logo-box">
              {logo ? (
                <span className="hot-wd-logo">
                  <img src={logo.url} alt={`Widget logo: ${logo.name}`} />
                  <button type="button" className="hot-wd-logo__remove" aria-label="Remove logo" onClick={removeLogo}><Icon name="close" size={14} /></button>
                </span>
              ) : (
                <button type="button" className="hot-wd-logo hot-wd-logo--empty" aria-label="Upload logo" onClick={() => logoInput.current?.click()}><Icon name="fileimage" size={16} /></button>
              )}
              <div className="hot-wd-logo-row__text">
                <button type="button" className="hot-wd-logo-row__action" onClick={() => logoInput.current?.click()}>{logo ? 'Change logo' : 'Upload logo'}</button>
                <span className={`hot-wd-logo-row__hint${logoError ? ' hot-wd-logo-row__hint--error' : ''}`} role={logoError ? 'alert' : undefined}>{logoError ?? 'PNG or JPG, max 1 MB. Square works best.'}</span>
              </div>
              <input ref={logoInput} type="file" accept="image/png,image/jpeg" hidden onChange={onLogoFile} />
            </div>
          </div>

          <Input label={<>Widget heading <span className="hot-cci__required">*</span></>} value={heading} maxLength={30} suffix={{ count: true }} fullWidth onFocus={() => setPreview('home')} onChange={(e) => setHeading(e.target.value)} />
          {/* Same as Widget Design > Launcher icon. */}
          <div className="hot-wd-field">
            <span className="hot-wd-label">Launcher icon</span>
            <div className="hot-wd-logo-box hot-wd-logo-box--stack">
              <div className="hot-wd-logo-row">
                <span className="hot-wd-logo hot-wd-logo--launcher" style={style}>
                  {launcherShown ? <img src={launcherShown.url} alt={`Launcher icon: ${launcherShown.name}`} /> : <Icon name="chatsupport" size={16} />}
                  {launcherShown && <button type="button" className="hot-wd-logo__remove" aria-label="Remove launcher icon" onClick={removeLauncherIcon}><Icon name="close" size={14} /></button>}
                </span>
                <div className="hot-wd-logo-row__text">
                  {launcherUsesLogo
                    ? <button type="button" className="hot-wd-logo-row__action" onClick={removeLauncherIcon}>Remove icon</button>
                    : <button type="button" className="hot-wd-logo-row__action" onClick={() => launcherInput.current?.click()}>{launcherIcon ? 'Change icon' : 'Upload icon'}</button>}
                  <span className={`hot-wd-logo-row__hint${launcherError ? ' hot-wd-logo-row__hint--error' : ''}`} role={launcherError ? 'alert' : undefined}>{launcherError ?? 'PNG or JPG, max 1 MB. Square works best.'}</span>
                </div>
                <input ref={launcherInput} type="file" accept="image/png,image/jpeg" hidden onChange={onLauncherFile} />
              </div>
              {/* Disabled until there's a widget logo; the tooltip says how to turn it on. */}
              {logo ? (
                <Checkbox label="Use the same logo as widget logo" checked={launcherUsesLogo} disabled={!logo} onChange={(e) => { setLauncherUseLogo(e.target.checked); setPreview('launcher') }} />
              ) : (
                <Tooltip content="Add a widget logo to use it here">
                  <span className="hot-wd-tip-target"><Checkbox label="Use the same logo as widget logo" checked={launcherUsesLogo} disabled={!logo} onChange={(e) => { setLauncherUseLogo(e.target.checked); setPreview('launcher') }} /></span>
                </Tooltip>
              )}
            </div>
          </div>
          <Input
            label="Launcher label" value={launcherLabel} maxLength={30} suffix={{ count: true }} fullWidth placeholder="e.g., Chat with us"
            helperText="Optional. Shown next to the launcher; leave it empty for the icon only."
            onFocus={() => setPreview('launcher')} onChange={(e) => setLauncherLabel(e.target.value)}
          />

          <Button
            variant="primary" size="sm" disabled={!widgetDone}
            onClick={() => onCreate({ name: name.trim(), members, color, logo, heading: heading.trim(), launcherUseLogo, launcherIcon, launcherLabel: launcherLabel.trim() })}
          >Next</Button>
        </div>

        {/* The same Home and Launcher previews as Widget Design; each field turns the preview to the part it changes. */}
        <div className="hot-wd-preview" style={style}>
          <Tabs
            className="hot-wd-preview__tabs" variant="filled" aria-label="Preview" value={preview} onChange={(v) => setPreview(v as Preview)}
            tabs={[{ value: 'home', label: 'Home' }, { value: 'launcher', label: 'Launcher' }]}
          />
          {preview === 'launcher' ? (
            <div className="hot-wd-site" aria-label="Launcher preview on a website">
              <div className="hot-wd-site__bar"><span /><span /><span /></div>
              <div className="hot-wd-site__body"><span className="hot-wd-site__line hot-wd-site__line--title" /><span className="hot-wd-site__line" /><span className="hot-wd-site__line" /><span className="hot-wd-site__line hot-wd-site__line--short" /></div>
              <div className="hot-wd-site__launcher">
                <span className={`hot-wd-launcher${launcherLabel.trim() ? ' hot-wd-launcher--pill' : ''}`} aria-label={launcherLabel.trim() || 'Open chat'}>
                  {launcherShown ? <img src={launcherShown.url} alt="" width={48} height={48} /> : <span className="hot-wd-launcher__slot"><Icon name="chatsupport" size={24} /></span>}
                  {launcherLabel.trim() && <span className="hot-wd-launcher__label">{launcherLabel.trim()}</span>}
                </span>
              </div>
            </div>
          ) : (
            <div className="hot-wd-widget" aria-label="Widget preview">
              <div className="hot-wd-widget__header">
                <img className="hot-wd-widget__logo" src={logo?.url ?? DEFAULT_LOGO} width={40} height={40} alt="" />
                <div className="hot-wd-widget__titles">
                  <span className="hot-wd-widget__title">{heading.trim() || DEFAULT_SETTINGS.heading}</span>
                  <span className="hot-wd-widget__subtitle">{DEFAULT_SETTINGS.tagline}</span>
                </div>
              </div>
              <div className="hot-wd-home">
                <div className="hot-wd-home__hero">
                  <div className="hot-wd-home__text">
                    <p className="hot-wd-home__greeting">{DEFAULT_GREETING}</p>
                    <p className="hot-wd-home__welcome">{DEFAULT_WELCOME}</p>
                  </div>
                </div>
              </div>
              <div className="hot-wd-widget__footer"><span className="hot-wd-start">Start Conversation</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return <PageLayout variant="admin" nav={nav} sidebar={sidebar} subNav={subNav}>{step === 'general' ? general : widget}</PageLayout>
}
