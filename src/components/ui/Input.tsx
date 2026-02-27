import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-coc-text-muted">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-coc-surface-light border rounded-lg text-coc-text placeholder:text-coc-text-muted/50 focus:outline-none focus:border-coc-accent-light transition-colors ${
            error ? 'border-coc-danger' : 'border-coc-border'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-coc-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
