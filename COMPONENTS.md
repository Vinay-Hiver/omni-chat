# HOT components for building pages

Generated from the code by `npm run agent-docs` (do not edit by hand). Read this one file instead of opening component files.

## Rules

- Build with the components above. If something you need is not here, say so instead of drawing a copy of it by hand.
- Colours and fonts come from the tokens (CSS variables), never from hex values: `color: var(--slateTextBody)`, not `#334155`.
- Icons come from `<Icon name="…" size={14 | 16 | 24} />` (names below). 14px is for non-clickable marks, 16px for buttons and rows, 24px is rarely used. Do not paste your own SVGs.
- Do not start Storybook to find out what exists: this file lists it. Start the app with `npm run dev` only.
- Each component imports its own CSS. Tokens and fonts load once, in `src/main.tsx` (`tokens/tokens.css`, `tokens/typography.css`).
- Layout: wrap a page in `PageLayout` (`variant="home"` has Main nav, sidebar, content, right panel; `variant="admin"` has Main nav, Admin sidebar, Sub-nav, content). The content area fills what is left.

## Components

Import from `components/<Name>` (for example `import { Button } from './components/Button'`).

### Avatar
`import { Avatar } from './components/Avatar'`
- `title?`: string — Accessible name, for example the person's full name.
- `color?`: "lightBlue" | "red" | "orange" | "yellow" | "green" | "purple" | "violet" | "grey" — Background colour of the circle.
- `initial`: string — The letter shown in the circle.
- `size?`: "default" | "small" (default default) — Default is 24px, small is 18px.
- `showStatus?`: boolean (default false) — Shows the status dot at the bottom right.
- `status?`: "online" | "offline" (default online) — With showStatus: a green dot when online (default), a grey dot when offline.

```tsx
<Avatar initial="P" size="small" color="red" status="online" />
```

### Badge
`import { Badge } from './components/Badge'`
- `type?`: "default" | "primary" | "important" (default default) — Default is grey, primary is blue, important is red.

```tsx
<Badge type="primary">12</Badge>
```

### Button
`import { Button } from './components/Button'`
- `variant?`: "error" | "primary" | "secondary" | "secondary-filled" | "ghost" | "neutral" — Visual style.
- `size?`: "sm" | "md" | "xs" — xs = 28px, sm = 32px, md = 40px tall.
- `iconOnly?`: boolean
- `iconLeft?`: ReactNode — 16px icon shown before the label.
- `iconRight?`: ReactNode — 16px icon shown after the label.

```tsx
<Button variant="primary" size="sm" iconLeft={<Icon name="add" size={16} />}>Create</Button>
```

### Checkbox
`import { Checkbox } from './components/Checkbox'`
- `label?`: ReactNode — Text next to the box.
- `indeterminate?`: boolean — Shows the dash instead of the check.
- `invalid?`: boolean — Shows the red error border.

```tsx
<Checkbox label="Remember me" checked={on} onChange={(e) => setOn(e.target.checked)} />
```

