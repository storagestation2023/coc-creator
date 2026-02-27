/**
 * Generate a random invite code in format ABC-1234-XYZ
 */
export function generateInviteCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const digits = '0123456789'

  const part1 = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')
  const part2 = Array.from({ length: 4 }, () => digits[Math.floor(Math.random() * digits.length)]).join('')
  const part3 = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')

  return `${part1}-${part2}-${part3}`
}
