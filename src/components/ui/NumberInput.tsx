import { Minus, Plus } from 'lucide-react'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  disabled?: boolean
}

export function NumberInput({ value, onChange, min = 0, max = 99, label, disabled }: NumberInputProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1)
  }
  const increment = () => {
    if (value < max) onChange(value + 1)
  }
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10)
    if (!isNaN(v) && v >= min && v <= max) onChange(v)
  }

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-coc-text-muted">{label}</label>}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= min}
          className="p-1.5 rounded bg-coc-surface-light border border-coc-border hover:bg-coc-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInput}
          min={min}
          max={max}
          disabled={disabled}
          className="w-16 text-center px-2 py-1.5 bg-coc-surface-light border border-coc-border rounded text-coc-text focus:outline-none focus:border-coc-accent-light [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={increment}
          disabled={disabled || value >= max}
          className="p-1.5 rounded bg-coc-surface-light border border-coc-border hover:bg-coc-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
