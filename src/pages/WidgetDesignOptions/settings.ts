import { useState } from 'react'

/** Every Widget Design setting from chat-ux-improvements.md, shared by all the layout options. */
export type AgentNameMode = 'full' | 'first' | 'hidden'
export type PreviewMode = 'home' | 'chat' | 'launcher'

export type WidgetSettings = {
  /** A colour token name, for example `--primaryPurpleSurfaceDefault`. */
  color: string
  heading: string
  tagline: string
  /** R6: the line under "Hi there!". Empty means the default. */
  welcome: string
  /** R2: an uploaded PNG or JPG, or none for the default chat bubble. */
  launcherIcon: { url: string; name: string } | null
  /** R3: up to 30 characters; empty means icon only. */
  launcherLabel: string
  /** R4: up to 60 characters; empty means no tooltip. */
  launcherTooltip: string
  /** R5 */
  agentName: AgentNameMode
  filePicker: boolean
  csat: boolean
  /** R7, off by default. */
  history: boolean
}

export const DEFAULT_WELCOME = 'We are here to help you'
export const SAMPLE_AGENT = 'John Cole'
export const VERIFICATION_SECRET = 'hv_live_7f3a9c21e84b4d0f9a6e52c1b8d3f047'
export const MAX_LAUNCHER_BYTES = 1024 * 1024

/** Brand colour choices, all from the design tokens. */
export const COLOR_OPTIONS = [
  { token: '--primaryPurpleSurfaceDefault', label: 'Violet' },
  { token: '--primarySurfaceDefault', label: 'Blue' },
  { token: '--slateSurfaceDarkest', label: 'Charcoal' },
  { token: '--successSurfaceDark', label: 'Green' },
  { token: '--errorSurfaceDark', label: 'Red' },
  { token: '--warningSurfaceDark', label: 'Orange' },
]

export const DEFAULT_SETTINGS: WidgetSettings = {
  color: COLOR_OPTIONS[0].token,
  heading: 'Chat with us',
  tagline: 'Ask us anything or share your feedback',
  welcome: DEFAULT_WELCOME,
  launcherIcon: null,
  launcherLabel: '',
  launcherTooltip: '',
  agentName: 'full',
  filePicker: true,
  csat: true,
  history: false,
}

export const welcomeShown = (s: WidgetSettings) => s.welcome.trim() || DEFAULT_WELCOME
export const headingShown = (s: WidgetSettings) => s.heading.trim() || DEFAULT_SETTINGS.heading
export const agentShown = (s: WidgetSettings) =>
  s.agentName === 'full' ? SAMPLE_AGENT : s.agentName === 'first' ? SAMPLE_AGENT.split(' ')[0] : headingShown(s)
export const AGENT_NAME_LABEL: Record<AgentNameMode, string> = { full: 'Full name', first: 'First name', hidden: 'Hidden' }

/** The settings as saved, the draft being edited, and whether they differ. The preview always shows the draft (R8). */
export function useWidgetSettings() {
  const [saved, setSaved] = useState<WidgetSettings>(DEFAULT_SETTINGS)
  const [draft, setDraft] = useState<WidgetSettings>(DEFAULT_SETTINGS)
  const set = <K extends keyof WidgetSettings>(key: K, value: WidgetSettings[K]) => setDraft((d) => ({ ...d, [key]: value }))
  const dirty = (Object.keys(draft) as (keyof WidgetSettings)[]).some((k) => draft[k] !== saved[k])
  return { settings: draft, set, dirty, save: () => setSaved(draft), discard: () => setDraft(saved) }
}

export type WidgetSettingsApi = ReturnType<typeof useWidgetSettings>
