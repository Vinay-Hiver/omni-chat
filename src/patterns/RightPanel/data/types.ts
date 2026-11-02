import type { IconName } from '../../../icons/iconData'

/** The channels (inbox types) that have a right panel. More are added here as they are designed. */
export type ChannelId = 'chat' | 'slack' | 'whatsapp' | 'sms' | 'email'

/**
 * How a field's value is drawn and edited:
 * - text: plain text. longText: text that can run long (wraps or truncates).
 * - link: a blue link. datetime: a read-only date and time.
 * - dateInput: an empty date picker ("Select a date"). dropdown: a choice list ("Select an option").
 * - number: a plain number. countLink: a number in the blue link colour that opens a list (for example "Conversations 38").
 * - avatarText: a small round avatar with text beside it. assignee: the person who owns the conversation.
 * - status: the conversation status with its ring icon. tags: the tag chips and the "Add" chip.
 */
export type FieldKind = 'text' | 'longText' | 'link' | 'datetime' | 'dateInput' | 'dropdown' | 'number' | 'countLink' | 'avatarText' | 'assignee' | 'status' | 'tags'

/** One field: an icon, a label and a value. Fields are defined once here and used by any section that needs them. */
export type FieldDef = {
  id: string
  label: string
  /** The small icon before the label (14px). Chosen from the HOT icon set by meaning, because the Figma frames do not name them. */
  icon: IconName
  kind: FieldKind
  /** Whether the person can change the value in the panel. */
  editable: boolean
  /** What shows when the value is empty and the field is a picker, for example "Select a date". Other empty fields use the section's empty text. */
  placeholder?: string
}

export type FooterActionId = FooterActionDef['id']

/** The shape of a section's content. */
export type SectionType =
  | 'fields' // rows of fields
  | 'customFields' // rows of fields chosen by the workspace (not fixed), with a "View All" link
  | 'list' // a list of items, for example previous conversations
  | 'notes' // an "Add a note" box and an empty state
  | 'insights' // an AI summary card, followed by fields
  | 'activity' // notes and a timeline of events

/** One section the panel can show. Defined once; each channel says which ones it uses and in what order. */
export type SectionDef = {
  id: string
  title: string
  icon: IconName
  type: SectionType
  /** The fields, in order, for `fields`, `insights` and `customFields` sections. */
  fields?: string[]
  /** `list` sections: the text shown when there is nothing to list. */
  emptyListText?: string
  /** Shows a "View All" link under the content. */
  viewAll?: boolean
  /** Shows a "More" link under the content. */
  more?: boolean
}

/** A channel's use of a section: the shared definition, plus anything that differs for this channel. */
export type SectionRef = {
  section: string
  /** A different title for this channel, for example "Customer details" in Slack. */
  title?: string
  /** A different list of fields for this channel (replaces the section's own). */
  fields?: string[]
  /** Open when the panel first shows. */
  defaultExpanded: boolean
  /** What shows in an empty field for this section: "Empty" or a dash. */
  emptyValue: 'Empty' | '-'
}

/** The top section: the inbox name and the fields that are always visible. */
export type TopSectionDef = {
  /** The heading is the name of the inbox the conversation belongs to. */
  title: 'inboxName'
  fields: string[]
}

/**
 * An action at the bottom of the panel, after the last section. Today there is one: "Customize widgets".
 * It lets the person choose which sections the panel shows: it opens a list of the channel's sections with a checkbox each,
 * all ticked until the person unticks one. The panel itself still shows the sections in the person's own order.
 */
export type FooterActionDef = {
  id: 'customizeWidgets'
  label: string
  /** The 14px icon before the label. */
  icon: IconName
  /** It sits after the last section, whichever section that is. */
  placement: 'afterLastSection'
  /** What it opens. */
  opens: 'sectionVisibility'
  /** How it looks in Figma: a full-width, 32px tall button with a light fill, centred icon and label, inside 20px (top and bottom) and 12px (sides) of space. */
  look: { height: 32; radius: 6; paddingX: 12; paddingY: 6; gap: 8; containerPaddingX: 12; containerPaddingY: 20 }
}

/** A tab in the bar at the very top of the panel (an icon on its own; the label is its tooltip). */
export type TabDef = { id: string; label: string; icon: IconName }

export type ChannelDef = {
  id: ChannelId
  label: string
  /** The tab bar above everything else. Ids of `tabs`. The panel's content starts below it. */
  tabs: string[]
  top: TopSectionDef
  /** The sub-sections, in their default order. The person can reorder them. */
  sections: SectionRef[]
  /** The actions at the bottom of the panel, in order. Ids of `footerActions`. */
  footer: FooterActionId[]
}

/** Example values for each channel, taken from the Figma frames. Used by stories and tests, not by the real product. */
export type ChannelSample = {
  inboxName: string
  /** Field id to value. Fields not listed are empty. */
  values: Record<string, string | number>
  customFields?: { label: string; kind: FieldKind; value?: string; placeholder?: string }[]
  previousConversations?: { from: string; date: string; preview: string }[]
  insights?: { status: string; lines: string[] }
  activity?: { day: string; items: { text: string; time: string }[] }[]
}
