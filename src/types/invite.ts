import type { Era, CreationMethod } from './common'

export interface InviteCode {
  id: string
  code: string
  method: CreationMethod
  methods: CreationMethod[]
  era: Era
  max_tries: number
  times_used: number
  is_active: boolean
  perks: string[]
  max_skill_value: number
  created_at: string
}
