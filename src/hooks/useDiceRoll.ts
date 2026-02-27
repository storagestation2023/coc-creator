import { useState, useCallback, useRef } from 'react'
import { generateRollAnimation } from '@/lib/dice'

interface UseDiceRollReturn {
  displayValue: number | null
  isRolling: boolean
  roll: (finalValue: number) => void
}

export function useDiceRoll(animationDuration: number = 600): UseDiceRollReturn {
  const [displayValue, setDisplayValue] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const roll = useCallback(
    (finalValue: number) => {
      // Clear any pending animations
      timeoutRef.current.forEach(clearTimeout)
      timeoutRef.current = []

      setIsRolling(true)
      const frames = generateRollAnimation(finalValue, 8)
      const stepDelay = animationDuration / frames.length

      frames.forEach((value, i) => {
        const id = setTimeout(() => {
          setDisplayValue(value)
          if (i === frames.length - 1) {
            setIsRolling(false)
          }
        }, stepDelay * (i + 1))
        timeoutRef.current.push(id)
      })
    },
    [animationDuration]
  )

  return { displayValue, isRolling, roll }
}
