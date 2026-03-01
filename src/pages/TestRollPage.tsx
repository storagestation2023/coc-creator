import { useState } from 'react'
import { Dices } from 'lucide-react'
import { CHARACTERISTICS } from '@/data/characteristics'
import { rollCharacteristic } from '@/lib/dice'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { CharacteristicKey } from '@/types/common'

const SAMPLE_SIZE = 200

// All possible values for each formula
const VALUES_3D6X5 = Array.from({ length: 16 }, (_, i) => (i + 3) * 5) // 15,20,...,90
const VALUES_2D6X5 = Array.from({ length: 11 }, (_, i) => (i + 8) * 5) // 40,45,...,90

type DistMap = Record<CharacteristicKey, Record<number, number>>

export function TestRollPage() {
  const [dist, setDist] = useState<DistMap | null>(null)
  const [running, setRunning] = useState(false)

  const handleRoll = () => {
    setRunning(true)
    // Use setTimeout to let the UI update before the sync computation
    setTimeout(() => {
      const result: DistMap = {} as DistMap
      for (const c of CHARACTERISTICS) {
        result[c.key] = {}
      }

      for (let i = 0; i < SAMPLE_SIZE; i++) {
        for (const c of CHARACTERISTICS) {
          const val = rollCharacteristic(c.rollFormula)
          result[c.key][val] = (result[c.key][val] ?? 0) + 1
        }
      }

      setDist(result)
      setRunning(false)
    }, 50)
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Card title={`Test rzutów — ${SAMPLE_SIZE} zestawów`}>
        <div className="mb-4">
          <Button onClick={handleRoll} disabled={running}>
            <Dices className="w-4 h-4" />
            {running ? 'Losowanie...' : `Wygeneruj ${SAMPLE_SIZE} zestawów`}
          </Button>
        </div>

        {dist && (
          <div className="space-y-6">
            {/* Summary: how many sets have at most 1 stat below 50 */}
            <SummaryStats dist={dist} />

            {/* Per-characteristic distribution */}
            {CHARACTERISTICS.map((c) => {
              const values = c.rollFormula === '3d6x5' ? VALUES_3D6X5 : VALUES_2D6X5
              const counts = dist[c.key]
              const maxCount = Math.max(...Object.values(counts), 1)

              return (
                <div key={c.key}>
                  <h4 className="text-sm font-medium mb-1">
                    {c.abbreviation} ({c.name}) — <span className="text-coc-text-muted">{c.rollFormula === '3d6x5' ? '3K6×5' : '(2K6+6)×5'}</span>
                  </h4>
                  <div className="flex items-end gap-[2px] h-24">
                    {values.map((v) => {
                      const count = counts[v] ?? 0
                      const pct = count / SAMPLE_SIZE * 100
                      const barH = (count / maxCount) * 100
                      const isBelow50 = v < 50
                      return (
                        <div key={v} className="flex-1 flex flex-col items-center" title={`${v}: ${count}× (${pct.toFixed(1)}%)`}>
                          <div className="text-[9px] text-coc-text-muted mb-0.5">
                            {count > 0 ? count : ''}
                          </div>
                          <div
                            className={`w-full rounded-t ${isBelow50 ? 'bg-coc-danger/60' : 'bg-coc-accent/60'}`}
                            style={{ height: `${barH}%`, minHeight: count > 0 ? 2 : 0 }}
                          />
                          <div className="text-[8px] text-coc-text-muted mt-0.5">{v}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-xs text-coc-text-muted mt-1">
                    Średnia: {(Object.entries(counts).reduce((s, [v, n]) => s + Number(v) * n, 0) / SAMPLE_SIZE).toFixed(1)}
                    {' · '}
                    Poniżej 50: {values.filter(v => v < 50).reduce((s, v) => s + (counts[v] ?? 0), 0)} / {SAMPLE_SIZE}
                    {' '}({(values.filter(v => v < 50).reduce((s, v) => s + (counts[v] ?? 0), 0) / SAMPLE_SIZE * 100).toFixed(1)}%)
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

function SummaryStats({ dist }: { dist: DistMap }) {
  const below50counts: Record<CharacteristicKey, number> = {} as Record<CharacteristicKey, number>
  for (const c of CHARACTERISTICS) {
    below50counts[c.key] = Object.entries(dist[c.key])
      .filter(([v]) => Number(v) < 50)
      .reduce((s, [, n]) => s + n, 0)
  }

  // Re-simulate to get per-set stats (fast since we already have the function)
  let setsWithMax1Below50 = 0
  let setsWithAllAbove50 = 0
  const setTotals: number[] = []

  for (let i = 0; i < SAMPLE_SIZE; i++) {
    let countBelow50 = 0
    let total = 0
    for (const c of CHARACTERISTICS) {
      const val = rollCharacteristic(c.rollFormula)
      if (val < 50) countBelow50++
      total += val
    }
    if (countBelow50 <= 1) setsWithMax1Below50++
    if (countBelow50 === 0) setsWithAllAbove50++
    setTotals.push(total)
  }

  const avgTotal = setTotals.reduce((a, b) => a + b, 0) / SAMPLE_SIZE

  return (
    <div className="bg-coc-surface-light border border-coc-border rounded-lg p-4 space-y-2">
      <h4 className="text-sm font-bold uppercase tracking-wider text-coc-text-muted">Analiza zestawów (dodatkowe {SAMPLE_SIZE} rzutów)</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <Stat
          label="Zestawy z max 1 cechą < 50"
          value={`${setsWithMax1Below50} / ${SAMPLE_SIZE}`}
          pct={setsWithMax1Below50 / SAMPLE_SIZE * 100}
        />
        <Stat
          label="Zestawy z 0 cech < 50"
          value={`${setsWithAllAbove50} / ${SAMPLE_SIZE}`}
          pct={setsWithAllAbove50 / SAMPLE_SIZE * 100}
        />
        <Stat
          label="Średnia suma zestawu"
          value={avgTotal.toFixed(0)}
          pct={null}
        />
      </div>
      <div className="text-xs text-coc-text-muted mt-2">
        Każda cecha poniżej 50 zaznaczona jest na <span className="text-coc-danger">czerwono</span> na wykresach.
      </div>
    </div>
  )
}

function Stat({ label, value, pct }: { label: string; value: string; pct: number | null }) {
  return (
    <div>
      <div className="text-xs text-coc-text-muted">{label}</div>
      <div className="font-bold font-mono">
        {value}
        {pct !== null && <span className="text-coc-text-muted font-normal text-xs ml-1">({pct.toFixed(1)}%)</span>}
      </div>
    </div>
  )
}
