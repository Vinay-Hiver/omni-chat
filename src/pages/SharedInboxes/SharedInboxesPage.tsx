import { useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import { Button } from '../../components/Button'
import { Table } from '../../components/Table'
import type { TableColumn } from '../../components/Table'
import { AdminSidebar } from '../../patterns/AdminSidebar'
import { adminSampleSections } from '../../patterns/AdminSidebar/sampleData'
import { EmptyState } from '../../patterns/EmptyState'
import { MainNav } from '../../patterns/MainNav'
import { navSampleFooterItems, navSampleItems, navSampleUserMenu } from '../../patterns/MainNav/sampleData'
import { PageLayout } from '../../patterns/PageLayout'
import { SubNav } from '../../patterns/SubNav'
import { getSubNav } from '../../patterns/SubNav/data'
import type { SubNavChannelId } from '../../patterns/SubNav/data'
import { sharedInboxChannels } from './data'
import type { Inbox } from './data'
import { WidgetDesignPage } from '../WidgetDesign/WidgetDesignPage'
import './SharedInboxesPage.css'

function ChannelIcon({ icon }: { icon: IconName }) {
  return <Icon name={icon} size={16} />
}

/** The heading bar over a page's content: 60px tall, a line under it, the page name on the left. */
export function PageBar({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="hot-shared-inboxes__bar"><h1 className="hot-shared-inboxes__bar-title">{title}</h1>{action}</div>
}

export type SharedInboxesPageProps = {
  /** Called with the id of the Admin sidebar item that was pressed (for example `schedule`), so a page above can switch to it. */
  onAdminNavigate?: (id: string) => void
  /** Which channel's inboxes show first. */
  channel?: SubNavChannelId
  /** Opens this inbox's settings straight away (an inbox id, for example `whatsapp-1`). */
  inboxId?: string
  /** Which page of the inbox settings is selected when an inbox is open. Defaults to the channel's first page. */
  settingsItem?: string
  /** Called with the id of the Main nav item that was pressed (for example `conversations`). */
  onNavigate?: (id: string) => void
}

/**
 * Admin panel > Shared Inbox. The sub-nav lists the channels; picking one shows its inboxes in a table (a delete icon appears when a row is hovered).
 * Pressing an inbox opens its settings: the sub-nav then lists that channel's settings pages, from the Sub-nav database.
 * Temporary: the settings pages themselves are not built yet, so the content shows a placeholder.
 */
export function SharedInboxesPage({ channel: initialChannel = 'email', inboxId, settingsItem, onAdminNavigate, onNavigate }: SharedInboxesPageProps) {
  const [channelId, setChannelId] = useState<SubNavChannelId>(initialChannel)
  const [lists, setLists] = useState<Record<string, Inbox[]>>(() => Object.fromEntries(sharedInboxChannels.map((c) => [c.id, c.inboxes])))
  const found = inboxId ? sharedInboxChannels.flatMap((c) => c.inboxes.map((i) => ({ channel: c.id, inbox: i }))).find((x) => x.inbox.id === inboxId) : undefined
  const [open, setOpen] = useState<{ channel: SubNavChannelId; inbox: Inbox } | null>(found ? { channel: found.channel, inbox: found.inbox } : null)
  const [page, setPage] = useState<string | undefined>(settingsItem)

  const channel = sharedInboxChannels.find((c) => c.id === channelId) ?? sharedInboxChannels[0]
  const inboxes = lists[channel.id] ?? []

  // Email inboxes also show their address and how the mailbox is connected; the other channels have neither.
  const columns: TableColumn<Inbox>[] = [
    { key: 'name', header: 'Name', width: channel.id === 'email' ? '28%' : undefined, render: (r) => <span className="hot-shared-inboxes__name"><ChannelIcon icon={channel.icon} />{r.name}</span> },
    // The Account Type column takes what is left, so its longest value ("Distribution List or Microsoft 365 Group") fits
    ...(channel.id === 'email' ? [{ key: 'email', header: 'Email', width: '27%' }, { key: 'accountType', header: 'Account Type' }] : []),
    { key: 'actions', width: 100 },
  ]

  const nav = <MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="admin" onChange={onNavigate} user={{ initial: 'A', name: 'Alex' }} userMenu={navSampleUserMenu} />
  const sidebar = <AdminSidebar sections={adminSampleSections} value="shared-inbox" onChange={onAdminNavigate} />

  let subNav: ReactNode
  let content: ReactNode
  if (open) {
    const settings = getSubNav(open.channel)
    // The arrow beside the heading switches to another inbox of the same channel (an email inbox also shows its address).
    const switchList = (lists[open.channel] ?? []).map((i) => ({ value: i.id, label: i.name, description: i.email }))
    const selected = settings.items.find((i) => i.id === page) ?? settings.items.find((i) => i.id === settings.defaultSelected) ?? settings.items[0]
    subNav = (
      <SubNav
        title={open.inbox.name} subtitle={settings.subtitle ? open.inbox.email : undefined} items={settings.items} value={selected.id} onChange={setPage}
        onBack={() => { setOpen(null); setPage(undefined) }} onTitleClick={settings.switcher === 'none' || switchList.length > 0 ? undefined : () => {}} switcher={settings.switcher === 'plain' ? 'plain' : 'box'}
        switchOptions={switchList.length > 0 && settings.switcher !== 'none' ? switchList : undefined} switchValue={open.inbox.id}
        onSwitch={(id) => { const next = (lists[open.channel] ?? []).find((i) => i.id === id); if (next) setOpen({ channel: open.channel, inbox: next }) }}
      />
    )
    content = selected.id === 'widgetDesign' ? <WidgetDesignPage /> : (
      <div className="hot-shared-inboxes__page">
        <PageBar title={selected.label} />
        <div className="hot-shared-inboxes__placeholder">{selected.label} page</div>
      </div>
    )
  } else {
    subNav = <SubNav title="Shared Inboxes" items={sharedInboxChannels.map((c) => ({ id: c.id, label: c.label, icon: c.icon }))} value={channel.id} onChange={(id) => setChannelId(id as SubNavChannelId)} />
    content = (
      <>
        <PageBar title={channel.label} action={<Button variant="primary" size="sm">{`Create ${channel.singular}`}</Button>} />
        <div className="hot-shared-inboxes__body">
          {inboxes.length > 0 ? (
            <Table
              aria-label={channel.label} columns={columns} rows={inboxes} getRowId={(r) => r.id}
              onRowClick={(r) => { setOpen({ channel: channel.id, inbox: r }); if (channel.id === 'chat') setPage('widgetDesign') }}
              rowActions={[{ icon: 'delete', label: 'Delete', onClick: (r) => setLists((l) => ({ ...l, [channel.id]: l[channel.id].filter((i) => i.id !== r.id) })) }]}
            />
          ) : (
            <EmptyState icon="search" title="No inboxes yet" description={`There are no ${channel.label.toLowerCase()} to show.`} />
          )}
        </div>
      </>
    )
  }

  return <PageLayout variant="admin" nav={nav} sidebar={sidebar} subNav={subNav}>{content}</PageLayout>
}
