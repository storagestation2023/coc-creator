import { useState, useMemo } from 'react'
import { useCharacterStore } from '@/stores/characterStore'
import { getAgeModifications, validateDeductions } from '@/lib/ageModifiers'
import { eduImprovementRoll } from '@/lib/dice'
import type { Characteristics } from '@/types/character'
import type { CharacteristicKey } from '@/types/common'
import { CHARACTERISTIC_MAP } from '@/data/characteristics'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { NumberInput } from '@/components/ui/NumberInput'
import { Badge } from '@/components/ui/Badge'

export function StepAgeModifiers() {
  const store = useCharacterStore()
  const age = store.age ?? 25
  const chars = store.characteristics as Characteristics
  const mods = useMemo(() => getAgeModifications(age), [age])

  const [deductions, setDeductions] = useState<Partial<Record<CharacteristicKey, number>>>(store.ageDeductions)
  const [eduRolls, setEduRolls] = useState<{ roll: number; improved: boolean; newEdu: number }[]>([])
  const [currentEdu, setCurrentEdu] = useState(chars.EDU)

  if (!mods) {
    return (
      <Card title="Modyfikatory wiekowe">
        <p className="text-coc-text-muted">Nieprawidłowy wiek.</p>
        <Button variant="secondary" onClick={() => store.prevStep()}>Wstecz</Button>
      </Card>
    )
  }

  const noModifiers = mods.physicalDeductionTotal === 0 && mods.eduImprovementChecks <= 1 && !mods.isYoung

  const handleEduRoll = () => {
    const result = eduImprovementRoll(currentEdu)
    setEduRolls((prev) => [...prev, result])
    if (result.improved) {
      setCurrentEdu(result.newEdu)
    }
  }

  const setDeduction = (key: CharacteristicKey, value: number) => {
    setDeductions((prev) => ({ ...prev, [key]: value }))
  }

  const totalDeducted = Object.values(deductions).reduce((sum, v) => sum + (v ?? 0), 0)
  const deductionValid = mods.physicalDeductionTotal === 0 || totalDeducted === mods.physicalDeductionTotal
  const eduRollsDone = eduRolls.length >= mods.eduImprovementChecks

  const validation = mods.physicalDeductionTotal > 0
    ? validateDeductions(chars, deductions, mods.deductibleStats, mods.physicalDeductionTotal)
    : { valid: true }

  const canContinue = validation.valid && (mods.eduImprovementChecks === 0 || eduRollsDone)

  const handleNext = () => {
    // Save deductions and updated EDU
    store.setAgeDeductions(deductions)
    // Update characteristics with age modifications
    const updatedChars = { ...chars, EDU: Math.min(99, currentEdu) }
    // Apply deductions
    for (const [key, amount] of Object.entries(deductions)) {
      if (amount && amount > 0) {
        updatedChars[key as CharacteristicKey] = Math.max(1, updatedChars[key as CharacteristicKey] - amount)
      }
    }
    // Apply APP reduction
    if (mods.appReduction > 0) {
      updatedChars.APP = Math.max(1, updatedChars.APP - mods.appReduction)
    }
    // Young characters: EDU -5
    if (mods.isYoung) {
      updatedChars.EDU = Math.max(1, updatedChars.EDU - 5)
    }
    store.setCharacteristics(updatedChars)
    store.nextStep()
  }

  return (
    <Card title="Modyfikatory wiekowe">
      <div className="mb-4">
        <Badge>{mods.ageRange.label}</Badge>
        <p className="text-sm text-coc-text-muted mt-2">{mods.ageRange.deductionDescription}</p>
      </div>

      {noModifiers && !mods.isYoung && mods.eduImprovementChecks <= 1 && (
        <p className="text-sm text-coc-accent-light mb-4">
          Brak dodatkowych modyfikatorów wiekowych dla tego przedziału.
        </p>
      )}

      {/* EDU improvement rolls */}
      {mods.eduImprovementChecks > 0 && (
        <div className="border-t border-coc-border pt-4 mb-4">
          <h4 className="font-medium mb-2">
            Rzuty na poprawę Wykształcenia ({eduRolls.length} / {mods.eduImprovementChecks})
          </h4>
          <p className="text-xs text-coc-text-muted mb-3">
            Rzuć 1K100. Jeśli wynik &gt; aktualnego WYK ({currentEdu}), dodaj 1K10 do WYK.
          </p>

          {eduRolls.map((r, i) => (
            <div key={i} className={`text-sm mb-1 ${r.improved ? 'text-coc-accent-light' : 'text-coc-text-muted'}`}>
              Rzut {i + 1}: {r.roll} {r.improved ? `— Sukces! WYK: ${r.newEdu}` : '— Bez zmian'}
            </div>
          ))}

          {!eduRollsDone && (
            <Button size="sm" onClick={handleEduRoll} className="mt-2">
              Rzuć na poprawę WYK
            </Button>
          )}

          {eduRollsDone && (
            <p className="text-sm text-coc-accent-light mt-2">
              Aktualne WYK po poprawach: {currentEdu}
            </p>
          )}
        </div>
      )}

      {/* Physical deductions */}
      {mods.physicalDeductionTotal > 0 && (
        <div className="border-t border-coc-border pt-4 mb-4">
          <h4 className="font-medium mb-2">
            Odliczenia fizyczne — rozdziel {mods.physicalDeductionTotal} punktów
          </h4>
          <p className="text-xs text-coc-text-muted mb-3">
            Odejmij punkty od: {mods.deductibleStats.map((s) => CHARACTERISTIC_MAP[s].abbreviation).join(', ')}
          </p>

          <div className="grid grid-cols-3 gap-4">
            {mods.deductibleStats.map((key) => (
              <div key={key}>
                <div className="text-sm mb-1">
                  {CHARACTERISTIC_MAP[key].abbreviation} ({chars[key]})
                </div>
                <NumberInput
                  value={deductions[key] ?? 0}
                  onChange={(v) => setDeduction(key, v)}
                  min={0}
                  max={Math.min(mods.physicalDeductionTotal, chars[key] - 1)}
                />
              </div>
            ))}
          </div>

          <p className={`text-sm mt-2 ${deductionValid ? 'text-coc-accent-light' : 'text-coc-warning'}`}>
            Rozdzielono: {totalDeducted} / {mods.physicalDeductionTotal}
          </p>
          {!validation.valid && validation.error && (
            <p className="text-sm text-coc-danger">{validation.error}</p>
          )}
        </div>
      )}

      {/* APP reduction info */}
      {mods.appReduction > 0 && (
        <div className="border-t border-coc-border pt-4 mb-4">
          <p className="text-sm text-coc-text-muted">
            WYG zostanie obniżone o {mods.appReduction} (z {chars.APP} na {Math.max(1, chars.APP - mods.appReduction)}).
          </p>
        </div>
      )}

      {/* Move reduction info */}
      {mods.moveReduction > 0 && (
        <p className="text-sm text-coc-text-muted mb-4">
          Ruch zostanie obniżony o {mods.moveReduction}.
        </p>
      )}

      {/* Young character info */}
      {mods.isYoung && (
        <div className="border-t border-coc-border pt-4 mb-4">
          <p className="text-sm text-coc-text-muted">
            Młody Badacz: WYK zostanie obniżone o 5 (z {chars.EDU} na {Math.max(1, chars.EDU - 5)}).
            Szczęście zostało wylosowane z dwóch rzutów (lepszy wynik).
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
