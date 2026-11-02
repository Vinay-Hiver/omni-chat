// Conversations shows the Chat-Support inbox; the Admin Panel icon opens Shared Inbox > Chat Inboxes, where Chat-Support's settings (Widget Design) live.
import { useState } from 'react'
import { ConversationsPage } from './pages/Conversations/ConversationsPage'
import { SharedInboxesPage } from './pages/SharedInboxes'

export default function App() {
  const [page, setPage] = useState<'conversations' | 'admin'>('conversations')
  const navigate = (id: string) => { if (id === 'conversations' || id === 'admin') setPage(id) }
  return page === 'admin' ? <SharedInboxesPage channel="chat" onNavigate={navigate} /> : <ConversationsPage onNavigate={navigate} />
}
