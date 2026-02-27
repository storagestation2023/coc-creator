/**
 * Dice rolling utilities for CoC 7e character creation
 */

/** Roll a single die with `sides` faces */
function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

/** Roll NdS: sum of `count` dice with `sides` faces */
function rollDice(count: number, sides: number): number {
  let total = 0
  for (let i = 0; i < count; i++) {
    total += rollDie(sides)
  }
  return total
}

/** 3D6 × 5 (for STR, CON, DEX, APP, POW) */
export function roll3d6x5(): number {
  return rollDice(3, 6) * 5
}

/** (2D6 + 6) × 5 (for SIZ, INT, EDU) */
export function roll2d6plus6x5(): number {
  return (rollDice(2, 6) + 6) * 5
}

/** Roll for a characteristic based on formula type */
export function rollCharacteristic(formula: '3d6x5' | '2d6+6x5'): number {
  return formula === '3d6x5' ? roll3d6x5() : roll2d6plus6x5()
}

/** 3D6 × 5 for Luck */
export function rollLuck(): number {
  return roll3d6x5()
}

/** Roll Luck twice and take the better result (for young characters 15-19) */
export function rollLuckYoung(): number {
  return Math.max(rollLuck(), rollLuck())
}

/** 1D100 percentile roll */
export function rollPercentile(): number {
  return rollDie(100)
}

/** 1D10 roll (for backstory tables) */
export function roll1d10(): number {
  return rollDie(10)
}

/**
 * EDU improvement check: roll 1D100.
 * If result > current EDU, add 1D10 to EDU (max 99).
 */
export function eduImprovementRoll(currentEdu: number): { roll: number; improved: boolean; newEdu: number } {
  const roll = rollPercentile()
  if (roll > currentEdu) {
    const improvement = roll1d10()
    const newEdu = Math.min(99, currentEdu + improvement)
    return { roll, improved: true, newEdu }
  }
  return { roll, improved: false, newEdu: currentEdu }
}

/**
 * Simulate dice roll animation values.
 * Returns an array of intermediate values before the final result.
 */
export function generateRollAnimation(finalValue: number, steps: number = 8): number[] {
  const values: number[] = []
  for (let i = 0; i < steps; i++) {
    values.push(Math.floor(Math.random() * 90) + 5)
  }
  values.push(finalValue)
  return values
}
