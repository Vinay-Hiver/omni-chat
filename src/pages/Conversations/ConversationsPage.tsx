import { useState } from 'react'
import { Icon } from '../../icons/Icon'
import { ConversationsSidebar } from '../../patterns/ConversationsSidebar'
import type { ConversationsSidebarSection } from '../../patterns/ConversationsSidebar'
import { channelViews, myWorkViews, personalViews, viewLibrary } from '../../patterns/ConversationsSidebar/data'
import { EmptyState } from '../../patterns/EmptyState'
import { MainNav } from '../../patterns/MainNav'
import { navSampleFooterItems, navSampleItems } from '../../patterns/MainNav/sampleData'
import { PageLayout } from '../../patterns/PageLayout'
import { ChannelRightPanel } from '../../patterns/RightPanel/ChannelRightPanel'
import { ChatPanel } from './ChatPanel'
import { CHAT_INBOX, chatConversations } from './data'
import type { ChatConversation, ChatMessage } from './data'
import { ME, updateLiveChat, useLiveChats } from './liveChats'
import type { LiveChat } from './liveChats'
import './ConversationsPage.css'

const inboxViewId = (view: string) => `${CHAT_INBOX.id}-${view}`

const time = (t: number) => new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

/** A chat from /chat-interaction, in the shape the list and thread use. */
const fromLive = (c: LiveChat): ChatConversation => ({
  id: c.id, view: c.view, title: c.name, avatarColor: 'violet', live: true, assignee: c.assignee, closed: !!c.closed,
  date: new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  preview: [...c.messages].reverse().find((m) => m.from !== 'event')?.text ?? '',
  messages: c.messages.map((m): ChatMessage => m.from === 'event' ? { kind: 'event', text: m.text, time: time(m.at) }
    : m.from === 'visitor' ? { kind: 'incoming', text: m.text, time: time(m.at) }
    : { kind: 'agent-text', text: m.text, time: time(m.at), sender: m.from === 'ai' ? 'AI Agent' : ME.name })
    // Closed from here: one line for the agent; the visitor's own "Conversation Closed" is already in the thread.
    .concat(c.closed?.by === 'agent' ? [{ kind: 'event' as const, text: 'Conversation closed by you', time: time(c.closed.at) }] : []),
})

/** The sidebar: My Work and Personal, one shared inbox (Chat-Support) with the chat views, then More. */
const makeSections = (all: ChatConversation[]): ConversationsSidebarSection[] => [
  {
    items: [
      { id: 'my-work', label: 'My Work', icon: 'sminbox', views: myWorkViews.map((v) => ({ id: `my-work-${v.id}`, label: v.label, icon: v.icon })), hoverIcon: 'settings3' },
      { id: 'personal', label: 'Personal', icon: 'personal', views: personalViews.map((k) => ({ id: `personal-${k}`, label: viewLibrary[k].label, icon: viewLibrary[k].icon })) },
    ],
  },
  {
    title: 'Shared Inbox',
    items: [{
      id: CHAT_INBOX.id, label: CHAT_INBOX.name, icon: 'chatinbox', defaultExpanded: true,
      views: channelViews.chat.map((k) => {
        const v = viewLibrary[k]
        return { id: inboxViewId(v.id), label: v.label, icon: v.icon, count: v.hasCount ? all.filter((c) => c.view === v.id).length : undefined }
      }),
    }],
  },
  {
    title: 'More',
    items: [{ id: 'sent', label: 'Sent', icon: 'send' }, { id: 'drafts', label: 'Drafts', icon: 'document' }, { id: 'spam', label: 'Spam', icon: 'spam' }, { id: 'all-mail', label: 'All mail', icon: 'allmails' }],
  },
]

const viewLabel = (sections: ConversationsSidebarSection[], id: string) => sections.flatMap((s) => s.items.flatMap((i) => [i, ...(i.views ?? [])])).find((x) => x.id === id)

