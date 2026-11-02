import { getSubNav } from './data'

/** The Email sub-nav, used as the example by the Sub-nav and Page layout stories. The lists for every channel are in `data.ts`. */
const email = getSubNav('email')
export const subNavSampleItems = email.items
export const subNavSampleIds = subNavSampleItems.map((i) => i.id)
export const subNavSampleHeader = { title: email.label, subtitle: 'hariniosm01@hiverhq.co.in' }

/** Two example inboxes for the switch menu (the heading's arrow). */
export const subNavSwitchSample = [
  { value: 'a', label: 'Hariniosm01', description: 'hariniosm01@hiverhq.co.in' },
  { value: 'b', label: 'otherprovider.sm02', description: 'otherprovider.sm02@forwardingaccount.hiverhq.co.in' },
]
