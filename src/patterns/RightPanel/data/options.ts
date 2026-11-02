import type { AvatarColor } from '../../../components/Avatar'
import type { IconName } from '../../../icons'

/** The choices in the Status field of the top section. The same three for every channel. */
export type StatusOption = { value: 'open' | 'pending' | 'closed'; label: string; icon: IconName }
export const statusOptions: StatusOption[] = [
  { value: 'open', label: 'Open', icon: 'openstatus' },
  { value: 'pending', label: 'Pending', icon: 'pendingstatus' },
  { value: 'closed', label: 'Closed', icon: 'closedstatus' },
]

/** A person who can own a conversation. Example people for the stories; a product would load them. */
export type Assignee = { value: string; label: string; color: AvatarColor; status?: 'online' | 'offline' }
export const sampleAssignees: Assignee[] = [
  { value: 'michael', label: 'Michael Scott (Me)', color: 'red' },
  { value: 'abhay', label: 'Abhay', color: 'yellow' },
  { value: 'adithya', label: 'Adithya S', color: 'grey' },
  { value: 'aishwarya', label: 'Aishwarya test sm 2', color: 'grey' },
  { value: 'akash-m', label: 'Akash M', color: 'yellow' },
  { value: 'akash-mishra', label: 'Akash Mishra', color: 'purple' },
  { value: 'akshaya', label: 'Akshaya s', color: 'grey' },
  { value: 'aman', label: 'Aman M', color: 'orange' },
  { value: 'amshika', label: 'Amshika', color: 'violet' },
  { value: 'ankita', label: 'Ankita T', color: 'purple' },
]
