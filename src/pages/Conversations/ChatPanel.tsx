import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Avatar } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { Icon } from '../../icons/Icon'
import type { ChatConversation, ChatMessage } from './data'
import { ME, addLiveMessage } from './liveChats'

// Canned replies that simulate the visitor answering, as in the linked-conversations prototype.
const RANDOM_REPLIES = ['Thanks, got it!', 'Sure, let me check.', 'Sounds good 👍', 'On it!', 'Perfect, appreciate it.', 'Okay, will do.', 'Great, thanks for the update.']
const randomReply = () => RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)]
const EMOJIS = ['😀', '😂', '😊', '😍', '🤔', '😅', '😢', '😮', '👍', '🙏', '👏', '🤝', '🎉', '🔥', '❤️', '💯', '✅', '🚀', '📦', '📍', '⏰', '💬', '😎', '🙌']
const formatNow = () => new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  return (
    <div className="chat-emoji" ref={ref}>
      <Button iconOnly variant="ghost" size="xs" aria-label="Emoji" onClick={() => setOpen((o) => !o)}><Icon name="emoji" size={16} /></Button>
      {open && (
        <div className="chat-emoji__menu">
          {EMOJIS.map((emoji) => <button key={emoji} type="button" className="chat-emoji__item" onClick={() => { onSelect(emoji); setOpen(false) }}>{emoji}</button>)}
        </div>
      )}
    </div>
  )
}

function Message({ m }: { m: ChatMessage }) {
  if (m.kind === 'event') return <div className="chat-event">{m.text}</div>
  if (m.kind === 'incoming') {
    return (
      <div className="chat-message chat-message--incoming">
        <div className="chat-bubble chat-bubble--incoming">{m.text}</div>
        <span className="chat-message__meta">{m.time}</span>
      </div>
    )
  }
  return (
    <div className="chat-message chat-message--outgoing">
      <div className="chat-bubble chat-bubble--outgoing">{m.text}</div>
      <span className="chat-message__meta">{m.sender ?? ME.name} - {m.time}</span>
    </div>
  )
}

/**
 * The middle column: the visitor's name, the chat thread and the reply box. In a live chat the reply goes to the
 * visitor's tab; in the sample chats a canned reply comes back after 2s.
 */
export function ChatPanel({ conversation }: { conversation: ChatConversation }) {
  const [sent, setSent] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => { const el = threadRef.current; if (el) el.scrollTop = el.scrollHeight }, [sent, conversation.messages.length])

  const send = () => {
    const value = text.trim()
    if (!value) return
    setText('')
    if (conversation.live) { addLiveMessage(conversation.id, { from: 'agent', text: value }); return }
    setSent((prev) => [...prev, { kind: 'agent-text', text: value, time: formatNow(), sender: ME.name }])
    setTimeout(() => setSent((prev) => [...prev, { kind: 'incoming', text: randomReply(), time: formatNow() }]), 2000)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className="chat-panel">
      <div className="chat-panel__topbar">
        <Avatar initial={conversation.title.charAt(0).toUpperCase()} color={conversation.avatarColor} title={conversation.title} />
        <span className="chat-panel__title">{conversation.title}</span>
      </div>
      <div className="chat-panel__thread" ref={threadRef}>
        {[...conversation.messages, ...sent].map((m, i) => <Message key={i} m={m} />)}
      </div>
      <div className="chat-panel__composer-wrap">
        <div className="chat-composer">
          <textarea className="chat-composer__input" placeholder="Shift + Enter for new line" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} aria-label="Reply" />
          <div className="chat-composer__toolbar">
            <div className="chat-composer__tools">
              <EmojiPicker onSelect={(emoji) => setText((t) => t + emoji)} />
              <Button iconOnly variant="ghost" size="xs" aria-label="Attach a file"><Icon name="attachment" size={16} /></Button>
            </div>
            <Button variant="primary" size="sm" disabled={!text.trim()} onClick={send}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
