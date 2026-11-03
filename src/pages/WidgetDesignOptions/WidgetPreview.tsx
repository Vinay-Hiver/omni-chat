import type { CSSProperties } from 'react'
import { Icon } from '../../icons/Icon'
import { agentShown, headingShown, welcomeShown } from './settings'
import type { PreviewMode, WidgetSettings } from './settings'

/** The parts of the widget the "click to edit" option can select. */
export type WidgetPart = 'header' | 'welcome' | 'button' | 'agent' | 'composer' | 'launcher' | 'history'

type Props = {
  settings: WidgetSettings
  mode: PreviewMode
  /** Click to edit: makes the parts selectable and outlines the selected one. */
  selectable?: boolean
  selected?: WidgetPart
  onSelect?: (part: WidgetPart) => void
  /** Pins the launcher tooltip open, for the Launcher preview. */
  showTooltip?: boolean
}

/** The visitor's widget, drawn from the draft settings so it updates as the admin types (R8). */
export function WidgetPreview({ settings: s, mode, selectable, selected, onSelect, showTooltip }: Props) {
  // Click to edit: the extra class and handlers that make a part selectable.
  const pc = (p: WidgetPart) => selectable ? ` wp-part${selected === p ? ' wp-part--selected' : ''}` : ''
  const part = (p: WidgetPart) => selectable ? {
    role: 'button', tabIndex: 0, 'aria-label': `Edit ${p}`,
    onClick: (e: React.MouseEvent) => { e.stopPropagation(); onSelect?.(p) },
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(p) } },
  } : {}
  const agent = agentShown(s)
  const style = { '--widget-color': `var(${s.color})` } as CSSProperties

  const launcher = (
    <div className={`wp-launcher-row${pc('launcher')}`} {...part('launcher')}>
      <span className={`wp-launcher${s.launcherLabel ? ' wp-launcher--pill' : ''}${mode === 'launcher' ? '' : ' wp-launcher--open'}`} aria-label={s.launcherLabel || 'Open chat'}>
        {mode !== 'launcher'
          ? <Icon name="close" size={24} />
          : s.launcherIcon ? <img src={s.launcherIcon.url} alt="" width={24} height={24} /> : <Icon name="chatsupport" size={24} />}
        {mode === 'launcher' && s.launcherLabel && <span className="wp-launcher__label">{s.launcherLabel}</span>}
        {mode === 'launcher' && s.launcherTooltip && <span className={`wp-tooltip${showTooltip ? ' wp-tooltip--on' : ''}`} role="tooltip">{s.launcherTooltip}</span>}
      </span>
    </div>
  )

  if (mode === 'launcher') {
    // Closed state: a mock website with the launcher in the corner.
    return (
      <div className="wp" style={style}>
        <div className="wp-site" aria-label="Launcher preview on a website">
          <div className="wp-site__bar"><span /><span /><span /></div>
          <div className="wp-site__body">
            <span className="wp-site__line wp-site__line--title" />
            <span className="wp-site__line" /><span className="wp-site__line" /><span className="wp-site__line wp-site__line--short" />
          </div>
          <div className="wp-site__launcher">{launcher}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="wp" style={style}>
      <div className="wp-widget" aria-label="Widget preview">
        <div className={`wp-header${pc('header')}`} {...part('header')}>
          <img src="/widget/logo.svg" width={36} height={36} alt="" />
          <div className="wp-header__titles">
            <span className="wp-header__title">{headingShown(s)}</span>
            <span className="wp-header__tagline">{s.tagline}</span>
          </div>
          {s.history && <span className={`wp-header__icon${pc('history')}`} title="Previous conversations" {...part('history')}><Icon name="previousconversations" size={16} /></span>}
          <span className="wp-header__online" />
        </div>

        {mode === 'home' ? (
          <div className="wp-home">
            <div className={`wp-home__hero${pc('welcome')}`} {...part('welcome')}>
              <p className="wp-home__greeting">Hi there!</p>
              <p className="wp-home__welcome">{welcomeShown(s)}</p>
            </div>
            {s.history && (
              <div className={`wp-home__recent${pc('history')}`} {...part('history')}>
                <Icon name="previousconversations" size={16} />
                <span className="wp-home__recent-text"><strong>Continue your last chat</strong><span>The chat widget is not loading on mobile</span></span>
                <Icon name="chevronright" size={14} />
              </div>
            )}
            <div className={`wp-home__footer${pc('button')}`} {...part('button')}>
              <span className="wp-button">Start conversation</span>
            </div>
          </div>
        ) : (
          <div className="wp-chat">
            <div className="wp-chat__thread">
              <div className="wp-chat__day">Today</div>
              <div className={`wp-chat__system${pc('agent')}`} {...part('agent')}>{agent} joined the conversation</div>
              <div className="wp-msg wp-msg--visitor">
                <span className="wp-bubble wp-bubble--visitor">Hi, the widget isn’t loading on my phone</span>
                <span className="wp-time">10:01 AM</span>
              </div>
              <div className={`wp-msg wp-msg--agent${pc('agent')}`} {...part('agent')}>
                {s.agentName === 'hidden'
                  ? <img className="wp-avatar" src="/widget/logo.svg" width={24} height={24} alt="" />
                  : <span className="wp-avatar wp-avatar--initial">{agent.charAt(0)}</span>}
                <div className="wp-msg__body">
                  <span className="wp-msg__name">{agent}</span>
                  <span className="wp-bubble wp-bubble--agent">Sorry about that! Which phone and browser are you using?</span>
                  <span className="wp-time">10:02 AM</span>
                </div>
              </div>
            </div>
            <div className={`wp-composer${pc('composer')}`} {...part('composer')}>
              <span>Type your message</span>
              {s.filePicker && <Icon name="attachment" size={16} />}
            </div>
          </div>
        )}
      </div>
      {launcher}
    </div>
  )
}
