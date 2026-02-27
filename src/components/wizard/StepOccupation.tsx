import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useCharacterStore } from '@/stores/characterStore'
import { OCCUPATIONS, getOccupationsForEra } from '@/data/occupations'
import { getSkillById } from '@/data/skills'
import { CHARACTERISTIC_MAP } from '@/data/characteristics'
import { calculateOccupationPoints } from '@/hooks/useSkillPoints'
import type { Characteristics } from '@/types/character'
import type { Era } from '@/types/common'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function StepOccupation() {
  const store = useCharacterStore()
  const era = store.era as Era
  const chars = store.characteristics as Characteristics
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(store.occupationId)

  const occupations = useMemo(() => {
    const eraOccs = getOccupationsForEra(era)
    if (!search.trim()) return eraOccs
    const term = search.toLowerCase()
    return eraOccs.filter((o) => o.name.toLowerCase().includes(term))
  }, [era, search])

  const selected = useMemo(
    () => (selectedId ? OCCUPATIONS.find((o) => o.id === selectedId) : null),
    [selectedId]
  )

  const handleNext = () => {
    if (selectedId) {
      store.setOccupation(selectedId)
      store.nextStep()
    }
  }

  return (
    <Card title="Zawód">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coc-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj zawodu..."
          className="w-full pl-10 pr-4 py-2 bg-coc-surface-light border border-coc-border rounded-lg text-coc-text placeholder:text-coc-text-muted/50 focus:outline-none focus:border-coc-accent-light transition-colors"
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-1 mb-4 pr-1">
        {occupations.map((occ) => {
          const pts = calculateOccupationPoints(occ, chars)
          const isSelected = occ.id === selectedId
          return (
            <button
              key={occ.id}
              type="button"
              onClick={() => setSelectedId(occ.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-coc-accent/20 border border-coc-accent/40'
                  : 'hover:bg-coc-surface-light border border-transparent'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{occ.name}</span>
                <span className="text-xs text-coc-text-muted">{pts} pkt</span>
              </div>
              <div className="text-xs text-coc-text-muted">
                Majętność: {occ.credit_rating.min}–{occ.credit_rating.max}
              </div>
            </button>
          )
        })}
        {occupations.length === 0 && (
          <p className="text-sm text-coc-text-muted text-center py-4">Brak wyników.</p>
        )}
      </div>

      {/* Selected occupation details */}
      {selected && (
        <div className="bg-coc-surface-light border border-coc-border rounded-lg p-4 mb-4">
          <h4 className="font-serif font-bold text-lg mb-2">{selected.name}</h4>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="success">
              {selected.skill_formula.characteristics.map((c) => CHARACTERISTIC_MAP[c].abbreviation).join(' + ')}
              {' × '}{selected.skill_formula.multiplier}
              {' = '}{calculateOccupationPoints(selected, chars)} pkt
            </Badge>
            <Badge>
              Majętność: {selected.credit_rating.min}–{selected.credit_rating.max}
            </Badge>
          </div>

          <div className="mb-2">
            <span className="text-xs text-coc-text-muted">Umiejętności zawodowe:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selected.skills.map((sid, i) => {
                const skill = getSkillById(sid)
                const label = sid === 'any' ? 'Dowolna' : sid === 'any_academic' ? 'Dowolna (akademicka)' : skill?.name ?? sid
                return (
                  <Badge key={i} variant={sid.startsWith('any') ? 'warning' : 'default'}>
                    {label}
                  </Badge>
                )
              })}
              <Badge>Majętność</Badge>
            </div>
          </div>

          {selected.contacts && (
            <p className="text-xs text-coc-text-muted mt-2">
              <strong>Kontakty:</strong> {selected.contacts}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={() => store.prevStep()}>Wstecz</Button>
        <Button onClick={handleNext} disabled={!selectedId}>Dalej</Button>
      </div>
    </Card>
  )
}
