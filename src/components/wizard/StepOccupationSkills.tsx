import { useState, useMemo } from 'react'
import { useCharacterStore } from '@/stores/characterStore'
import { OCCUPATIONS } from '@/data/occupations'
import { getSkillById, getSkillsForEra } from '@/data/skills'
import { useSkillPoints } from '@/hooks/useSkillPoints'
import type { Characteristics } from '@/types/character'
import type { Era } from '@/types/common'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SkillRow } from '@/components/shared/SkillRow'

function getBaseValue(skillId: string, chars: Partial<Characteristics>): number {
  const skill = getSkillById(skillId)
  if (!skill) return 0
  if (skill.base === 'half_dex') return Math.floor((chars.DEX ?? 0) / 2)
  if (skill.base === 'edu') return chars.EDU ?? 0
  return skill.base
}

export function StepOccupationSkills() {
  const store = useCharacterStore()
  const chars = store.characteristics as Characteristics
  const era = store.era as Era
  const occupation = useMemo(
    () => OCCUPATIONS.find((o) => o.id === store.occupationId) ?? null,
    [store.occupationId]
  )

  const [skillPoints, setSkillPoints] = useState<Record<string, number>>(store.occupationSkillPoints)

  // Handle 'any' skill slots: player can pick from all skills
  const [chosenAnySkills, setChosenAnySkills] = useState<Record<number, string>>(() => {
    // Reconstruct chosen 'any' skills from stored points
    const anySlots: Record<number, string> = {}
    if (occupation) {
      occupation.skills.forEach((sid, i) => {
        if (sid.startsWith('any') && store.occupationSkillPoints) {
          // Find a skill that has points but isn't in the fixed skill list
          const fixedSkills = occupation.skills.filter((s) => !s.startsWith('any'))
          for (const [skillId] of Object.entries(store.occupationSkillPoints)) {
            if (!fixedSkills.includes(skillId) && !Object.values(anySlots).includes(skillId)) {
              anySlots[i] = skillId
              break
            }
          }
        }
      })
    }
    return anySlots
  })

  const { totalOccupationPoints, usedOccupationPoints, remainingOccupationPoints } =
    useSkillPoints(occupation, chars, skillPoints, {})

  // Credit rating points (part of occupation points)
  const [creditRatingPoints, setCreditRatingPoints] = useState(skillPoints['majetnosc'] ?? 0)

  const availableSkills = useMemo(() => {
    return getSkillsForEra(era).filter((s) => s.id !== 'mity_cthulhu')
  }, [era])

  const academicSkills = useMemo(
    () => availableSkills.filter((s) => s.category === 'academic'),
    [availableSkills]
  )

  if (!occupation) {
    return <Card title="Umiejętności zawodowe"><p>Brak wybranego zawodu.</p></Card>
  }


  const handlePointChange = (skillId: string, delta: number) => {
    const current = skillPoints[skillId] ?? 0
    const newVal = Math.max(0, current + delta)
    const newPoints = { ...skillPoints, [skillId]: newVal }
    if (newVal === 0) delete newPoints[skillId]
    setSkillPoints(newPoints)

    if (skillId === 'majetnosc') setCreditRatingPoints(newVal)
  }

  const handleChooseAnySkill = (slotIndex: number, skillId: string) => {
    // Remove points from old choice
    const oldChoice = chosenAnySkills[slotIndex]
    if (oldChoice && skillPoints[oldChoice]) {
      const newPoints = { ...skillPoints }
      delete newPoints[oldChoice]
      setSkillPoints(newPoints)
    }
    setChosenAnySkills((prev) => ({ ...prev, [slotIndex]: skillId }))
  }

  // Credit rating validation
  const creditRatingBase = getBaseValue('majetnosc', chars)
  const creditRatingTotal = creditRatingBase + creditRatingPoints
  const creditRatingValid =
    creditRatingTotal >= occupation.credit_rating.min &&
    creditRatingTotal <= occupation.credit_rating.max

  const canContinue = remainingOccupationPoints === 0 && creditRatingValid

  const handleNext = () => {
    store.setOccupationSkillPoints(skillPoints)
    store.nextStep()
  }

  return (
    <Card title="Umiejętności zawodowe">
      <div className="flex flex-wrap gap-3 mb-4">
        <Badge variant={remainingOccupationPoints === 0 ? 'success' : 'warning'}>
          Punkty: {usedOccupationPoints} / {totalOccupationPoints}
          {remainingOccupationPoints > 0 && ` (pozostało: ${remainingOccupationPoints})`}
        </Badge>
        <Badge variant={creditRatingValid ? 'success' : 'danger'}>
          Majętność: {creditRatingTotal} (wymagane: {occupation.credit_rating.min}–{occupation.credit_rating.max})
        </Badge>
      </div>

      <div className="space-y-1 mb-4">
        {/* Fixed skills */}
        {occupation.skills.map((sid, i) => {
          if (sid.startsWith('any')) {
            // 'any' slot - show dropdown
            const chosenId = chosenAnySkills[i]
            const pool = sid === 'any_academic' ? academicSkills : availableSkills
            const usedIds = new Set([
              ...occupation.skills.filter((s) => !s.startsWith('any')),
              ...Object.values(chosenAnySkills),
              'majetnosc',
            ])

            return (
              <div key={`any-${i}`} className="py-1.5 px-2 rounded bg-coc-surface-light/30">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="warning">
                    {sid === 'any_academic' ? 'Dowolna (akademicka)' : 'Dowolna'}
                  </Badge>
                  <select
                    value={chosenId ?? ''}
                    onChange={(e) => handleChooseAnySkill(i, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm bg-coc-surface-light border border-coc-border rounded text-coc-text cursor-pointer"
                  >
                    <option value="">— Wybierz umiejętność —</option>
                    {pool
                      .filter((s) => !usedIds.has(s.id) || s.id === chosenId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({typeof s.base === 'number' ? s.base : s.base === 'half_dex' ? '½ZRĘ' : 'WYK'}%)</option>
                      ))
                    }
                  </select>
                </div>
                {chosenId && (
                  <SkillRow
                    name={getSkillById(chosenId)?.name ?? chosenId}
                    baseValue={getBaseValue(chosenId, chars)}
                    addedPoints={skillPoints[chosenId] ?? 0}
                    onPointsChange={(d) => handlePointChange(chosenId, d)}
                  />
                )}
              </div>
            )
          }

          const skill = getSkillById(sid)
          if (!skill) return null
          return (
            <SkillRow
              key={sid}
              name={skill.name}
              baseValue={getBaseValue(sid, chars)}
              addedPoints={skillPoints[sid] ?? 0}
              onPointsChange={(d) => handlePointChange(sid, d)}
            />
          )
        })}

        {/* Credit Rating (always part of occupation) */}
        <div className="border-t border-coc-border pt-2 mt-2">
          <SkillRow
            name="Majętność (Majętność)"
            baseValue={creditRatingBase}
            addedPoints={creditRatingPoints}
            onPointsChange={(d) => handlePointChange('majetnosc', d)}
          />
          {!creditRatingValid && (
            <p className="text-xs text-coc-danger px-2">
              Majętność musi być w zakresie {occupation.credit_rating.min}–{occupation.credit_rating.max}
            </p>
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
