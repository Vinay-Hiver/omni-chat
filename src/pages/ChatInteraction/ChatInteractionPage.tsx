import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, KeyboardEvent, ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import { Tag } from '../../components/Tag'
import { DotsVertical } from '../WidgetDesign/WidgetDesignPage'
import { DEFAULT_START_LABEL, launcherImage, loadSettings } from '../WidgetDesign/widgetSettings'
import { ME, addLiveMessage, createLiveChat, readLiveChats, subscribeLiveChats, updateLiveChat, useLiveChats } from '../Conversations/liveChats'
import type { LiveChat, LiveMessage } from '../Conversations/liveChats'
import '../WidgetDesign/WidgetDesignPage.css'
import './ChatInteractionPage.css'

/**
 * /chat-interaction: the visitor's side of a chat, end to end (Figma 34:27427, states 1–23).
 * An empty page with the launcher; the widget walks through the pre-chat form, the AI agent, the handoff to a
 * human (John Cole), closing and CSAT. Uses the saved Widget Design settings (colour, heading, logo, agent name,
 * file attachments, CSAT). The AI agent's replies are scripted. From the visitor's first message the chat also
 * appears in Conversations > Chat-Support > Assigned to Bot; asking for a person moves it to Mine, assigned to
 * John Cole, and his replies from Conversations arrive here.
 */

const DEFAULT_LOGO = '/widget/logo-placeholder.svg'
const HUMAN = { name: ME.name, avatar: '/widget/avatar-3.png' }
/** The visitor asks for a person in their own words. */
const WANTS_PERSON = /\b(agent|human|person|someone|representative|real people|support team)\b/i
const PASSWORD_ANSWER = `Sure, you can reset your password by visiting the login page for your region and clicking "Forgot your password?":

If the reset email doesn't arrive, check your spam folder and make sure you're using the correct email address.
Note: If you normally sign in with Google, you might not have a password set up yet - the reset process will create one for you.`

type Sender = 'visitor' | 'ai' | 'human'
type Choice = { label: string; onPick: () => void }
type Item =
  | { kind: 'msg'; id: number; from: Sender; text: string; at: number; choices?: Choice[]; picked?: string }
  | { kind: 'divider'; id: number; text: string; pending?: boolean }
type Stage = 'home' | 'chat' | 'closed' | 'thanks'
type Banner = null | 'offline' | 'unavailable' | 'online'
type Rating = 'good' | 'okay' | 'bad'

const fmtTime = (t: number) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
const fmtDate = (t: number) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const isClosed = (c: LiveChat) => c.messages.some((m) => m.from === 'event' && m.text === 'Conversation Closed')
const masks = { chat: { '--mask': 'url(/widget/message-dots-circle.svg)' } as CSSProperties, history: { '--mask': 'url(/widget/clock-fast-forward.svg)' } as CSSProperties }

/** Untitled UI icons for the connection banners (HOT has none of these). */
function BannerIcon({ kind }: { kind: Exclude<Banner, null> }) {
  const d = {
    offline: 'M12 19.5h.01M2 2l20 20M8.5 16.43a5 5 0 0 1 6.28-.62M5.17 12.83a10 10 0 0 1 5.03-2.69m6.09.35a10 10 0 0 1 2.53 1.62M1.42 9a16 16 0 0 1 4.12-2.6m4.63-1.3A16 16 0 0 1 22.58 9',
    unavailable: 'M22 15.84a10.42 10.42 0 0 1-4.31.93c-5.78 0-10.46-4.68-10.46-10.46 0-1.54.33-3 .93-4.31A10.46 10.46 0 0 0 2 11.54C2 17.32 6.68 22 12.46 22c4.24 0 7.9-2.53 9.54-6.16Z',
    online: 'M12 19.5h.01M22.81 8.7A15.94 15.94 0 0 0 12 4.5c-4.17 0-7.96 1.59-10.81 4.2m3.54 3.54A10.96 10.96 0 0 1 12 9.5c2.79 0 5.33 1.04 7.27 2.74m-3.57 3.53A5.97 5.97 0 0 0 12 14.5c-1.42 0-2.72.49-3.75 1.31',
  }[kind]
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
}