### Dropdown
`import { Dropdown } from './components/Dropdown'` — The menu panel only.
- `variant?`: "checkbox" | "radio" | "default" | "avatar" | "icon" (default default) — What each row looks like.
- `options`: DropdownOption[]
- `title?`: string — Heading at the top of the panel.
- `value?`: string | string[] — Selected value (a list of values for checkbox).
- `defaultValue?`: string | string[]
- `onChange?`: function
- `searchable?`: boolean — Shows a search box above the options.
- `searchPlaceholder?`: string (default Search)
- `reorderable?`: boolean — Lets the person drag the rows into a new order.
- `onReorder?`: function
- `actions?`: { cancelLabel?: string | undefined; applyLabel?: string | u… — Shows Cancel and Apply buttons below the options.

```tsx
<Dropdown variant="avatar" searchable searchPlaceholder="Search" options={[{ value: 'a', label: 'Abhay', color: 'yellow' }]} value={v} onChange={setV} />
```

### Input
`import { Input } from './components/Input'`
- `label?`: ReactNode — Label shown above the field.
- `helperText?`: ReactNode — Small text below the field.
- `error?`: boolean — Shows the error border and red helper text.
- `size?`: "sm" | "md" (default md) — sm = 32px, md = 40px tall.
- `prefix?`: ReactNode — Content before the text, such as a 14px <Icon> or a fixed string like "https://".
- `search?`: boolean — Makes it a search field: a 16px search icon before the text and type="search".
- `suffix?`: ReactNode | { count: true; } — Content after the text: a 14px or 16px <Icon> (for example a chevron on a dropdown f…
- `action?`: { label: string; onClick?: (() => void) | undefined; } — A divided action on the right edge (Figma "With CTA"), for example "Copy".
- `fullWidth?`: boolean — Stretch to the width of the parent instead of 320px.
- `tags?`: string[] — Turns the field into a tags input.
- `defaultTags?`: string[] — Initial tags when the field manages them itself.
- `onTagsChange?`: function
- `country?`: Country — Turns the field into a phone input, with a country button before the number.
- `onCountryClick?`: function
- `countries?`: ListedCountry[] — A list of countries.
- `countryId?`: string — Which country in countries starts ticked in the list, for example "US".
- `onCountryChange?`: function
- `countryListOpen?`: boolean — Shows the country list open.

```tsx
<Input label="Email" placeholder="name@company.com" prefix={<Icon name="mailbox" size={14} />} helperText="We never share it" />
```

### ListAvatar
`import { ListAvatar } from './components/List'` — The Avatar component in the 24px left-element area (18px when small).
- `status?`: "online" | "offline" (default online) — With showStatus: a green dot when online (default), a grey dot when offline.
- `size?`: "default" | "small" (default default) — Default is 24px, small is 18px.
- `initial`: string — The letter shown in the circle.
- `showStatus?`: boolean — Shows the status dot at the bottom right.

### ListCheck
`import { ListCheck } from './components/List'` — Visual-only checkbox, for rows that are already a button.
- `selected?`: boolean

### ListIcon
`import { ListIcon } from './components/List'` — 14px icon centered in the 24px element area.
- `name`: "open" | "account" | "add" | "addtosm" | "adminsettings" | "ai" | "aiagent" | "aisummarizer" | "alerttriangle…
- `background?`: boolean

### ListItem
`import { ListItem } from './components/List'`
- `label`: ReactNode — The row text.
- `description?`: ReactNode — Smaller grey text under the label (Figma "Lists_Description").
- `leading?`: ReactNode — Left element: ListAvatar, ListIcon, ListRadio or ListCheck.
- `rightElement?`: boolean — Shows the right element: a blue check on a label row, or a blue chevron on a row wit…
- `trailing?`: "chevron" | "check" — Which mark the right element draws: a chevron (default on a row with a description)…
- `compact?`: boolean — The tighter size used inside dropdown menus (32px, or 28px for text only).

```tsx
<ListItem label="Billing" description="billing@acme.com" leading={<ListIcon name="mailbox" />} onClick={open} />
```

### ListRadio
`import { ListRadio } from './components/List'` — Visual-only radio, for rows that are already a button.
- `selected?`: boolean

### Loader
`import { Loader } from './components/Loader'` — A 48px spinner that shows something is loading.
- `label?`: string (default Loading) — What a screen reader says.

```tsx
<Loader />
```

### Modal
`import { Modal } from './components/Modal'`
- `title`: string — The heading.
- `layout?`: "standard" | "centered" (default standard) — Standard has a header bar, the content and the actions on the right.
- `width?`: 400 | 500 (default 400) — Width in px.
- `icon?`: ReactNode — Standard: a small icon name before the title, such as delete for a destructive modal.
- `onClose?`: function
- `actions?`: ReactNode — The buttons, for example Cancel and a primary Button.

```tsx
<Modal title="Delete inbox?" onClose={close} actions={<><Button variant="secondary">Cancel</Button><Button variant="error">Delete</Button></>}>This cannot be undone.</Modal>
```

### ModalNote
`import { ModalNote } from './components/Modal'` — A grey note inside a modal, for extra information.
(no props)

### ModalText
`import { ModalText } from './components/Modal'` — Body text for a modal: 14px, subtle.
(no props)

### Popover
`import { Popover } from './components/Popover'` — Places any panel under a trigger.
- `open`: boolean — Whether the popover is showing.
- `onClose`: function
- `anchorRef`: RefObject<HTMLElement | null> — The element the popover opens under, usually the button that opened it.
- `placement?`: "bottom-start" | "bottom-end" (default bottom-start) — Which edge of the anchor the popover lines up with.
- `gap?`: number (default 4) — The space in px between the anchor and the popover.
- `matchAnchorWidth?`: boolean — Stretch to at least the width of the anchor.

```tsx
<Popover open={open} onClose={() => setOpen(false)} anchorRef={ref}><Dropdown options={options} /></Popover>   // ref points at the button that opens it
```

### Radio
`import { Radio } from './components/Radio'` — one option inside a RadioGroup (below).
- `value`: string — what this option stands for
- `label?`: ReactNode
- `disabled?`: boolean

### RadioGroup
`import { RadioGroup } from './components/Radio'`
- `label?`: ReactNode — Label above the options.
- `required?`: boolean — Shows the red asterisk after the label.
- `value?`: string — Selected value when you control it yourself.
- `defaultValue?`: string — Initially selected value when the group manages itself.
- `onChange?`: function
- `disabled?`: boolean
- `name?`: string

```tsx
<RadioGroup label="Priority" name="p" value={p} onChange={setP}><Radio value="low" label="Low" /><Radio value="high" label="High" /></RadioGroup>
```

### SlaAlert
`import { SlaAlert } from './components/Sla'`
- `onClick?`: () => void
- `kind`: "frt" | "rt" — Which time the alert is about: first response time (frt) or resolution time (rt).
- `status`: "done" | "upcoming" | "due" | "overdue" — Where that time stands.
- `time`: string — The time shown in the text, for example "6:00 PM tomorrow".

### SlaPill
`import { SlaPill } from './components/Sla'`
- `kind`: "frt" | "rt" — Which time the pill is about: first response time (frt) or resolution time (rt).
- `status`: "done" | "upcoming" | "due" | "overdue" — Where that time stands.

```tsx
<SlaPill kind="frt" status="due" />
```

### Switch
`import { Switch } from './components/Switch'`
- `size?`: "regular" | "large" (default regular) — Regular is 32x16, large is 40x20.
- `label?`: ReactNode — Optional text next to the switch.

```tsx
<Switch checked={on} onChange={(e) => setOn(e.target.checked)} label="Enabled" />
```

### Table
`import { Table } from './components/Table'`
- `columns`: TableColumn<Row>[]
- `rows`: Row[]
- `getRowId?`: function — A stable id for each row.
- `rowActions?`: TableAction<Row>[] — Icon buttons (1 to 4) that appear at the right end of a row on hover or keyboard foc…
- `onRowClick?`: function

```tsx
<Table aria-label="Inboxes" columns={[{ key: 'name', header: 'Name' }, { key: 'email', header: 'Email' }]} rows={rows} getRowId={(r) => r.id} rowActions={[{ icon: 'delete', label: 'Delete' }]} />
```

### Tabs
`import { Tabs } from './components/Tabs'` — The row of tabs only.
- `tabs`: TabItem[]
- `value`: string — The selected tab's value.
- `onChange`: function
- `variant?`: "outlined" | "filled" (default outlined) — Outlined = underline tabs.

```tsx
<Tabs tabs={[{ value: 'all', label: 'All' }, { value: 'mine', label: 'Mine' }]} value={tab} onChange={setTab} />
```

### Tag
`import { Tag } from './components/Tag'`
- `color?`: "default" | "yellow" | "lightBlue" | "green" | "purple" | "orange" | "red" | "violet" — The colour.
- `iconLeft?`: ReactNode — 14px icon before the text, such as <Icon name="tag" size={14} />.
- `iconRight?`: ReactNode — 14px icon after the text.
- `onRemove?`: function
- `removeLabel?`: string (default Remove) — Accessible name for the close button.

```tsx
<Tag color="violet" onRemove={remove}>Finance</Tag>
```

### Textarea
`import { Textarea } from './components/Textarea'`
- `label?`: ReactNode — Label shown above the field.
- `helperText?`: ReactNode — Small text below the field.
- `error?`: boolean — Shows the error border and red helper text.
- `showCount?`: boolean — Shows a live "0/500" counter.
- `fullWidth?`: boolean — Stretch to the width of the parent instead of 320px.
- `tags?`: string[] — Turns the field into a tags field.
- `defaultTags?`: string[] — Initial tags when the field manages them itself.
- `onTagsChange?`: function

```tsx
<Textarea label="Note" placeholder="Write a note" maxLength={200} showCount />
```

### Tooltip
`import { Tooltip } from './components/Tooltip'`
- `content`: ReactNode — The text shown in the bubble.
- `placement?`: "top" | "bottom" | "left" | "right" (default top) — Which side of the element the bubble appears on.
- `open?`: boolean — Force it open or closed.
- `portal?`: boolean — Draws the bubble on the page itself instead of inside the element's container, so a…
- `boundary?`: string — With portal: a CSS selector for a parent, for example .hot-main-nav.
- `gap?`: number (default 6) — With portal: the space in px between the bubble and the edge it sits next to.

```tsx
<Tooltip content="Delete"><Button iconOnly variant="ghost" aria-label="Delete"><Icon name="delete" /></Button></Tooltip>
```

### TooltipBubble
`import { TooltipBubble } from './components/Tooltip'` — Just the dark bubble, with no positioning.
(no props)

### UnitedStatesFlag
`import { UnitedStatesFlag } from './components/Input'` — The United States flag, a 16px circle.
(no props)

## Patterns

Bigger pieces of a page. Import from `patterns/<Name>`.

### ActivityNotes
`import { ActivityNotes } from './patterns/RightPanel'` — The content of the "Activity & Notes" section: an "Add a note" box, a "Show only not…
- `days`: ActivityDay[] — The days of activity, newest first.
- `onAddNote?`: function
- `onlyNotes?`: boolean — Whether "Show only notes" is ticked.
- `onOnlyNotesChange?`: function

### AdminSidebar
`import { AdminSidebar } from './patterns/AdminSidebar'`
- `title?`: string (default Admin Panel) — The heading at the top.
- `sections`: AdminSidebarSection[]
- `value?`: string — The id of the selected item.
- `onChange?`: function

### AssigneeField
`import { AssigneeField } from './patterns/RightPanel'` — The Assignee field: pressing the name opens a searchable list of people (with a "Non…
- `value?`: string — The value of the person who owns the conversation, or none.
- `onChange?`: function
- `people?`: Assignee[]

```tsx
<AssigneeField value={who} onChange={setWho} />   // inside <RightPanelTop>, next to <StatusField />
```

### ConversationsSidebar
`import { ConversationsSidebar } from './patterns/ConversationsSidebar'`
- `title?`: string (default Conversations) — The heading at the top.
- `sections`: ConversationsSidebarSection[]
- `value?`: string — The id of the selected item or view.
- `onChange?`: function
- `onSearch?`: function
- `onCreate?`: function
- `onCreateMenu?`: function
- `onExpandedChange?`: function

### EmptyState
`import { EmptyState } from './patterns/EmptyState'`
- `icon`: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor… — An icon name from the empty-state icon set (for example signature or search), or you…
- `title`: string — The heading, for example "No signatures yet".
- `description`: string — One or two lines under the heading that say what to do next.
- `action?`: ReactNode — The main action, when there is one, for example a primary Button.

```tsx
<EmptyState icon="search" title="No inboxes yet" description="Create one to get started." action={<Button size="sm">Create</Button>} />
```

### MainNav
`import { MainNav } from './patterns/MainNav'`
- `items`: MainNavItem[] — The icons under the logo.
- `value?`: string — The id of the selected item.
- `onChange?`: function
- `footerItems?`: MainNavItem[] (default []) — The small icons above the avatar, such as help and chat.
- `onFooterClick?`: function
- `user?`: { initial: string; name?: string | undefined; showStatus?:… — The person's letter, shown at the bottom.
- `userMenu?`: Omit<UserMenuProps, "onSelect"> — Fills the menu that opens from the avatar.
- `helpMenu?`: boolean (default true) — Opens the Help Center menu when the footer item with the id help is clicked.
- `onMenuSelect?`: function

### PageLayout
`import { PageLayout } from './patterns/PageLayout'`
- `variant?`: "home" | "admin" (default home) — Which page anatomy to use.
- `nav`: ReactNode — The Main nav.
- `sidebar`: ReactNode — The Conversations sidebar or the Admin sidebar.
- `subNav?`: ReactNode — A second 240px column next to the sidebar, used by the admin variant.
- `rightPanel?`: ReactNode — The right panel.

```tsx
<PageLayout variant="home" nav={<MainNav ... />} sidebar={<ConversationsSidebar ... />} rightPanel={<RightPanel ... />}>{content}</PageLayout>
```

### RightPanel
`import { RightPanel } from './patterns/RightPanel'` — The panel on the right of a page.
- `tabs?`: RightPanelTab[] — The tab bar at the very top.
- `activeTab?`: string — The selected tab's id, when you control it yourself.
- `onTabChange?`: function
- `onReorder?`: function
- `customizeWidgets?`: boolean — Shows the "Customize widgets" button after the last section.
- `visibleIds?`: string[] — The ids of the sections that are shown, when you control it yourself.
- `onVisibleChange?`: function

### RightPanelSection
`import { RightPanelSection } from './patterns/RightPanel'`
- `title`: string — The section name, for example "Contact".
- `icon`: "open" | "account" | "add" | "addtosm" | "adminsettings" | "ai" | "aiagent" | "aisummarizer" | "alerttriangle… — The icon before the name.
- `defaultExpanded?`: boolean (default false) — Starts open when set.
- `expanded?`: boolean — Open or closed, when you control it yourself.
- `onExpandedChange?`: function

### RightPanelTop
`import { RightPanelTop } from './patterns/RightPanel'`
- `title`: string — The heading, for example the inbox name.

### StatusField
`import { StatusField } from './patterns/RightPanel'` — The Status field: pressing it opens Open, Pending and Closed, each with its status i…
- `value?`: "open" | "pending" | "closed"
- `onChange?`: function

### SubNav
`import { SubNav } from './patterns/SubNav'`
- `title`: string — The heading at the top, for example the name of the inbox being set up.
- `subtitle?`: string — The small line under the heading, for example the inbox's email address.
- `items`: SubNavItem[]
- `value?`: string — The id of the selected item.
- `onChange?`: function
- `onBack?`: function
- `onTitleClick?`: function
- `switcher?`: "box" | "plain" (default box) — How the arrow beside the title looks: a boxed button (default) or a bare arrow.
- `switchOptions?`: { value: string; label: string; description?: string | unde… — Inboxes to switch between.
- `switchValue?`: string — The value of the inbox that is open now.
- `onSwitch?`: function

```tsx
<SubNav title="Shared Inboxes" items={[{ id: 'email', label: 'Email Inboxes', icon: 'mailbox' }]} value={id} onChange={setId} />
```

## Icons

`<Icon name="mailbox" size={16} />` (`import { Icon } from './icons'`). 196 icons: the names are in `ICONS.md` (read it only when you need to pick one). Sizes 14 (marks), 16 (buttons and rows), 24 (rare).

## Colour tokens

Use them as `var(--<family><Role><Variant>)`, for example `var(--slateTextBody)`, `var(--primarySurfaceDefault)`, `var(--slateBorderLight)`. Roles: Text, Surface, Border, Icons. Families and the variants that exist:

- slate — Text: Title/Body/Subtle/Caption/Disabled; Surface: White/Subtle/Subtle100Hover/Slate150/Subtle200/Subtle300/Default/Dark500/Dark600/Darkest/Disabled; Border: Default/Dark/Light/Mild; Icons: Active/Subtle/Disabled
- primary — Text: Label; Surface: Subtle/Lighter/Default/MildDark/Dark; Border: Subtle/Lighter/Default/Dark
- primaryPurple — Text: Label; Surface: Subtle/Lighter/Default/Dark; Border: Subtle/Lighter/Default/Dark
- success — Text: Title/Body/Subtle/Caption/Disabled; Surface: Default/Subtle/Dark; Border: Default/Dark/Light
- warning — Text: Title/Body/Subtle/Caption/Disabled; Surface: Default/Subtle/Dark; Border: Default/Dark/Light
- error — Text: Title/Body/Subtle/Caption/Disabled; Surface: Default/Subtle/Dark/Disabled; Border: Default/Dark/Light
- blue — Text: Title/Body/Subtle/Caption/Disabled; Surface: Default/Subtle/Dark/Disabled; Border: Default/Dark/Light
- indigo — Text: Title/Body/Subtle/Caption/Disabled; Surface: Default/Subtle/Dark/Disabled; Border: Default/Dark/Light
- pastelViolet, pastelLightBlue, pastelRed, pastelPurple, pastelOrange, pastelYellow, pastelGreen — the accent colours; each has Surface, Text and Border in the same variants as above

Fonts: Hanken Grotesk 400 and 500, already set on the page. Text sizes in use: 12/18, 14/20, 16/24 (size/line-height).

## Page recipes

**Home page** (Main nav, Conversations sidebar, content, right panel):

```tsx
import { PageLayout } from './patterns/PageLayout'
import { MainNav } from './patterns/MainNav'
import { ConversationsSidebar } from './patterns/ConversationsSidebar'
import { RightPanel, RightPanelTop } from './patterns/RightPanel'
import { navSampleItems, navSampleFooterItems, navSampleUserMenu } from './patterns/MainNav/sampleData'
import { sampleSections } from './patterns/ConversationsSidebar/sampleData'

<PageLayout
  variant="home"
  nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="conversations" user={{ initial: 'A', name: 'Alex' }} userMenu={navSampleUserMenu} />}
  sidebar={<ConversationsSidebar sections={sampleSections(true, ['chat'])} value="chat-unassigned" />}
  rightPanel={<RightPanel aria-label="Details" tabs={[{ id: 'inbox', label: 'Shared Inbox', icon: 'sminbox' }]}><RightPanelTop title="Inbox name"><AssigneeField /><StatusField /></RightPanelTop></RightPanel>}
>
  {/* the page content */}
</PageLayout>
```

**Admin page** (Main nav, Admin sidebar, Sub-nav, content): a ready-made one is `src/pages/SharedInboxes` (`<SharedInboxesPage channel="email" />`); build a new one the same way:

```tsx
<PageLayout variant="admin" nav={<MainNav ... value="admin" />} sidebar={<AdminSidebar sections={adminSampleSections} value="shared-inbox" />} subNav={<SubNav title="…" items={items} value={id} onChange={setId} />}>
  {/* the page content */}
</PageLayout>
```

The `sample…` data files only fill the navigation with example entries; replace them with your own items.
