import { useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import { Button } from '../../components/Button'
import { Tabs } from '../../components/Tabs'
import {
  AgentNameField, ColorField, CsatField, FilePickerField, HeadingField, HistoryField, LauncherIconField,
  LauncherLabelField, LauncherTooltipField, LogoField, TaglineField, WelcomeField,
} from './fields'
import { AGENT_NAME_LABEL, COLOR_OPTIONS, DEFAULT_WELCOME, headingShown } from './settings'
import type { PreviewMode, WidgetSettingsApi } from './settings'
import { WidgetPreview } from './WidgetPreview'
import type { WidgetPart } from './WidgetPreview'

type OptionProps = { api: WidgetSettingsApi }

const PREVIEW_TABS = [{ value: 'home', label: 'Home' }, { value: 'chat', label: 'Chat' }, { value: 'launcher', label: 'Launcher' }]

/** The preview column: Home, Chat and Launcher modes (R8), then the widget. */
function PreviewPane({ api, mode, onMode, hint, children }: { api: WidgetSettingsApi; mode: PreviewMode; onMode: (m: PreviewMode) => void; hint?: ReactNode; children?: ReactNode }) {
  return (
    <div className="wd-preview">
      <div className="wd-preview__top">
        <Tabs tabs={PREVIEW_TABS} value={mode} onChange={(v) => onMode(v as PreviewMode)} variant="filled" aria-label="Preview" />
        {hint && <span className="wd-hint">{hint}</span>}
      </div>
      {children ?? <WidgetPreview settings={api.settings} mode={mode} showTooltip={mode === 'launcher'} />}
    </div>
  )
}

/* ---------- The setting groups every option is built from ---------- */

type GroupId = 'brand' | 'home' | 'launcher' | 'agent' | 'features'
type Group = { id: GroupId; title: string; icon: IconName; description: string; preview: PreviewMode; summary: (api: WidgetSettingsApi) => string; body: (api: WidgetSettingsApi, focus: (m: PreviewMode) => () => void) => ReactNode }

const colorLabel = (token: string) => COLOR_OPTIONS.find((c) => c.token === token)?.label ?? 'Custom'
const yesNo = (on: boolean, label: string) => (on ? label : null)

const GROUPS: Group[] = [
  {
    id: 'brand', title: 'Brand', icon: 'widgetdesign', preview: 'home', description: 'Colour, logo and the header visitors see first.',
    summary: (a) => `${colorLabel(a.settings.color)} · ${headingShown(a.settings)}`,
    body: (a, f) => <><ColorField api={a} onFocus={f('home')} /><LogoField api={a} onFocus={f('home')} /><HeadingField api={a} onFocus={f('home')} /><TaglineField api={a} onFocus={f('home')} /></>,
  },
  {
    id: 'home', title: 'Welcome', icon: 'emoji', preview: 'home', description: 'The line visitors read before they start a chat.',
    summary: (a) => (a.settings.welcome.trim() && a.settings.welcome.trim() !== DEFAULT_WELCOME ? `“${a.settings.welcome.trim()}”` : 'Default message'),
    body: (a, f) => <WelcomeField api={a} onFocus={f('home')} />,
  },
  {
    id: 'launcher', title: 'Launcher', icon: 'chatsupport', preview: 'launcher', description: 'The button on your website that opens the chat.',
    summary: (a) => [a.settings.launcherIcon ? 'Custom icon' : 'Default icon', a.settings.launcherLabel ? `“${a.settings.launcherLabel}”` : null, yesNo(!!a.settings.launcherTooltip, 'tooltip')].filter(Boolean).join(' · '),
    body: (a, f) => <><LauncherIconField api={a} onFocus={f('launcher')} /><LauncherLabelField api={a} onFocus={f('launcher')} /><LauncherTooltipField api={a} onFocus={f('launcher')} /></>,
  },
  {
    id: 'agent', title: 'Agent identity', icon: 'user', preview: 'chat', description: 'How your team’s names appear to visitors.',
    summary: (a) => AGENT_NAME_LABEL[a.settings.agentName],
    body: (a, f) => <AgentNameField api={a} onFocus={f('chat')} />,
  },
  {
    id: 'features', title: 'Features', icon: 'setting', preview: 'chat', description: 'What visitors can do in the widget.',
    summary: (a) => [yesNo(a.settings.filePicker, 'Attachments'), yesNo(a.settings.csat, 'CSAT'), yesNo(a.settings.history, 'History')].filter(Boolean).join(' · ') || 'None on',
    body: (a, f) => <><FilePickerField api={a} onFocus={f('chat')} /><div className="wd-stack"><CsatField api={a} /><HistoryField api={a} onFocus={f('home')} /></div></>,
  },
]

/* ---------- Option 1: Sections ---------- */

/**
 * One page, settings grouped into collapsible sections, one open at a time. A closed section shows a one-line summary
 * of its values, so the admin sees the whole setup at a glance. Opening a section turns the preview to that part.
 * References: Featurebase Messenger customization, GoDaddy chat settings.
 */
export function SectionsOption({ api }: OptionProps) {
  const [open, setOpen] = useState<GroupId | null>('brand')
  const [mode, setMode] = useState<PreviewMode>('home')
  const focus = (m: PreviewMode) => () => setMode(m)
  return (
    <div className="wd-split">
      <div className="wd-form">
        {GROUPS.map((g) => {
          const isOpen = open === g.id
          return (
            <section key={g.id} className={`wd-acc${isOpen ? ' wd-acc--open' : ''}`}>
              <button type="button" className="wd-acc__head" aria-expanded={isOpen} onClick={() => { setOpen(isOpen ? null : g.id); if (!isOpen) setMode(g.preview) }}>
                <span className="wd-acc__icon"><Icon name={g.icon} size={16} /></span>
                <span className="wd-acc__titles">
                  <span className="wd-acc__title">{g.title}</span>
                  <span className="wd-acc__summary">{isOpen ? g.description : g.summary(api)}</span>
                </span>
                <Icon name={isOpen ? 'chevrontop' : 'chevrondown'} size={16} />
              </button>
              {isOpen && <div className="wd-acc__body">{g.body(api, focus)}</div>}
            </section>
          )
        })}
      </div>
      <PreviewPane api={api} mode={mode} onMode={setMode} />
    </div>
  )
}

/* ---------- Option 2: Tabs ---------- */

const TAB_GROUPS: { value: string; label: string; groups: GroupId[]; preview: PreviewMode }[] = [
  { value: 'appearance', label: 'Appearance', groups: ['brand', 'home'], preview: 'home' },
  { value: 'launcher', label: 'Launcher', groups: ['launcher'], preview: 'launcher' },
  { value: 'conversation', label: 'Conversation', groups: ['agent', 'features'], preview: 'chat' },
]

/**
 * Three tabs (PRD layout B): Appearance, Launcher, Conversation. Each tab is short enough to fit without scrolling,
 * and the preview follows the active tab. References: Chatbase chat widget (Content · Style · Embed), Zapier chatbot Style.
 */
export function TabsOption({ api }: OptionProps) {
  const [tab, setTab] = useState('appearance')
  const [mode, setMode] = useState<PreviewMode>('home')
  const focus = (m: PreviewMode) => () => setMode(m)
  const current = TAB_GROUPS.find((t) => t.value === tab) ?? TAB_GROUPS[0]
  return (
    <div className="wd-tabs-layout">
      <div className="wd-tabs-layout__bar">
        <Tabs tabs={TAB_GROUPS.map(({ value, label }) => ({ value, label }))} value={tab} onChange={(v) => { setTab(v); setMode(TAB_GROUPS.find((t) => t.value === v)?.preview ?? 'home') }} aria-label="Widget Design sections" />
      </div>
      <div className="wd-split">
        <div className="wd-form">
          {current.groups.map((id) => {
            const g = GROUPS.find((x) => x.id === id)!
            return (
              <section key={g.id} className="wd-group">
                <div className="wd-group__head">
                  <h2 className="wd-group__title">{g.title}</h2>
                  <p className="wd-group__desc">{g.description}</p>
                </div>
                {g.body(api, focus)}
              </section>
            )
          })}
        </div>
        <PreviewPane api={api} mode={mode} onMode={setMode} />
      </div>
    </div>
  )
}

/* ---------- Option 3: Click to edit ---------- */

type EditTarget = WidgetPart | 'survey'
const TARGETS: { id: EditTarget; label: string; mode: PreviewMode; render: (a: WidgetSettingsApi) => ReactNode }[] = [
  { id: 'header', label: 'Header', mode: 'home', render: (a) => <><ColorField api={a} /><LogoField api={a} /><HeadingField api={a} /><TaglineField api={a} /></> },
  { id: 'welcome', label: 'Welcome message', mode: 'home', render: (a) => <WelcomeField api={a} /> },
  { id: 'button', label: 'Brand colour', mode: 'home', render: (a) => <ColorField api={a} /> },
  { id: 'launcher', label: 'Launcher', mode: 'launcher', render: (a) => <><LauncherIconField api={a} /><LauncherLabelField api={a} /><LauncherTooltipField api={a} /></> },
  { id: 'agent', label: 'Agent name', mode: 'chat', render: (a) => <AgentNameField api={a} /> },
  { id: 'composer', label: 'Attachments', mode: 'chat', render: (a) => <FilePickerField api={a} /> },
  { id: 'history', label: 'Previous conversations', mode: 'home', render: (a) => <HistoryField api={a} /> },
  { id: 'survey', label: 'Satisfaction survey', mode: 'chat', render: (a) => <CsatField api={a} /> },
]

/**
 * The preview is the page. Click any part of the widget (or pick it from the list) and its settings open in the panel
 * on the right, so admins edit what they see instead of hunting for the right field.
 * References: Retool chat component inspector, Zendesk Web Widget preview.
 */
export function ClickToEditOption({ api }: OptionProps) {
  const [target, setTarget] = useState<EditTarget>('header')
  const [mode, setMode] = useState<PreviewMode>('home')
  const current = TARGETS.find((t) => t.id === target) ?? TARGETS[0]
  const pick = (id: EditTarget) => { setTarget(id); const t = TARGETS.find((x) => x.id === id); if (t) setMode(t.mode) }
  // History is only on the widget when it's turned on, so it stays reachable from the list.
  const listed = TARGETS.filter((t) => t.id !== 'button')
  return (
    <div className="wd-canvas-layout">
      <div className="wd-canvas">
        <div className="wd-canvas__top">
          <Tabs tabs={PREVIEW_TABS} value={mode} onChange={(v) => setMode(v as PreviewMode)} variant="filled" aria-label="Preview" />
          <span className="wd-hint"><Icon name="info" size={14} /> Click any part of the widget to edit it</span>
        </div>
        <div className="wd-canvas__stage">
          <WidgetPreview settings={api.settings} mode={mode} selectable selected={target === 'survey' ? undefined : target} onSelect={pick} showTooltip={mode === 'launcher'} />
        </div>
      </div>
      <aside className="wd-inspector" aria-label="Edit">
        <div className="wd-inspector__list" role="listbox" aria-label="Parts of the widget">
          {listed.map((t) => (
            <button key={t.id} type="button" role="option" aria-selected={t.id === target} className={`wd-chip${t.id === target ? ' wd-chip--on' : ''}`} onClick={() => pick(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="wd-inspector__body">
          <h2 className="wd-group__title">{current.label}</h2>
          {current.render(api)}
        </div>
      </aside>
    </div>
  )
}

/* ---------- Option 4: Guided setup ---------- */

/**
 * The same groups as numbered steps, for an admin setting the widget up for the first time. One step is open;
 * "Continue" moves on, finished steps keep a summary and can be reopened in any order.
 * References: Zendesk Web Widget setup ("Make it your own"), HubSpot Set up Web Chat.
 */
export function GuidedOption({ api }: OptionProps) {
  const [step, setStep] = useState(0)
  const [visited, setVisited] = useState(1)
  const [mode, setMode] = useState<PreviewMode>('home')
  const focus = (m: PreviewMode) => () => setMode(m)
  const go = (i: number) => { setStep(i); setVisited((v) => Math.max(v, i + 1)); setMode(GROUPS[i]?.preview ?? 'home') }
  const done = visited > GROUPS.length - 1 && step === GROUPS.length
  return (
    <div className="wd-split">
      <div className="wd-form">
        <div className="wd-progress">
          <span className="wd-progress__text">{Math.min(visited, GROUPS.length)} of {GROUPS.length} steps reviewed</span>
          <span className="wd-progress__bar"><span style={{ width: `${(Math.min(visited, GROUPS.length) / GROUPS.length) * 100}%` }} /></span>
        </div>
        <ol className="wd-steps">
          {GROUPS.map((g, i) => {
            const isOpen = step === i
            const reached = i < visited
            return (
              <li key={g.id} className={`wd-step${isOpen ? ' wd-step--open' : ''}${reached && !isOpen ? ' wd-step--done' : ''}`}>
                <button type="button" className="wd-step__head" aria-expanded={isOpen} onClick={() => go(i)}>
                  <span className="wd-step__num">{reached && !isOpen ? <Icon name="tick" size={14} /> : i + 1}</span>
                  <span className="wd-acc__titles">
                    <span className="wd-acc__title">{g.title}</span>
                    <span className="wd-acc__summary">{isOpen ? g.description : reached ? g.summary(api) : g.description}</span>
                  </span>
                </button>
                {isOpen && (
                  <div className="wd-step__body">
                    {g.body(api, focus)}
                    <div className="wd-step__actions">
                      {i > 0 && <Button variant="ghost" size="sm" onClick={() => go(i - 1)}>Back</Button>}
                      <Button variant="secondary" size="sm" onClick={() => go(i + 1)}>{i === GROUPS.length - 1 ? 'Finish' : 'Continue'}</Button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
        {done && (
          <div className="wd-note wd-note--success"><Icon name="tick2" size={14} /><span>All set. Save your changes, then use Try live widget to chat as a visitor.</span></div>
        )}
      </div>
      <PreviewPane api={api} mode={mode} onMode={setMode} />
    </div>
  )
}
