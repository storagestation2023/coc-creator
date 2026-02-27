import type { Characteristics } from '@/types/character'
import type { CharacteristicKey } from '@/types/common'
import { getAgeRange, isYoungCharacter, type AgeRange } from '@/data/ageRanges'

export interface AgeModificationResult {
  ageRange: AgeRange
  isYoung: boolean
  eduImprovementChecks: number
  physicalDeductionTotal: number
  /** Which stats can receive physical deductions (40+: STR/CON/DEX, 15-19: STR/SIZ) */
  deductibleStats: CharacteristicKey[]
  appReduction: number
  moveReduction: number
}

/**
 * Get the age modification rules for a given age
 */
export function getAgeModifications(age: number): AgeModificationResult | null {
  const ageRange = getAgeRange(age)
  if (!ageRange) return null

  const young = isYoungCharacter(age)

  return {
    ageRange,
    isYoung: young,
    eduImprovementChecks: ageRange.eduImprovementChecks,
    physicalDeductionTotal: ageRange.deductionPoints,
    deductibleStats: young ? ['STR', 'SIZ'] : ['STR', 'CON', 'DEX'],
    appReduction: ageRange.appReduction,
    moveReduction: ageRange.moveReduction,
  }
}

/**
 * Validate that the deduction distribution is valid:
 * - Total matches required deduction points
 * - All deductions are from allowed stats
 * - No stat goes below 1
 */
export function validateDeductions(
  characteristics: Characteristics,
  deductions: Partial<Record<CharacteristicKey, number>>,
  allowedStats: CharacteristicKey[],
  requiredTotal: number,
): { valid: boolean; error?: string } {
  const total = Object.values(deductions).reduce((sum, v) => sum + (v ?? 0), 0)

  if (total !== requiredTotal) {
    return { valid: false, error: `Musisz rozdzielić dokładnie ${requiredTotal} punktów odliczeń (aktualnie: ${total}).` }
  }

  for (const [key, amount] of Object.entries(deductions)) {
    const stat = key as CharacteristicKey
    if (!allowedStats.includes(stat)) {
      return { valid: false, error: `Nie można odejmować punktów od ${stat}.` }
    }
    if (amount && amount > 0 && characteristics[stat] - amount < 1) {
      return { valid: false, error: `${stat} nie może spaść poniżej 1.` }
    }
  }

  return { valid: true }
}

/**
 * Apply age modifiers to characteristics.
 * For young characters (15-19): EDU -5, deduct 5 from STR+SIZ.
 * For 40+: apply APP reduction and physical deductions.
 */
export function applyAgeModifiers(
  characteristics: Characteristics,
  age: number,
  deductions: Partial<Record<CharacteristicKey, number>>,
): Characteristics {
  const mods = getAgeModifications(age)
  if (!mods) return characteristics

  const result = { ...characteristics }

  // Apply physical stat deductions
  for (const [key, amount] of Object.entries(deductions)) {
    if (amount && amount > 0) {
      result[key as CharacteristicKey] = Math.max(1, result[key as CharacteristicKey] - amount)
    }
  }

  // Apply APP reduction (40+)
  if (mods.appReduction > 0) {
    result.APP = Math.max(1, result.APP - mods.appReduction)
  }

  // Young characters: EDU -5
  if (mods.isYoung) {
    result.EDU = Math.max(1, result.EDU - 5)
  }

  return result
}
