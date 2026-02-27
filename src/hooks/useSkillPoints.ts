import { useMemo } from 'react'
import type { Characteristics } from '@/types/character'
import type { Occupation } from '@/types/occupation'

/**
 * Calculate total occupation skill points from the occupation formula.
 * Single stat formula: stat × multiplier
 * Two stat formula: stat1 × multiplier + stat2 × multiplier
 */
export function calculateOccupationPoints(
  occupation: Occupation,
  characteristics: Partial<Characteristics>
): number {
  const { characteristics: formulaStats, multiplier } = occupation.skill_formula
  let total = 0

  for (const stat of formulaStats) {
    const value = characteristics[stat] ?? 0
    total += value * multiplier
  }

  return total
}

/**
 * Calculate personal interest skill points: INT × 2
 */
export function calculatePersonalPoints(int: number): number {
  return int * 2
}

interface UseSkillPointsReturn {
  totalOccupationPoints: number
  usedOccupationPoints: number
  remainingOccupationPoints: number
  totalPersonalPoints: number
  usedPersonalPoints: number
  remainingPersonalPoints: number
}

export function useSkillPoints(
  occupation: Occupation | null,
  characteristics: Partial<Characteristics>,
  occupationSkillPoints: Record<string, number>,
  personalSkillPoints: Record<string, number>
): UseSkillPointsReturn {
  return useMemo(() => {
    const totalOccupationPoints = occupation
      ? calculateOccupationPoints(occupation, characteristics)
      : 0
    const usedOccupationPoints = Object.values(occupationSkillPoints).reduce((s, v) => s + v, 0)

    const int = characteristics.INT ?? 0
    const totalPersonalPoints = calculatePersonalPoints(int)
    const usedPersonalPoints = Object.values(personalSkillPoints).reduce((s, v) => s + v, 0)

    return {
      totalOccupationPoints,
      usedOccupationPoints,
      remainingOccupationPoints: totalOccupationPoints - usedOccupationPoints,
      totalPersonalPoints,
      usedPersonalPoints,
      remainingPersonalPoints: totalPersonalPoints - usedPersonalPoints,
    }
  }, [occupation, characteristics, occupationSkillPoints, personalSkillPoints])
}
