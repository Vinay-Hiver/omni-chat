import { channels, channelIds } from './channels'
import { customFieldKinds, fields, footerActions, tabs } from './fields'
import { sampleAssignees, statusOptions } from './options'
import { samples } from './samples'
import { sections } from './sections'
import type { ChannelDef, ChannelId, FieldDef, FooterActionDef, SectionDef, SectionRef, TabDef } from './types'

export { channels, channelIds, customFieldKinds, fields, footerActions, sampleAssignees, samples, sections, statusOptions, tabs }
export type { Assignee, StatusOption } from './options'
export type * from './types'

/** A section as one channel shows it: the shared section with this channel's title and fields applied. */
export type ResolvedSection = Omit<SectionDef, 'fields' | 'title'> & {
  title: string
  fields: FieldDef[]
  defaultExpanded: boolean
  emptyValue: SectionRef['emptyValue']
}

export type ResolvedChannel = Omit<ChannelDef, 'tabs' | 'top' | 'sections' | 'footer'> & {
  /** The tabs in the bar at the top. */
  tabs: TabDef[]
  top: { title: 'inboxName'; fields: FieldDef[] }
  sections: ResolvedSection[]
  /** The actions at the bottom, after the last section (for example "Customize widgets"). */
  footer: FooterActionDef[]
  /** The ids of the sections the panel shows at first. All of them, until the person unticks one in "Customize widgets". */
  visibleSectionIds: string[]
}

const field = (id: string): FieldDef => {
  const f = fields[id]
  if (!f) throw new Error(`Right panel data: unknown field "${id}"`)
  return f
}

/** Looks up everything about one channel's right panel, with every id replaced by its definition. */
export function getChannel(id: ChannelId): ResolvedChannel {
  const channel = channels[id]
  const resolvedSections = channel.sections.map((ref) => {
    const section = sections[ref.section]
    if (!section) throw new Error(`Right panel data: channel "${id}" uses unknown section "${ref.section}"`)
    return {
      ...section,
      title: ref.title ?? section.title,
      fields: (ref.fields ?? section.fields ?? []).map(field),
      defaultExpanded: ref.defaultExpanded,
      emptyValue: ref.emptyValue,
    }
  })
  return {
    ...channel,
    footer: channel.footer.map((fid) => {
      const action = footerActions[fid]
      if (!action) throw new Error(`Right panel data: channel "${id}" uses unknown footer action "${fid}"`)
      return action
    }),
    tabs: channel.tabs.map((tid) => {
      const tab = tabs[tid]
      if (!tab) throw new Error(`Right panel data: channel "${id}" uses unknown tab "${tid}"`)
      return tab
    }),
    sections: resolvedSections,
    visibleSectionIds: resolvedSections.map((s) => s.id),
    top: { title: channel.top.title, fields: channel.top.fields.map(field) },
  }
}

/** Checks that every reference in the data points at something that exists. Returns a list of problems (empty when all is well). */
export function validate(): string[] {
  const problems: string[] = []
  for (const id of channelIds) {
    try {
      getChannel(id)
    } catch (e) {
      problems.push((e as Error).message)
    }
    const sample = samples[id]
    if (!sample) problems.push(`No sample content for channel "${id}"`)
    else for (const key of Object.keys(sample.values)) if (!fields[key]) problems.push(`Sample for "${id}" has a value for unknown field "${key}"`)
  }
  for (const [key, section] of Object.entries(sections)) {
    if (key !== section.id) problems.push(`Section key "${key}" does not match its id "${section.id}"`)
    for (const f of section.fields ?? []) if (!fields[f]) problems.push(`Section "${key}" uses unknown field "${f}"`)
  }
  for (const [key, f] of Object.entries(fields)) if (key !== f.id) problems.push(`Field key "${key}" does not match its id "${f.id}"`)
  return problems
}
