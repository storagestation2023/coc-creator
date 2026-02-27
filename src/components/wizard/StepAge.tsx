import { useState, useCallback } from 'react'
import { Dices } from 'lucide-react'
import { useCharacterStore } from '@/stores/characterStore'
import { isYoungCharacter } from '@/data/ageRanges'
import { rollLuck, rollLuckYoung } from '@/lib/dice'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { NumberInput } from '@/components/ui/NumberInput'

export function StepAge() {
  const store = useCharacterStore()

  const [age, setAge] = useState<number>(store.age ?? 25)
  const [luck, setLuck] = useState<number | null>(store.luck)
  const [luckRolled, setLuckRolled] = useState(store.luck !== null)

  const young = isYoungCharacter(age)

  const handleRollLuck = useCallback(() => {
    const value = young ? rollLuckYoung() : rollLuck()
    setLuck(value)
    setLuckRolled(true)
  }, [young])

  // When age changes, reset luck if it was already rolled (young/adult may differ)
  const handleAgeChange = (newAge: number) => {
    setAge(newAge)
    if (luckRolled) {
      // Re-roll luck when age category changes between young and non-young
      const wasYoung = isYoungCharacter(age)
      const isNowYoung = isYoungCharacter(newAge)
      if (wasYoung !== isNowYoung) {
        setLuck(null)
        setLuckRolled(false)
      }
    }
  }

  const method = store.method!
  const canContinue = age >= 15 && age <= 89 && luck !== null

  const handleNext = () => {
    store.setAge(age)
    store.setLuck(luck!)
    store.nextStep()
  }

  return (
    <Card title="Wiek i Szczęście">
      {/* Age input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Wiek badacza (15–89)</label>
        <p className="text-xs text-coc-text-muted mb-2">
          Wiek wpływa na modyfikatory cech w następnym kroku.
        </p>
        <NumberInput
          value={age}
          onChange={handleAgeChange}
          min={15}
          max={89}
        />
        {young && (
          <p className="text-xs text-coc-accent-light mt-1">
            Młody Badacz (15–19): Szczęście losowane z dwóch rzutów (lepszy wynik).
          </p>
        )}
      </div>

      {/* Luck */}
      <div className="border-t border-coc-border pt-4 mb-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm font-medium">Szczęście</div>
            <div className="text-xs text-coc-text-muted">
              3K6×5{young ? ' (2 rzuty, lepszy)' : ''}
            </div>
          </div>
          {method === 'dice' ? (
            <>
              <div className={`text-2xl font-bold font-mono px-4 py-2 rounded-lg border ${
                luck ? 'border-coc-accent/30 bg-coc-accent/10' : 'border-coc-border bg-coc-surface-light'
              }`}>
                {luck ?? '—'}
              </div>
              {!luckRolled && (
                <Button size="sm" onClick={handleRollLuck}>
                  <Dices className="w-4 h-4" />
                  Rzuć
                </Button>
              )}
            </>
          ) : (
            <NumberInput
              value={luck ?? 0}
              onChange={(v) => { setLuck(v); setLuckRolled(true) }}
              min={1}
              max={99}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={() => store.prevStep()}>Wstecz</Button>
        <Button onClick={handleNext} disabled={!canContinue}>Dalej</Button>
      </div>
    </Card>
  )
}
