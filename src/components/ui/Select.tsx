import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-coc-text-muted">{label}</label>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2 bg-coc-surface-light border rounded-lg text-coc-text focus:outline-none focus:border-coc-accent-light transition-colors cursor-pointer ${
            error ? 'border-coc-danger' : 'border-coc-border'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-coc-danger">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
