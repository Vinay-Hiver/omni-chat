import { useState } from 'react'
import { Icon } from '../../icons/Icon'
import { ConversationsSidebar } from '../../patterns/ConversationsSidebar'
import type { ConversationsSidebarSection } from '../../patterns/ConversationsSidebar'
import { channelViews, myWorkViews, personalViews, viewLibrary } from '../../patterns/ConversationsSidebar/data'
import { EmptyState } from '../../patterns/EmptyState'
import { MainNav } from '../../patterns/MainNav'
import { navSampleFooterItems, navSampleItems, navSampleUserMenu } from '../../patterns/MainNav/sampleData'
import { PageLayout } from '../../patterns/PageLayout'
import { ChannelRightPanel } from '../../patterns/RightPanel/ChannelRightPanel'
import { ChatPanel } from './ChatPanel'
import { CHAT_INBOX, chatConversations } from './data'
import './ConversationsPage.css'

const inboxViewId = (view: string) => `${CHAT_INBOX.id}-${view}`

/** The sidebar: My Work and Personal, one shared inbox (Chat-Support) with the chat views, then More. */
const sections: ConversationsSidebarSection[] = [
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
        return { id: inboxViewId(v.id), label: v.label, icon: v.icon, count: v.hasCount ? chatConversations.filter((c) => c.view === v.id).length : undefined }
      }),
    }],
  },
  {
    title: 'More',
    items: [{ id: 'sent', label: 'Sent', icon: 'send' }, { id: 'drafts', label: 'Drafts', icon: 'document' }, { id: 'spam', label: 'Spam', icon: 'spam' }, { id: 'all-mail', label: 'All mail', icon: 'allmails' }],
  },
]

const viewLabel = (id: string) => sections.flatMap((s) => s.items.flatMap((i) => [i, ...(i.views ?? [])])).find((x) => x.id === id)

export type ConversationsPageProps = {
  /** Called with the id of the Main nav item that was pressed (for example `admin`). */
  onNavigate?: (id: string) => void
}

/** Conversations: the Chat-Support inbox's views, a list of its chats, the chat thread and the chat right panel. */
export function ConversationsPage({ onNavigate }: ConversationsPageProps) {
  const [viewId, setViewId] = useState(inboxViewId('unassigned'))
  const view = viewId.startsWith(`${CHAT_INBOX.id}-`) ? viewId.slice(CHAT_INBOX.id.length + 1) : undefined
  const list = chatConversations.filter((c) => c.view === view)
  const [selected, setSelected] = useState<string | undefined>(list[0]?.id)
  const conversation = list.find((c) => c.id === selected) ?? list[0]
  const current = viewLabel(viewId)

  const changeView = (id: string) => {
    setViewId(id)
    const v = id.startsWith(`${CHAT_INBOX.id}-`) ? id.slice(CHAT_INBOX.id.length + 1) : undefined
    setSelected(chatConversations.find((c) => c.view === v)?.id)
  }

  return (
    <PageLayout
      variant="home"
      nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="conversations" onChange={onNavigate} user={{ initial: 'A', name: 'Arnold' }} userMenu={navSampleUserMenu} />}
      sidebar={<ConversationsSidebar sections={sections} value={viewId} onChange={changeView} />}
      rightPanel={conversation ? <ChannelRightPanel channel="chat" inboxName={CHAT_INBOX.name} unassigned={conversation.view === 'unassigned'} conversationId={conversation.id} /> : undefined}
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
