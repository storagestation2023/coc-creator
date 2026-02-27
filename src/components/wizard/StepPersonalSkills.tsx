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

export function StepPersonalSkills() {
  const store = useCharacterStore()
  const chars = store.characteristics as Characteristics
  const era = store.era as Era
  const maxSkillValue = store.maxSkillValue
  const occupation = useMemo(
    () => OCCUPATIONS.find((o) => o.id === store.occupationId) ?? null,
    [store.occupationId]
  )

  const [personalPoints, setPersonalPoints] = useState<Record<string, number>>(
    store.personalSkillPoints
  )

  const { totalPersonalPoints, usedPersonalPoints, remainingPersonalPoints } =
    useSkillPoints(occupation, chars, store.occupationSkillPoints, personalPoints)

  // All skills available for personal interest (except Cthulhu Mythos)
  const availableSkills = useMemo(() => {
    return getSkillsForEra(era)
      .filter((s) => s.id !== 'mity_cthulhu' && s.id !== 'majetnosc')
      .sort((a, b) => a.name.localeCompare(b.name, 'pl'))
  }, [era])

  const handlePointChange = (skillId: string, delta: number) => {
    // Cap positive delta to remaining points
    let effectiveDelta = delta
    if (delta > 0) {
      if (remainingPersonalPoints <= 0) return
      effectiveDelta = Math.min(delta, remainingPersonalPoints)
    }

    const current = personalPoints[skillId] ?? 0
    const newVal = Math.max(0, current + effectiveDelta)

    const newPoints = { ...personalPoints, [skillId]: newVal }
    if (newVal === 0) delete newPoints[skillId]
    setPersonalPoints(newPoints)
  }

  const canContinue = remainingPersonalPoints === 0

  const handleNext = () => {
    store.setPersonalSkillPoints(personalPoints)
    store.nextStep()
  }

  return (
    <Card title="Umiejętności osobiste (zainteresowania)">
      <p className="text-sm text-coc-text-muted mb-3">
        Rozdziel INT × 2 = <strong>{totalPersonalPoints}</strong> punktów wśród dowolnych umiejętności (oprócz Mitów Cthulhu i Majętności).
      </p>

      <div className="mb-4">
        <Badge variant={remainingPersonalPoints === 0 ? 'success' : 'warning'}>
          Punkty: {usedPersonalPoints} / {totalPersonalPoints}
          {remainingPersonalPoints > 0 && ` (pozostało: ${remainingPersonalPoints})`}
        </Badge>
      </div>

      {/* Show skills that already have personal points first */}
      {Object.keys(personalPoints).length > 0 && (
        <div className="mb-3 border-b border-coc-border pb-3">
          <h4 className="text-xs font-medium text-coc-text-muted mb-1">Przydzielone punkty</h4>
          {Object.entries(personalPoints)
            .filter(([, pts]) => pts > 0)
            .map(([skillId, pts]) => {
              const skill = getSkillById(skillId)
              if (!skill) return null
              const occPts = store.occupationSkillPoints[skillId] ?? 0
              const base = getBaseValue(skillId, chars) + occPts
              return (
                <SkillRow
                  key={skillId}
                  name={skill.name}
                  baseValue={base}
                  addedPoints={pts}
                  onPointsChange={(d) => handlePointChange(skillId, d)}
                  maxAdd={maxSkillValue - base}
                />
              )
            })}
        </div>
      )}

      {/* All available skills */}
      <div className="max-h-[400px] overflow-y-auto space-y-0.5 pr-1">
        {availableSkills.map((skill) => {
          const occPts = store.occupationSkillPoints[skill.id] ?? 0
          const persPts = personalPoints[skill.id] ?? 0
          const base = getBaseValue(skill.id, chars) + occPts
          return (
            <SkillRow
              key={skill.id}
              name={skill.name}
              baseValue={base}
              addedPoints={persPts}
              onPointsChange={(d) => handlePointChange(skill.id, d)}
              maxAdd={maxSkillValue - base}
            />
          )
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={() => store.prevStep()}>Wstecz</Button>
        <Button onClick={handleNext} disabled={!canContinue}>Dalej</Button>
      </div>
    </Card>
  )
}
