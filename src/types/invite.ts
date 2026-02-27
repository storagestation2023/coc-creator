import type { Era, CreationMethod } from './common'

export interface InviteCode {
  id: string
  code: string
  method: CreationMethod
  era: Era
  max_tries: number
  times_used: number
  is_active: boolean
  created_at: string
}
