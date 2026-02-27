import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-coc-surface border border-coc-border rounded-xl p-5 ${className}`}>
      {title && <h3 className="text-lg font-serif font-bold mb-4">{title}</h3>}
      {children}
    </div>
  )
}
