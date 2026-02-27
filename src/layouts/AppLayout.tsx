import { Outlet } from 'react-router-dom'
import { Skull } from 'lucide-react'

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-coc-border bg-coc-surface">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Skull className="w-6 h-6 text-coc-accent-light" />
          <h1 className="text-lg font-serif font-bold tracking-wide text-coc-text">
            Zew Cthulhu — Kreator Badacza
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-coc-border bg-coc-surface text-coc-text-muted text-xs text-center py-3">
        Zew Cthulhu 7. Edycja &middot; Kreator Postaci
      </footer>
    </div>
  )
}