export type ConversationsPageProps = {
  /** Called with the id of the Main nav item that was pressed (for example `admin`). */
  onNavigate?: (id: string) => void
}

/**
 * Conversations: the Chat-Support inbox's views, a list of its chats, the chat thread and the chat right panel.
 * Chats started from /chat-interaction appear live, newest first: in Assigned to Bot, then in Mine once handed to John Cole.
 */
export function ConversationsPage({ onNavigate }: ConversationsPageProps) {
  const live = useLiveChats()
  const all = [...live.map(fromLive), ...chatConversations]
  const sections = makeSections(all)
  const [viewId, setViewId] = useState(inboxViewId('unassigned'))
  const view = viewId.startsWith(`${CHAT_INBOX.id}-`) ? viewId.slice(CHAT_INBOX.id.length + 1) : undefined
  const list = all.filter((c) => c.view === view)
  const [selected, setSelected] = useState<string | undefined>(list[0]?.id)
  const conversation = list.find((c) => c.id === selected) ?? list[0]
  const current = viewLabel(sections, viewId)

  const changeView = (id: string) => {
    setViewId(id)
    const v = id.startsWith(`${CHAT_INBOX.id}-`) ? id.slice(CHAT_INBOX.id.length + 1) : undefined
    setSelected(all.find((c) => c.view === v)?.id)
  }
  // Assigning a live chat to John Cole moves it to Mine; back to None returns it to the bot.
  // Closing a live chat adds "Conversation closed by you" here and ends it in the visitor's tab, which then shows CSAT.
  const setLiveStatus = (status: 'open' | 'pending' | 'closed') => {
    if (!conversation?.live) return
    updateLiveChat(conversation.id, (c) => ({ closed: status === 'closed' ? c.closed ?? { by: 'agent', at: Date.now() } : undefined }))
  }
  const assignLive = (value: string) => {
    if (conversation?.live) updateLiveChat(conversation.id, () => ({ assignee: value === ME.value ? ME.value : 'none', view: value === ME.value ? 'mine' : 'bot' }))
  }

  return (
    <PageLayout
      variant="home"
      nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="conversations" onChange={onNavigate} user={{ initial: 'J', name: ME.name }} />}
      sidebar={<ConversationsSidebar sections={sections} value={viewId} onChange={changeView} />}
      rightPanel={conversation ? (
        <ChannelRightPanel channel="chat" inboxName={CHAT_INBOX.name} unassigned={conversation.view !== 'mine'} conversationId={conversation.id}
          assignee={conversation.live ? conversation.assignee : undefined} onAssigneeChange={conversation.live ? assignLive : undefined}
          status={conversation.live ? (conversation.closed ? 'closed' : 'open') : undefined} onStatusChange={conversation.live ? setLiveStatus : undefined}
        />
      ) : undefined}
    >
      <div className="hot-conversations">
        <div className="hot-conversations__list">
          <div className="hot-conversations__list-header">
            {current && 'icon' in current && current.icon && <Icon name={current.icon} size={16} />}
            <span>{current?.label}</span>
          </div>
          <div className="hot-conversations__list-body">
            {list.map((c) => (
              <div key={c.id} className="hot-conversations__item-wrap">
                <button type="button" className={`hot-conversations__item${c.id === conversation?.id ? ' hot-conversations__item--selected' : ''}`} onClick={() => setSelected(c.id)}>
                  <span className="hot-conversations__row">
                    <Icon name="chatinbox" size={16} />
                    <span className="hot-conversations__name">{c.title}</span>
                    <span className="hot-conversations__date">{c.date}</span>
                  </span>
                  <span className="hot-conversations__preview">{c.preview}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        {conversation ? <ChatPanel key={conversation.id} conversation={conversation} /> : (
          <div className="hot-conversations__empty">
            <EmptyState icon="chat" title="No conversations" description={`There are no conversations in ${current?.label ?? 'this view'}.`} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}
