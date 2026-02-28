import { useState, useMemo } from 'react'
import { useCharacterStore } from '@/stores/characterStore'
import { OCCUPATIONS, parseSkillSlot, isSpecialSlot } from '@/data/occupations'
import { getSkillById, getSkillsForEra, getSkillDisplayName } from '@/data/skills'
import { getWealthBracket } from '@/data/eras'
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
  const maxSkillValue = store.maxSkillValue
  const occupation = useMemo(
    () => OCCUPATIONS.find((o) => o.id === store.occupationId) ?? null,
    [store.occupationId]
  )

  const [skillPoints, setSkillPoints] = useState<Record<string, number>>(store.occupationSkillPoints)

  // Handle special skill slots: player picks from pool or specific options
  const [chosenSlotSkills, setChosenSlotSkills] = useState<Record<number, string>>(() => {
    // Reconstruct chosen skills from stored points
    const slots: Record<number, string> = {}
    if (occupation) {
      const fixedSkills = occupation.skills.filter((s) => !isSpecialSlot(s))
      occupation.skills.forEach((sid, i) => {
        const parsed = parseSkillSlot(sid)
        if (parsed.type === 'any' || parsed.type === 'any_academic') {
          for (const [skillId] of Object.entries(store.occupationSkillPoints)) {
            if (!fixedSkills.includes(skillId) && !Object.values(slots).includes(skillId)) {
              slots[i] = skillId
              break
            }
          }
        } else if (parsed.type === 'choice') {
          for (const optId of parsed.choice.options) {
            if (store.occupationSkillPoints[optId] && !Object.values(slots).includes(optId)) {
              slots[i] = optId
              break
            }
          }
        } else if (parsed.type === 'specialized' && parsed.locked === null) {
          // Open specialization - find matching composite key in stored points
          const baseId = parsed.id
          for (const [skillId] of Object.entries(store.occupationSkillPoints)) {
            if (skillId.startsWith(baseId + ':') && !Object.values(slots).includes(skillId)) {
              // Check if this specialization is valid for this slot
              if (parsed.options) {
                const spec = skillId.substring(baseId.length + 1)
                if (parsed.options.includes(spec)) {
                  slots[i] = skillId
                  break
                }
              } else {
                slots[i] = skillId
                break
              }
            }
          }
        }
      })
    }
    return slots
  })

  // Custom specialization text input state
  const [customSpecTexts, setCustomSpecTexts] = useState<Record<number, string>>({})

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

  // Collect all used skill IDs (fixed + chosen) to prevent duplicates
  const usedIds = new Set([
    ...occupation.skills.filter((s) => !isSpecialSlot(s)),
    ...Object.values(chosenSlotSkills),
    'majetnosc',
  ])

  const handlePointChange = (skillId: string, delta: number) => {
    let effectiveDelta = delta
    if (delta > 0) {
      if (remainingOccupationPoints <= 0) return
      effectiveDelta = Math.min(delta, remainingOccupationPoints)
    }

    const current = skillPoints[skillId] ?? 0
    const newVal = Math.max(0, current + effectiveDelta)
    const newPoints = { ...skillPoints, [skillId]: newVal }
    if (newVal === 0) delete newPoints[skillId]
    setSkillPoints(newPoints)

    if (skillId === 'majetnosc') setCreditRatingPoints(newVal)
  }

  const handleChooseSlotSkill = (slotIndex: number, skillId: string) => {
    // Remove points from old choice
    const oldChoice = chosenSlotSkills[slotIndex]
    if (oldChoice && skillPoints[oldChoice]) {
      const newPoints = { ...skillPoints }
      delete newPoints[oldChoice]
      setSkillPoints(newPoints)
    }
    setChosenSlotSkills((prev) => ({ ...prev, [slotIndex]: skillId }))
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

  const renderSlot = (sid: string, i: number) => {
    const parsed = parseSkillSlot(sid)

    // Fixed skill (no specialization)
    if (parsed.type === 'fixed') {
      const skill = getSkillById(parsed.id)
      if (!skill) return null
      return (
        <SkillRow
          key={parsed.id}
          name={skill.name}
          baseValue={getBaseValue(parsed.id, chars)}
          addedPoints={skillPoints[parsed.id] ?? 0}
          onPointsChange={(d) => handlePointChange(parsed.id, d)}
          maxAdd={maxSkillValue - getBaseValue(parsed.id, chars)}
        />
      )
    }

    // Specialized skill with locked or open specialization
    if (parsed.type === 'specialized') {
      const skill = getSkillById(parsed.id)
      if (!skill) return null

      // Locked specialization - no dropdown needed
      if (parsed.locked) {
        const compositeKey = `${parsed.id}:${parsed.locked}`
        return (
          <SkillRow
            key={compositeKey}
            name={getSkillDisplayName(compositeKey)}
            baseValue={getBaseValue(compositeKey, chars)}
            addedPoints={skillPoints[compositeKey] ?? 0}
            onPointsChange={(d) => handlePointChange(compositeKey, d)}
            maxAdd={maxSkillValue - getBaseValue(compositeKey, chars)}
          />
        )
      }

      // Open or limited specialization - show dropdown
      const chosenCompositeKey = chosenSlotSkills[i]
      const specOptions = parsed.options ?? skill.specializations ?? []
      const chosenValues = Object.values(chosenSlotSkills)
      const isCustom = chosenCompositeKey === `${parsed.id}:__custom__` || (customSpecTexts[i] !== undefined && chosenCompositeKey?.startsWith(`${parsed.id}:`))

      const handleSpecChange = (value: string) => {
        if (value === '__custom__') {
          // Switch to custom input mode
          const oldKey = chosenSlotSkills[i]
          if (oldKey && skillPoints[oldKey]) {
            const newPoints = { ...skillPoints }
            delete newPoints[oldKey]
            setSkillPoints(newPoints)
          }
          setCustomSpecTexts((prev) => ({ ...prev, [i]: '' }))
          setChosenSlotSkills((prev) => ({ ...prev, [i]: `${parsed.id}:__custom__` }))
        } else {
          // Remove custom text state
          setCustomSpecTexts((prev) => {
            const next = { ...prev }
            delete next[i]
            return next
          })
          handleChooseSlotSkill(i, value)
        }
      }

      const handleCustomTextConfirm = () => {
        const text = customSpecTexts[i]?.trim()
        if (text) {
          const compositeKey = `${parsed.id}:${text}`
          // Remove points from old key
          const oldKey = chosenSlotSkills[i]
          if (oldKey && oldKey !== compositeKey && skillPoints[oldKey]) {
            const newPoints = { ...skillPoints }
            delete newPoints[oldKey]
            setSkillPoints(newPoints)
          }
          setChosenSlotSkills((prev) => ({ ...prev, [i]: compositeKey }))
        }
      }

      // Determine current select value
      let selectValue = ''
      if (chosenCompositeKey) {
        if (customSpecTexts[i] !== undefined) {
          selectValue = '__custom__'
        } else {
          selectValue = chosenCompositeKey
        }
      }

      const actualKey = chosenCompositeKey && chosenCompositeKey !== `${parsed.id}:__custom__` ? chosenCompositeKey : undefined

      return (
        <div key={`slot-${i}`} className="py-1.5 px-2 rounded bg-coc-surface-light/30">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default">
              {skill.name}
            </Badge>
            <select
              value={selectValue}
              onChange={(e) => handleSpecChange(e.target.value)}
              className="flex-1 px-2 py-1 text-sm bg-coc-surface-light border border-coc-border rounded text-coc-text cursor-pointer"
            >
              <option value="">— Wybierz specjalizację —</option>
              {specOptions.map((spec) => {
                const compKey = `${parsed.id}:${spec}`
                const alreadyUsed = chosenValues.includes(compKey) && chosenSlotSkills[i] !== compKey
                if (alreadyUsed) return null
                return (
                  <option key={spec} value={compKey}>
                    {spec}
                  </option>
                )
              })}
              {!parsed.options && (
                <option value="__custom__">Inne...</option>
              )}
            </select>
          </div>
          {isCustom && customSpecTexts[i] !== undefined && (
            <div className="flex items-center gap-2 mb-1 px-1">
              <input
                type="text"
                value={customSpecTexts[i]}
                onChange={(e) => setCustomSpecTexts((prev) => ({ ...prev, [i]: e.target.value }))}
                onBlur={handleCustomTextConfirm}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomTextConfirm()}
                placeholder="Wpisz specjalizację..."
                className="flex-1 px-2 py-1 text-sm bg-coc-surface-light border border-coc-border rounded text-coc-text"
                autoFocus
              />
            </div>
          )}
          {actualKey && (
            <SkillRow
              name={getSkillDisplayName(actualKey)}
              baseValue={getBaseValue(actualKey, chars)}
              addedPoints={skillPoints[actualKey] ?? 0}
              onPointsChange={(d) => handlePointChange(actualKey, d)}
              maxAdd={maxSkillValue - getBaseValue(actualKey, chars)}
            />
          )}
        </div>
      )
    }

    // 'any', 'any_academic', or 'choice' slot
    const chosenId = chosenSlotSkills[i]
    let pool: typeof availableSkills
    let label: string

    if (parsed.type === 'any') {
      pool = availableSkills
      label = 'Dowolna'
    } else if (parsed.type === 'any_academic') {
      pool = academicSkills
      label = 'Dowolna (akademicka)'
    } else {
      // choice slot - filter to only the allowed options
      pool = parsed.choice.options
        .map((id) => getSkillById(id))
        .filter((s): s is NonNullable<typeof s> => s !== undefined)
      const optionNames = pool.map((s) => s.name).join(', ')
      label = `Wybierz z: ${optionNames}`
    }

    return (
      <div key={`slot-${i}`} className="py-1.5 px-2 rounded bg-coc-surface-light/30">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={parsed.type === 'choice' ? 'default' : 'warning'}>
            {parsed.type === 'choice' ? 'Wybór' : label}
          </Badge>
          <select
            value={chosenId ?? ''}
            onChange={(e) => handleChooseSlotSkill(i, e.target.value)}
            className="flex-1 px-2 py-1 text-sm bg-coc-surface-light border border-coc-border rounded text-coc-text cursor-pointer"
          >
            <option value="">— Wybierz umiejętność —</option>
            {pool
              .filter((s) => !usedIds.has(s.id) || s.id === chosenId)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({typeof s.base === 'number' ? s.base : s.base === 'half_dex' ? '½ZRĘ' : 'WYK'}%)
                </option>
              ))
            }
          </select>
        </div>
        {parsed.type === 'choice' && (
          <p className="text-xs text-coc-text-muted px-1 mb-1">{label}</p>
        )}
        {chosenId && (
          <SkillRow
            name={getSkillById(chosenId)?.name ?? chosenId}
            baseValue={getBaseValue(chosenId, chars)}
            addedPoints={skillPoints[chosenId] ?? 0}
            onPointsChange={(d) => handlePointChange(chosenId, d)}
            maxAdd={maxSkillValue - getBaseValue(chosenId, chars)}
          />
        )}
      </div>
    )
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

      {occupation.suggested_skills_note && (
        <p className="text-xs text-coc-text-muted italic mb-3 px-1">
          {occupation.suggested_skills_note}
        </p>
      )}

      <div className="space-y-1 mb-4">
        {occupation.skills.map((sid, i) => renderSlot(sid, i))}

        {/* Credit Rating (always part of occupation) */}
        <div className="border-t border-coc-border pt-2 mt-2">
          <SkillRow
            name="Majętność"
            baseValue={creditRatingBase}
            addedPoints={creditRatingPoints}
            onPointsChange={(d) => handlePointChange('majetnosc', d)}
          />
          {!creditRatingValid && (
            <p className="text-xs text-coc-danger px-2">
              Majętność musi być w zakresie {occupation.credit_rating.min}–{occupation.credit_rating.max}
            </p>
          )}
          {creditRatingTotal > 0 && (() => {
            const bracket = getWealthBracket(era, creditRatingTotal)
            const housingRange = bracket.housingOptions.length > 1
              ? `${bracket.housingOptions[0].label} – ${bracket.housingOptions[bracket.housingOptions.length - 1].label}`
              : bracket.housingOptions[0]?.label ?? ''
            return (
              <div className="mt-1.5 px-2 py-1.5 bg-coc-surface-light/50 rounded text-xs text-coc-text-muted">
                Poziom życia: {bracket.spendingLevel}/dzień | Majątek: {bracket.assets} | Mieszkanie: {housingRange}
              </div>
            )
          })()}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={() => store.prevStep()}>Wstecz</Button>
        <Button onClick={handleNext} disabled={!canContinue}>Dalej</Button>
      </div>
    </Card>
  )
}
