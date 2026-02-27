import { ArrowLeft } from 'lucide-react'
import { getSkillById } from '@/data/skills'
import { CHARACTERISTIC_MAP } from '@/data/characteristics'
import { OCCUPATIONS } from '@/data/occupations'
import { ERA_LABELS, METHOD_LABELS, type CharacteristicKey } from '@/types/common'
import { halfValue, fifthValue } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ExportButtons } from '@/components/shared/ExportButtons'

const CHAR_KEYS: CharacteristicKey[] = ['STR', 'CON', 'SIZ', 'DEX', 'APP', 'INT', 'POW', 'EDU']

interface CharacterViewerProps {
  character: {
    id: string
    name: string
    age: number
    gender: string
    appearance: string
    characteristics: Record<string, number>
    luck: number
    derived: Record<string, unknown>
    occupation_id: string
    occupation_skill_points: Record<string, number>
    personal_skill_points: Record<string, number>
    backstory: Record<string, string>
    equipment: string[]
    cash: string
    assets: string
    spending_level: string
    era: string
    method: string
    status: string
  }
  onBack: () => void
}

export function CharacterViewer({ character: char, onBack }: CharacterViewerProps) {
  const occupation = OCCUPATIONS.find((o) => o.id === char.occupation_id)
  const derived = char.derived as { hp: number; mp: number; san: number; db: string; build: number; move_rate: number; dodge: number }

  // Merge all skill points
  const allSkillPoints: Record<string, number> = { ...char.occupation_skill_points }
  for (const [id, pts] of Object.entries(char.personal_skill_points)) {
    allSkillPoints[id] = (allSkillPoints[id] ?? 0) + pts
  }

  const getBase = (skillId: string) => {
    const skill = getSkillById(skillId)
    if (!skill) return 0
    if (skill.base === 'half_dex') return Math.floor((char.characteristics['DEX'] ?? 0) / 2)
    if (skill.base === 'edu') return char.characteristics['EDU'] ?? 0
    return skill.base
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" /> Wróć do listy
      </Button>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold">{char.name}</h2>
          <Badge variant={char.status === 'submitted' ? 'success' : 'warning'}>
            {char.status === 'submitted' ? 'Zatwierdzona' : 'Szkic'}
          </Badge>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          <div><span className="text-coc-text-muted">Wiek:</span> {char.age}</div>
          <div><span className="text-coc-text-muted">Płeć:</span> {char.gender}</div>
          <div><span className="text-coc-text-muted">Zawód:</span> {occupation?.name ?? char.occupation_id}</div>
          <div><span className="text-coc-text-muted">Era:</span> {ERA_LABELS[char.era as keyof typeof ERA_LABELS]}</div>
          <div><span className="text-coc-text-muted">Metoda:</span> {METHOD_LABELS[char.method as keyof typeof METHOD_LABELS]}</div>
        </div>
        {char.appearance && (
          <div className="text-sm mb-4">
            <span className="text-coc-text-muted">Wygląd:</span> {char.appearance}
          </div>
        )}

        {/* Characteristics */}
        <h4 className="text-sm font-medium text-coc-text-muted uppercase tracking-wider mb-2">Cechy</h4>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {CHAR_KEYS.map((key) => {
            const val = char.characteristics[key] ?? 0
            return (
              <div key={key} className="text-center bg-coc-surface-light rounded-lg p-2">
                <div className="text-xs text-coc-text-muted">{CHARACTERISTIC_MAP[key].abbreviation}</div>
                <div className="text-lg font-bold font-mono">{val}</div>
                <div className="text-xs text-coc-text-muted">{halfValue(val)} / {fifthValue(val)}</div>
              </div>
            )
          })}
        </div>

        {/* Derived */}
        {derived && (
          <>
            <h4 className="text-sm font-medium text-coc-text-muted uppercase tracking-wider mb-2">Atrybuty pochodne</h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <MiniStat label="PW" value={derived.hp} />
              <MiniStat label="PM" value={derived.mp} />
              <MiniStat label="PP" value={derived.san} />
              <MiniStat label="Szczęście" value={char.luck} />
              <MiniStat label="PO" value={derived.db} />
              <MiniStat label="Krzepa" value={derived.build} />
              <MiniStat label="Ruch" value={derived.move_rate} />
              <MiniStat label="Unik" value={derived.dodge} />
            </div>
          </>
        )}

        {/* Skills */}
        <h4 className="text-sm font-medium text-coc-text-muted uppercase tracking-wider mb-2">Umiejętności</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-sm mb-4 max-h-[250px] overflow-y-auto">
          {Object.entries(allSkillPoints)
            .filter(([, pts]) => pts > 0)
            .sort(([a], [b]) => {
              const sA = getSkillById(a)
              const sB = getSkillById(b)
              return (sA?.name ?? a).localeCompare(sB?.name ?? b, 'pl')
            })
            .map(([skillId, pts]) => {
              const skill = getSkillById(skillId)
              const base = getBase(skillId)
              return (
                <div key={skillId} className="flex justify-between py-0.5">
                  <span className="text-coc-text-muted truncate">{skill?.name ?? skillId}</span>
                  <span className="font-mono font-bold ml-2">{base + pts}%</span>
                </div>
              )
            })}
        </div>

        {/* Backstory */}
        {Object.keys(char.backstory).length > 0 && (
          <>
            <h4 className="text-sm font-medium text-coc-text-muted uppercase tracking-wider mb-2">Historia postaci</h4>
            <div className="space-y-2 mb-4">
              {Object.entries(char.backstory).map(([key, value]) => {
                if (!value) return null
                const labels: Record<string, string> = {
                  ideology: 'Ideologia / Przekonania',
                  significant_people_who: 'Ważne osoby — Kto',
                  significant_people_why: 'Ważne osoby — Dlaczego',
                  meaningful_locations: 'Znaczące miejsca',
                  treasured_possessions: 'Rzeczy osobiste',
                  traits: 'Przymioty',
                  appearance_description: 'Opis postaci',
                  key_connection: 'Kluczowa więź',
                }
                return (
                  <div key={key}>
                    <div className="text-xs text-coc-text-muted">{labels[key] ?? key}</div>
                    <div className="text-sm whitespace-pre-wrap">{value}</div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Equipment */}
        {char.equipment.length > 0 && (
          <>
            <h4 className="text-sm font-medium text-coc-text-muted uppercase tracking-wider mb-2">Ekwipunek</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {char.cash && <Badge>Gotówka: {char.cash}</Badge>}
              {char.assets && <Badge>Majątek: {char.assets}</Badge>}
              {char.spending_level && <Badge>Poziom życia: {char.spending_level}</Badge>}
            </div>
            <ul className="text-sm space-y-0.5 mb-4">
              {char.equipment.map((item, i) => (
                <li key={i} className="text-coc-text-muted">• {item}</li>
              ))}
            </ul>
          </>
        )}

        {/* Export buttons */}
        <ExportButtons character={char} />
      </Card>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-center bg-coc-accent/10 rounded p-1.5">
      <div className="text-[10px] text-coc-text-muted">{label}</div>
      <div className="font-bold font-mono">{value}</div>
    </div>
  )
}
