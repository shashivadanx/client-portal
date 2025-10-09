'use client'

import { Badge } from '@/components/ui/badge'

export type ClientPortalStatus =
  | 'approved'
  | 'in_progress'
  | 'rejected'
  | 'on_hold'

export function StatusBadge({ status }: { status: ClientPortalStatus }) {
  switch (status) {
    case 'approved':
      return <Badge>{status}</Badge> // default uses primary colors
    case 'rejected':
      return <Badge variant='destructive'>{status}</Badge>
    case 'on_hold':
      return <Badge variant='secondary'>{status}</Badge>
    case 'in_progress':
    default:
      return <Badge variant='outline'>{status}</Badge>
  }
}
