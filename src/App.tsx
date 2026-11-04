// Opens on Admin Panel > Shared Inbox > Chat Inboxes. The Conversations icon shows the Chat-Support inbox; the Admin Panel icon opens Shared Inbox > Chat Inboxes, where Chat-Support's settings (Widget Design) live.
// /chat-interaction is the visitor's side: an empty page with the launcher and the full chat flow.
// /options opens straight on Chat-Support > Widget Design with the four layout options and their switcher.
import { useState } from 'react'
import { ConversationsPage } from './pages/Conversations/ConversationsPage'
import { SharedInboxesPage } from './pages/SharedInboxes'
import { WidgetDesignOptionsPage } from './pages/WidgetDesignOptions/WidgetDesignOptionsPage'
import { ChatInteractionPage } from './pages/ChatInteraction/ChatInteractionPage'

const path = window.location.pathname.replace(/\/$/, '')
const isOptions = path === '/options'

export default function App() {
  const [page, setPage] = useState<'conversations' | 'admin'>('admin')
  const navigate = (id: string) => { if (id === 'conversations' || id === 'admin') setPage(id) }
  if (path === '/chat-interaction') return <ChatInteractionPage />
  if (page === 'admin' && isOptions) {
    return <SharedInboxesPage channel="chat" inboxId="chat-support" settingsItem="widgetDesign" widgetDesign={WidgetDesignOptionsPage} onNavigate={navigate} />
  }
  return page === 'admin' ? <SharedInboxesPage channel="chat" onNavigate={navigate} /> : <ConversationsPage onNavigate={navigate} />
}
