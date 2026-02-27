import { useState, useCallback } from 'react'
import { Dices, Trash2, Loader2 } from 'lucide-react'
import { useCharacterStore } from '@/stores/characterStore'
import { CHARACTERISTICS, CHARACTERISTIC_MAP, POINT_BUY_TOTAL, POINT_BUY_MIN, POINT_BUY_MAX } from '@/data/characteristics'
import { rollCharacteristic, rollLuck, rollLuckYoung } from '@/lib/dice'
import { isYoungCharacter } from '@/data/ageRanges'
import { supabase } from '@/lib/supabase'
import type { Characteristics } from '@/types/character'
import type { CharacteristicKey } from '@/types/common'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { NumberInput } from '@/components/ui/NumberInput'

export function StepCharacteristics() {
  const store = useCharacterStore()
  const method = store.method!
  const age = store.age ?? 25
  const isLocked = store.characteristicsLocked

  const [chars, setChars] = useState<Partial<Characteristics>>(store.characteristics)
  const [luck, setLuck] = useState<number | null>(store.luck)
  const [rolled, setRolled] = useState(Object.keys(store.characteristics).length > 0)
  const [abandoning, setAbandoning] = useState(false)

  const remainingTries = store.maxTries - store.timesUsed - 1
  const canAbandon = remainingTries > 0

  const setStat = useCallback((key: CharacteristicKey, value: number) => {
    if (isLocked) return
    setChars((prev) => ({ ...prev, [key]: value }))
  }, [isLocked])

  const rollAll = useCallback(() => {
    if (isLocked) return
    const newChars: Partial<Characteristics> = {}
    for (const c of CHARACTERISTICS) {
      newChars[c.key] = rollCharacteristic(c.rollFormula)
    }
    setChars(newChars)
    setLuck(isYoungCharacter(age) ? rollLuckYoung() : rollLuck())
    setRolled(true)
  }, [age, isLocked])

  const handleAbandon = async () => {
    if (!canAbandon || !store.inviteCodeId) return
    setAbandoning(true)
    try {
      await supabase.rpc('increment_times_used', { code_id: store.inviteCodeId })
      store.abandonCharacter()
    } catch {
      setAbandoning(false)
    }
  }

  const allFilled = CHARACTERISTICS.every((c) => {
    const v = chars[c.key]
    return v !== undefined && v > 0
  }) && luck !== null

  const pointBuyTotal = CHARACTERISTICS.reduce((sum, c) => sum + (chars[c.key] ?? 0), 0)
  const pointBuyValid = method !== 'point_buy' || pointBuyTotal === POINT_BUY_TOTAL

  const canContinue = allFilled && pointBuyValid

  const handleNext = () => {
    store.setCharacteristics(chars)
    store.setLuck(luck!)
    store.lockCharacteristics()
    store.nextStep()
  }

  return (
    <Card title="Cechy">
      {method === 'dice' && !isLocked && (
        <div className="mb-4 space-y-2">
          <p className="text-sm text-coc-text-muted">
            Rzuć kośćmi, aby wylosować wartości cech. SIŁ, KON, ZRĘ, WYG, MOC: 3K6×5. BUD, INT, WYK: (2K6+6)×5.
          </p>
          {!rolled && (
            <Button onClick={rollAll}>
              <Dices className="w-4 h-4" />
              Rzuć wszystkie
            </Button>
          )}
        </div>
      )}

      {method === 'dice' && isLocked && (
        <div className="mb-4">
          <p className="text-sm text-coc-accent-light">
            Cechy zostały zatwierdzone i nie mogą być zmienione.
          </p>
        </div>
      )}

      {method === 'point_buy' && (
        <div className="mb-4">
          <p className="text-sm text-coc-text-muted mb-1">
            Rozdziel {POINT_BUY_TOTAL} punktów pomiędzy cechy. Każda cecha: {POINT_BUY_MIN}–{POINT_BUY_MAX}.
          </p>
          <p className={`text-sm font-medium ${pointBuyTotal === POINT_BUY_TOTAL ? 'text-coc-accent-light' : pointBuyTotal > POINT_BUY_TOTAL ? 'text-coc-danger' : 'text-coc-warning'}`}>
            Wykorzystano: {pointBuyTotal} / {POINT_BUY_TOTAL}
          </p>
        </div>
      )}

      {method === 'direct' && (
        <p className="text-sm text-coc-text-muted mb-4">
          Wprowadź wartości cech (1–99).
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {CHARACTERISTICS.map((c) => {
          const def = CHARACTERISTIC_MAP[c.key]
          return (
            <div key={c.key} className="space-y-1">
              <div className="text-sm font-medium">
                {def.abbreviation}
                <span className="text-coc-text-muted ml-1 text-xs">({def.name})</span>
              </div>
              {method === 'dice' || isLocked ? (
                <div className={`text-2xl font-bold font-mono text-center py-2 rounded-lg border ${
                  chars[c.key] ? 'border-coc-accent/30 bg-coc-accent/10' : 'border-coc-border bg-coc-surface-light'
                }`}>
                  {chars[c.key] ?? '—'}
                </div>
              ) : (
                <NumberInput
                  value={chars[c.key] ?? (method === 'point_buy' ? POINT_BUY_MIN : 0)}
                  onChange={(v) => setStat(c.key, v)}
                  min={method === 'point_buy' ? POINT_BUY_MIN : 1}
                  max={method === 'point_buy' ? POINT_BUY_MAX : 99}
                />
              )}
              <div className="text-xs text-coc-text-muted text-center">
                {c.rollFormula === '3d6x5' ? '3K6×5' : '(2K6+6)×5'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Luck */}
      <div className="border-t border-coc-border pt-4 mb-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm font-medium">Szczęście</div>
            <div className="text-xs text-coc-text-muted">3K6×5{isYoungCharacter(age) ? ' (2 rzuty, lepszy)' : ''}</div>
          </div>
          {method === 'dice' || isLocked ? (
            <div className={`text-2xl font-bold font-mono px-4 py-2 rounded-lg border ${
              luck ? 'border-coc-accent/30 bg-coc-accent/10' : 'border-coc-border bg-coc-surface-light'
            }`}>
              {luck ?? '—'}
            </div>
          ) : (
            <NumberInput
              value={luck ?? 0}
              onChange={setLuck}
              min={1}
              max={99}
            />
          )}
        </div>
      </div>

      {/* Abandon character button */}
      {rolled && (
        <div className="border-t border-coc-border pt-4 mb-4">
          <Button
            variant="ghost"
            onClick={handleAbandon}
            disabled={!canAbandon || abandoning}
            className="text-coc-danger hover:text-coc-danger"
          >
            {abandoning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Porzuć postać i zrób nową
          </Button>
          <p className="text-xs text-coc-text-muted mt-1">
            {canAbandon
              ? `Zostało Ci ${remainingTries} ${remainingTries === 1 ? 'podejście' : remainingTries < 5 ? 'podejścia' : 'podejść'}`
              : 'Brak pozostałych podejść — to Twoja ostatnia szansa'}
          </p>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={() => store.prevStep()}>Wstecz</Button>
        <Button onClick={handleNext} disabled={!canContinue}>Dalej</Button>
      </div>
    </Card>
  )
}
