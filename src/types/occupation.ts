import type { Era, CharacteristicKey } from './common'

export interface OccupationSkillFormula {
  characteristics: CharacteristicKey[]
  multiplier: number
}

export interface Occupation {
  id: string
  name: string
  description?: string
  category: string
  skill_formula: OccupationSkillFormula
  skills: string[]
  credit_rating: { min: number; max: number }
  era?: Era[]
  contacts?: string
  suggested_skills_note?: string
}
