import { Minus, Plus } from 'lucide-react'

interface SkillRowProps {
  name: string
  baseValue: number
  addedPoints: number
  onPointsChange: (delta: number) => void
  maxAdd?: number
  disabled?: boolean
}

export function SkillRow({ name, baseValue, addedPoints, onPointsChange, maxAdd = 99, disabled }: SkillRowProps) {
  const total = baseValue + addedPoints

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-coc-surface-light/50 transition-colors">
      <div className="flex-1 min-w-0">
        <span className="text-sm truncate block">{name}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-coc-text-muted w-8 text-right">{baseValue}</span>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onPointsChange(-1)}
            disabled={disabled || addedPoints <= 0}
            className="p-0.5 rounded hover:bg-coc-border disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className={`w-10 text-center text-sm font-mono ${addedPoints > 0 ? 'text-coc-accent-light font-bold' : 'text-coc-text-muted'}`}>
            +{addedPoints}
          </span>

          <button
            type="button"
            onClick={() => onPointsChange(1)}
            disabled={disabled || addedPoints >= maxAdd || total >= 99}
            className="p-0.5 rounded hover:bg-coc-border disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="w-10 text-right text-sm font-bold font-mono">{total}</span>
      </div>
    </div>
  )
}
