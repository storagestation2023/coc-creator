import { Check } from 'lucide-react'

interface StepperProps {
  steps: string[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max gap-1">
        {steps.map((label, i) => {
          const isCompleted = i < currentStep
          const isCurrent = i === currentStep

          return (
            <div key={i} className="flex items-center">
              {i > 0 && (
                <div
                  className={`w-6 h-px mx-1 ${
                    isCompleted ? 'bg-coc-accent-light' : 'bg-coc-border'
                  }`}
                />
              )}
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                    isCompleted
                      ? 'bg-coc-accent-light text-white'
                      : isCurrent
                        ? 'bg-coc-accent text-white'
                        : 'bg-coc-surface-light text-coc-text-muted border border-coc-border'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={`text-xs whitespace-nowrap ${
                    isCurrent ? 'text-coc-text font-medium' : 'text-coc-text-muted'
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
