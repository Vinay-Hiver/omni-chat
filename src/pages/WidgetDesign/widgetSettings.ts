import type { Hsv } from './ColorPicker'

/** An uploaded image, kept as a data URL so it survives reloads and reaches other tabs. */
export type UploadedImage = { url: string; name: string }

/** Everything the admin sets on Widget Design. Saving stores it; the Try Widget tab reads it on load. */
export type WidgetSettings = {
  color: string
  /** The picker's position for `color`; null until a colour is picked, while `color` is still the default token. */
  hsv: Hsv | null
  heading: string
  tagline: string
  /** The large line on the home screen. Empty means the default. */
  greeting: string
  welcome: string
  /** The button under the welcome message. Empty means the default. */
  startLabel: string
  logo: UploadedImage | null
  /** The launcher shows the widget logo (on by default); off, it shows `launcherIcon` or the default chat bubble. */
  launcherUseLogo: boolean
  launcherIcon: UploadedImage | null
  launcherLabel: string
  launcherTooltip: string
  agentName: 'full' | 'first' | 'hidden'
  filePicker: boolean
  csat: boolean
  history: boolean
  historyDesign: 'menu' | 'nav'
}

export const DEFAULT_GREETING = 'Hi there!'
export const DEFAULT_WELCOME = 'We are here to help you'
export const DEFAULT_START_LABEL = 'Start Conversation'

export const DEFAULT_SETTINGS: WidgetSettings = {
  color: 'var(--primarySurfaceDefault)',
  hsv: null,
  heading: 'Support Team',
  tagline: 'Ask us anything',
  greeting: '',
  welcome: DEFAULT_WELCOME,
  startLabel: '',
  logo: null,
  launcherUseLogo: true,
  launcherIcon: null,
  launcherLabel: '',
  launcherTooltip: '',
  agentName: 'full',
  filePicker: true,
  csat: true,
  history: true,
  historyDesign: 'nav',
}

const KEY = 'hot-widget-settings'
/** Bumped when a default changes, so settings saved before it pick up the new default. */
const VERSION = 4

/** The last saved settings, or the defaults when nothing is saved or storage can't be read. */
export function loadSettings(): WidgetSettings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_SETTINGS
    const saved = JSON.parse(raw)
    // Version 2: the CTA blue is the default colour, and Previous conversations is on by default.
    if (!saved.version || saved.version < 2) Object.assign(saved, { color: DEFAULT_SETTINGS.color, hsv: null, history: DEFAULT_SETTINGS.history })
    // Version 3: the launcher starts empty (default chat bubble, no label, no tooltip).
    if (!saved.version || saved.version < 3) Object.assign(saved, { launcherIcon: null, launcherLabel: '', launcherTooltip: '' })
    // Version 4: no widget logo by default.
    if (!saved.version || saved.version < 4) saved.logo = null
    // Saved before the launcher could reuse the widget logo: keep an uploaded launcher image.
    if (saved.launcherUseLogo === undefined) saved.launcherUseLogo = !saved.launcherIcon
    // Previous chat is always the bottom nav now; older saves may still say 'menu'.
    return { ...DEFAULT_SETTINGS, ...saved, historyDesign: 'nav' }
  } catch {
    return DEFAULT_SETTINGS
  }
}

/** Returns false when the browser refused to store them (for example, storage is full). */
export function saveSettings(settings: WidgetSettings): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...settings, version: VERSION }))
    return true
  } catch {
    return false
  }
}

export function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** The image the launcher shows, or null for the default chat bubble. */
export function launcherImage(s: Pick<WidgetSettings, 'launcherUseLogo' | 'launcherIcon' | 'logo'>): UploadedImage | null {
  return s.launcherUseLogo ? s.logo : s.launcherIcon
}