export function ChatInteractionPage() {
  const [s] = useState(loadSettings)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [stage, setStage] = useState<Stage>('home')
  // Pre-chat form (states 1–3): it slides in under the greeting a moment after the widget opens.
  const [formShown, setFormShown] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [visitor, setVisitor] = useState<string | null>(null)
  // Conversation
  const [items, setItems] = useState<Item[]>([])
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const [human, setHuman] = useState(false)
  const [, setTick] = useState(0)
  const [banner, setBanner] = useState<Banner>(null)
  // Previous conversations (when switched on in Widget Design): the list, or one past chat's transcript by id.
  const [panel, setPanel] = useState<'chat' | 'history' | string>('chat')
  const [menuOpen, setMenuOpen] = useState(false)
  const allChats = useLiveChats()
  // After a click the tooltip stays hidden until the pointer leaves and comes back.
  const [tipQuiet, setTipQuiet] = useState(false)
  // CSAT (states 20–23)
  const [rating, setRating] = useState<Rating | null>(null)
  const [feedback, setFeedback] = useState('')
  const timers = useRef<number[]>([])
  const nextId = useRef(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const step = useRef<'ask' | 'resolved' | 'connect' | 'human' | 'done'>('ask')
  // The matching conversation in Conversations: created on the visitor's first message, with everything said so far.
  const chatId = useRef<string | null>(null)
  const transcript = useRef<LiveMessage[]>([])
  const agentSeen = useRef(0)

  const later = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)) }
  const stopTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => stopTimers, [])

  // "Just now" turns into the time after a minute.
  useEffect(() => { const t = window.setInterval(() => setTick((n) => n + 1), 30000); return () => clearInterval(t) }, [])
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }) }, [items, typing, stage])

  // A real loss of connection shows the red banner; coming back shows "Back Online!" briefly (states 9 and 11).
  useEffect(() => {
    const off = () => setBanner('offline')
    const on = () => { setBanner('online'); later(2500, () => setBanner((b) => (b === 'online' ? null : b))) }
    window.addEventListener('offline', off)
    window.addEventListener('online', on)
    return () => { window.removeEventListener('offline', off); window.removeEventListener('online', on) }
  }, [])

  const push = (item: Omit<Extract<Item, { kind: 'msg' }>, 'id' | 'at' | 'kind'> | Omit<Extract<Item, { kind: 'divider' }>, 'id' | 'kind'>, mirror = true) => {
    const id = nextId.current++
    setItems((list) => [...list, 'from' in item ? { kind: 'msg', id, at: Date.now(), ...item } : { kind: 'divider', id, ...item }])
    // Pending dividers ("Connecting…") are mirrored once they settle.
    if (mirror && !('pending' in item && item.pending)) record('from' in item ? { from: item.from === 'human' ? 'agent' : item.from, text: item.text } : { from: 'event', text: item.text })
    return id
  }
  const record = (m: Omit<LiveMessage, 'at'>) => {
    transcript.current.push({ ...m, at: Date.now() })
    if (chatId.current) addLiveMessage(chatId.current, m)
  }
  /** The first time the visitor writes, the chat shows up in Assigned to Bot. */
  const openInHiver = () => {
    if (chatId.current) return
    chatId.current = `live-${Date.now()}`
    createLiveChat({ id: chatId.current, name: visitor ?? name.trim(), email: email.trim(), view: 'bot', assignee: 'none', messages: transcript.current })
  }

  // John Cole's replies from Conversations.
  useEffect(() => subscribeLiveChats(() => {
    const chat = readLiveChats().find((c) => c.id === chatId.current)
    if (!chat) return
    // The agent closed it in Hiver: end the chat here too, which brings up CSAT.
    if (chat.closed && step.current !== 'done') { closeConversation(); return }
    const fromAgent = chat.messages.filter((m) => m.from === 'agent')
    const fresh = fromAgent.slice(agentSeen.current)
    if (!fresh.length) return
    agentSeen.current = fromAgent.length
    stopTimers()
    setTyping(false)
    step.current = 'human'
    setHuman(true)
    fresh.forEach((m) => push({ from: 'human', text: m.text }, false))
  }), [])
  /** The agent "types" for a moment, then each line arrives. */
  const reply = (from: Sender, lines: { text: string; choices?: Choice[] }[], delay = 1200, then?: () => void) => {
    setTyping(true)
    later(delay, () => {
      setTyping(false)
      lines.forEach((l) => push({ from, ...l }))
      then?.()
    })
  }
  /** Marks the question that offered these choices as answered, then posts the visitor's pick. */
  const pick = (choices: Choice[], label: string) => {
    setItems((list) => list.map((it) => (it.kind === 'msg' && it.choices === choices ? { ...it, picked: label } : it)))
    openInHiver()
    push({ from: 'visitor', text: label })
  }

  const humanName = s.agentName === 'hidden' ? s.heading : s.agentName === 'first' ? HUMAN.name.split(' ')[0] : HUMAN.name
  const agentLabel = (from: Sender) => (from === 'ai' ? 'AI Agent' : humanName)

  const closeConversation = () => {
    stopTimers()
    setTyping(false)
    step.current = 'done'
    // Ended here, Hiver marks it closed too (an agent's close is already recorded).
    if (chatId.current) updateLiveChat(chatId.current, (c) => ({ closed: c.closed ?? { by: 'visitor', at: Date.now() } }))
    later(600, () => { push({ text: 'Conversation Closed' }); setStage(s.csat ? 'closed' : 'thanks') })
  }

  const startChat = () => {
    stopTimers()
    setItems([])
    setHuman(false)
    setRating(null)
    setFeedback('')
    step.current = 'ask'
    chatId.current = null
    transcript.current = []
    agentSeen.current = 0
    setStage('chat')
    reply('ai', [{ text: 'Welcome aboard!' }, { text: 'How can I help you today?' }], 1000)
  }

  // Scripted AI agent: answer, ask if it helped, offer a human (states 6–15).
  const askConnect = () => {
    step.current = 'connect'
    const choices: Choice[] = [
      { label: 'Yes', onPick: () => { pick(choices, 'Yes'); handoff() } },
      { label: 'No', onPick: () => { pick(choices, 'No'); reply('ai', [{ text: 'No problem. Ask me anything else whenever you like.' }]); step.current = 'ask' } },
    ]
    reply('ai', [{ text: 'Do you wish to connect with our support team?', choices }], 1000)
  }
  // In Conversations the chat moves from Assigned to Bot to Mine, assigned to John Cole, who then replies from there.
  const handoff = () => {
    step.current = 'human'
    reply('ai', [{ text: 'Let me connect you with someone from our support team who can help further.' }], 900, () => {
      const wait = push({ text: 'Connecting with our support team', pending: true })
      if (chatId.current) updateLiveChat(chatId.current, () => ({ view: 'mine', assignee: ME.value }))
      later(2200, () => {
        const joined = `${humanName} has joined the conversation`
        setItems((list) => list.map((it) => (it.id === wait && it.kind === 'divider' ? { ...it, text: joined, pending: false } : it)))
        record({ from: 'event', text: joined })
        setHuman(true)
        // John greets the visitor; counted as seen so it isn't picked up again from Conversations.
        setTyping(true)
        later(1000, () => {
          setTyping(false)
          agentSeen.current += 1
          push({ from: 'human', text: 'Hello. How can I help you?' })
        })
      })
    })
  }

  const send = (e?: FormEvent) => {
    e?.preventDefault()
    const text = draft.trim()
    if (!text || stage !== 'chat') return
    setDraft('')
    openInHiver()
    push({ from: 'visitor', text })
    // With a person on the chat, John Cole answers from Conversations.
    if (step.current === 'human' || step.current === 'done') return
    if (WANTS_PERSON.test(text)) { stopTimers(); setTyping(false); handoff(); return }
    if (step.current !== 'ask') return
    step.current = 'resolved'
    const choices: Choice[] = [
      { label: 'Yes', onPick: () => { pick(choices, 'Yes'); reply('ai', [{ text: 'Glad I could help!' }], 800, closeConversation) } },
      { label: 'No', onPick: () => { pick(choices, 'No'); askConnect() } },
    ]
    const answer = /password|reset|login|sign/i.test(text) ? PASSWORD_ANSWER : 'Thanks for reaching out. You can explore help.hiverhq.com for more details.'
    reply('ai', [{ text: answer }, { text: 'Is your issue resolved?', choices }], 1800)
  }
  // The send button stops a reply while the agent is typing (state 7).
  const stopReply = () => { stopTimers(); setTyping(false); if (step.current === 'resolved') step.current = 'ask' }

  const onComposerKey = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  const toggle = () => {
    setTipQuiet(true)
    if (open) { setClosing(true); return }
    setOpen(true)
    if (stage === 'home' && !visitor) later(400, () => setFormShown(true))
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const canStart = name.trim() !== '' && emailOk
  const submitForm = (e: FormEvent) => { e.preventDefault(); if (!canStart) return; setVisitor(name.trim()); startChat() }

  const style = { '--widget-color': s.color } as CSSProperties
  const logo = s.logo?.url ?? DEFAULT_LOGO
  const headerAvatar = human && s.agentName !== 'hidden' ? HUMAN.avatar : logo
  // As in the Widget Design preview: with the name hidden, the tagline stands in for "heading - agent".
  const subtitle = human && s.agentName === 'hidden' ? s.tagline : `${s.heading} - ${human ? humanName : 'AI Agent'}`

  // This browser's other chats with the inbox, newest first (anonymous history is browser-specific).
  const past = allChats.filter((c) => c.id !== chatId.current)
  const transcript_ = past.find((c) => c.id === panel)
  const showMenu = s.history && s.historyDesign === 'menu'
  const showNav = s.history && s.historyDesign === 'nav'
  const openHistory = () => { setMenuOpen(false); setPanel('history') }
  const newConversation = () => { setPanel('chat'); if (visitor) startChat(); else setStage('home') }

  // Design A: the ⋮ menu holds Previous conversations (and End chat during a chat).
  const historyMenu = showMenu && (
    <span className="hot-wd-menu-anchor">
      <button type="button" className={`hot-wd-icon-btn${menuOpen ? ' hot-wd-icon-btn--on' : ''}`} aria-label="More options" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
        <DotsVertical />
      </button>
      {menuOpen && (
        <span className="hot-wd-menu" role="menu">
          <button type="button" role="menuitem" onClick={openHistory}><span className="hot-wd-mask hot-wd-mask--16" style={masks.history} />Previous conversations</button>
          {stage === 'chat' && <button type="button" role="menuitem" onClick={() => { setMenuOpen(false); closeConversation() }}><Icon name="logout" size={16} />End chat</button>}
        </span>
      )}
    </span>
  )
  // Design B: a Chat / History bar along the bottom.
  const historyNav = showNav && (
    <nav className="hot-wd-nav" aria-label="Widget">
      <button type="button" aria-current={panel === 'chat' || undefined} onClick={() => setPanel('chat')}><span className="hot-wd-mask" style={masks.chat} />Chat</button>
      <button type="button" aria-current={panel !== 'chat' || undefined} onClick={() => setPanel('history')}><span className="hot-wd-mask" style={masks.history} />History</button>
    </nav>
  )
  const backButton = showMenu && <button type="button" className="hot-wd-icon-btn" aria-label="Back" onClick={() => setPanel(panel === 'history' ? 'chat' : 'history')}><Icon name="arrowback" size={16} style={{ width: 20, height: 20 }} /></button>


  const msgGroups: ReactNode[] = []
  items.forEach((it, i) => {
    if (it.kind === 'divider') {
      msgGroups.push(<div key={it.id} className="hot-ci-divider">{it.text}{it.pending && <span className="hot-ci-dots hot-ci-dots--inline"><i /><i /><i /></span>}</div>)
      return
    }
    const next = items[i + 1]
    const last = !next || next.kind !== 'msg' || next.from !== it.from
    const prev = items[i - 1]
    const first = !prev || prev.kind !== 'msg' || prev.from !== it.from
    msgGroups.push(
      <div key={it.id} className={`hot-ci-msg hot-ci-msg--${it.from === 'visitor' ? 'out' : 'in'}${first ? ' hot-ci-msg--first' : ''}`}>
        <div className="hot-ci-bubble">
          <span className="hot-ci-bubble__text">{it.text}</span>
          {it.choices && (
            <span className="hot-ci-choices">
              {it.choices.map((c) => <button key={c.label} type="button" disabled={!!it.picked || stage !== 'chat'} onClick={c.onPick}>{c.label}</button>)}
            </span>
          )}
        </div>
        {last && (
          <span className="hot-ci-meta">
            {it.from !== 'visitor' && <>{agentLabel(it.from)}<i /></>}
            {Date.now() - it.at < 60000 ? 'Just now' : fmtTime(it.at)}
          </span>
        )}
      </div>,
    )
  })

  return (
    <div className="hot-ci" style={style}>
      {/* Prototype controls, outside the widget: show the two banners the visitor can't trigger from here. */}
      <div className="hot-ci-sim" aria-label="Simulate">
        <span>Simulate</span>
        <button type="button" onClick={() => setBanner('offline')}>Connection lost</button>
        <button type="button" onClick={() => setBanner('unavailable')}>Chat unavailable</button>
        <button type="button" onClick={() => setBanner(null)}>Clear</button>
      </div>

      {open && (
        <section className={`hot-ci-widget${closing ? ' hot-ci-widget--closing' : ''}`} aria-label="Chat" onAnimationEnd={() => { if (closing) { setOpen(false); setClosing(false) } }}>
          {panel === 'history' ? (
            <>
              <header className="hot-ci-header">
                {backButton}
                <span className="hot-ci-header__titles"><strong>Previous conversations</strong><span>Your older conversations</span></span>
              </header>
              {past.length ? (
                <ul className="hot-wd-past">
                  {past.map((c) => (
                    <li key={c.id} className="hot-wd-past__row" role="button" tabIndex={0} onClick={() => setPanel(c.id)} onKeyDown={(e) => { if (e.key === 'Enter') setPanel(c.id) }}>
                      <span className="hot-wd-past__text">
                        <span className="hot-wd-past__title">Your conversation</span>
                        <span className="hot-wd-past__meta">{fmtDate(c.updatedAt)}{isClosed(c) ? <Tag color="lightBlue">Resolved</Tag> : <Tag color="green">Open</Tag>}</span>
                      </span>
                      <Icon name="chevronright" size={16} />
                    </li>
                  ))}
                </ul>
              ) : <div className="hot-ci-past-empty">No previous conversations yet.</div>}
              <div className="hot-ci-footer"><button type="button" className="hot-ci-primary" onClick={newConversation}>Start new conversation</button></div>
            </>
          ) : transcript_ ? (
            <>
              <header className="hot-ci-header">
                {backButton}
                <span className="hot-ci-header__titles"><strong>Your conversation</strong><span>{fmtDate(transcript_.updatedAt)}</span></span>
              </header>
              <div className="hot-ci-thread">
                {transcript_.messages.map((m, i) => m.from === 'event'
                  ? <div key={i} className="hot-ci-divider">{m.text}</div>
                  : (
                    <div key={i} className={`hot-ci-msg hot-ci-msg--${m.from === 'visitor' ? 'out' : 'in'} hot-ci-msg--first`}>
                      <div className="hot-ci-bubble"><span className="hot-ci-bubble__text">{m.text}</span></div>
                      <span className="hot-ci-meta">{m.from !== 'visitor' && <>{m.from === 'ai' ? 'AI Agent' : humanName}<i /></>}{fmtTime(m.at)}</span>
                    </div>
                  ))}
              </div>
            </>
          ) : stage === 'home' ? (
            <>
              <header className="hot-ci-header">
                <img className="hot-ci-header__logo" src={logo} width={40} height={40} alt="" />
                <span className="hot-ci-header__titles"><strong>{s.heading}</strong><span>{s.tagline}</span></span>
                {historyMenu}
              </header>
              <form className={`hot-ci-home${formShown ? ' hot-ci-home--form' : ''}`} onSubmit={submitForm} noValidate>
                <div className="hot-ci-home__body">
                  <div className="hot-ci-home__hero">
                    <strong>{s.greeting.trim() || 'Hi there!'}</strong>
                    <span>{s.welcome.trim() || 'We are here to help you'}</span>
                  </div>
                  {formShown && (
                    <div className="hot-ci-form">
                      <p>Please enter the information to start conversation</p>
                      <label>Full Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" autoComplete="name" /></label>
                      <label>Email Address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" /></label>
                      <label>Phone Number
                        <span className="hot-ci-phone">
                          <select aria-label="Country code" defaultValue="+1"><option value="+1">🇺🇸 +1</option><option value="+44">🇬🇧 +44</option><option value="+91">🇮🇳 +91</option></select>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" autoComplete="tel-national" />
                        </span>
                      </label>
                    </div>
                  )}
                </div>
                <div className="hot-ci-footer"><button type="submit" className="hot-ci-primary" disabled={!canStart}>{s.startLabel.trim() || DEFAULT_START_LABEL}</button></div>
              </form>
            </>
          ) : (
            <>
              <header className="hot-ci-header">
                <span className="hot-ci-header__avatar">
                  <img src={headerAvatar} width={40} height={40} alt="" />
                  <img className="hot-ci-header__online" src="/widget/online.svg" width={13} height={13} alt="" />
                </span>
                <span className="hot-ci-header__titles"><strong>{s.heading}</strong><span>{subtitle}</span></span>
                {historyMenu || stage === 'chat' && <button type="button" className="hot-ci-icon-btn" aria-label="End chat" title="End chat" onClick={closeConversation}><img src="/widget/logout.svg" width={20} height={20} alt="" /></button>}
              </header>

              <div className="hot-ci-thread" ref={scrollRef} aria-live="polite">
                {msgGroups}
                {typing && <div className="hot-ci-msg hot-ci-msg--in hot-ci-msg--first"><span className="hot-ci-bubble hot-ci-typing" aria-label="Agent is typing"><span className="hot-ci-dots"><i /><i /><i /></span></span></div>}
                {stage === 'closed' && (
                  <form className="hot-ci-csat" onSubmit={(e) => { e.preventDefault(); if (rating) setStage('thanks') }}>
                    <p>How was your conversation experience with us?</p>
                    <div className="hot-ci-csat__options" role="radiogroup" aria-label="Rating">
                      {([['good', '😀', 'Satisfied'], ['okay', '😐', 'Okay'], ['bad', '🙁', 'Not Satisfied']] as const).map(([v, emoji, label]) => (
                        <button key={v} type="button" role="radio" aria-checked={rating === v} className={rating && rating !== v ? 'hot-ci-csat__dim' : undefined} onClick={() => setRating(v)}>
                          <span className="hot-ci-csat__emoji">{emoji}</span><span className="hot-ci-csat__label">{label}</span>
                        </button>
                      ))}
                    </div>
                    <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Please share your feedback" rows={4} />
                    <button type="submit" className="hot-ci-primary" disabled={!rating}>Submit</button>
                  </form>
                )}
                {stage === 'thanks' && <div className="hot-ci-thanks">{s.csat ? 'Thank you for your feedback.' : 'Thanks for chatting with us.'}</div>}
              </div>

              {stage === 'chat' ? (
                <form className="hot-ci-footer" onSubmit={send}>
                  <div className="hot-ci-composer">
                    <textarea value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onComposerKey} placeholder="Ask me anything!" rows={2} aria-label="Message" />
                    <div className="hot-ci-composer__tools">
                      {s.filePicker ? <button type="button" className="hot-ci-icon-btn" aria-label="Attach a file"><Icon name="attachment" size={16} /></button> : <span />}
                      {typing
                        ? <button type="button" className="hot-ci-send hot-ci-send--on" aria-label="Stop" onClick={stopReply}><span className="hot-ci-stop" /></button>
                        : <button type="submit" className={`hot-ci-send${draft.trim() ? ' hot-ci-send--on' : ''}`} aria-label="Send" disabled={!draft.trim()}><img src="/widget/send.svg" width={16} height={16} alt="" /></button>}
                    </div>
                  </div>
                </form>
              ) : stage === 'thanks' ? (
                <div className="hot-ci-footer"><button type="button" className="hot-ci-primary" onClick={startChat}>{s.startLabel.trim() || DEFAULT_START_LABEL}</button></div>
              ) : null}
            </>
          )}

          {historyNav}

          {banner && (
            <div className={`hot-ci-banner hot-ci-banner--${banner}`} role="status">
              <BannerIcon kind={banner} />
              <span>{{ offline: 'Failed to load new messages.', unavailable: 'Support chat unavailable', online: 'Back Online!' }[banner]}</span>
              {banner === 'offline' && <button type="button" onClick={() => { setBanner('online'); later(2500, () => setBanner((b) => (b === 'online' ? null : b))) }}>Reconnect</button>}
            </div>
          )}
        </section>
      )}

      <button
        type="button" className={`hot-wd-launcher hot-ci-launcher${s.launcherLabel ? ' hot-wd-launcher--pill' : ''}${tipQuiet ? ' hot-ci-launcher--quiet' : ''}${open && !closing ? ' hot-ci-launcher--open' : ''}`}
        aria-label={open && !closing ? 'Close chat' : s.launcherLabel || 'Open chat'} aria-expanded={open && !closing} onClick={toggle} onPointerLeave={() => setTipQuiet(false)}
      >
        {open && !closing ? <span key="close" className="hot-wd-launcher__slot hot-ci-launcher__icon"><Icon name="close" size={16} style={{ width: 20, height: 20 }} /></span>
          : launcherImage(s) ? <img key="image" className="hot-ci-launcher__icon" src={launcherImage(s)!.url} alt="" width={48} height={48} />
          : <span key="bubble" className="hot-wd-launcher__slot hot-ci-launcher__icon"><Icon name="chatsupport" size={24} /></span>}
        {s.launcherLabel && <span className="hot-wd-launcher__label hot-ci-launcher__label" aria-hidden={open && !closing}>{s.launcherLabel}</span>}
        {s.launcherTooltip && !(open && !closing) && <span className="hot-wd-tooltip hot-ci-tooltip" role="tooltip">{s.launcherTooltip}</span>}
      </button>
    </div>
  )
}
