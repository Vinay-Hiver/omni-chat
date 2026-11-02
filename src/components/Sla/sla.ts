export type SlaKind = 'frt' | 'rt'
export type SlaStatus = 'upcoming' | 'due' | 'overdue' | 'done'

export const slaNames: Record<SlaKind, string> = { frt: 'First response time', rt: 'Resolution time' }

/** The words in front of the time: "First response" for FRT, "Resolution" for RT. */
const subject: Record<SlaKind, string> = { frt: 'First response', rt: 'Resolution' }

/** The alert's text, for example "First response due by 6:00 PM tomorrow" or "Resolution overdue since 6:00 PM yesterday". */
export function slaMessage(kind: SlaKind, status: SlaStatus, time: string) {
  if (status === 'overdue') return `${subject[kind]} overdue since ${time}`
  if (status === 'done') return `${subject[kind]} done at ${time}`
  return `${subject[kind]} due by ${time}`
}
