import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'

export function HomePage() {
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      navigate(`/create?code=${encodeURIComponent(code.trim())}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-3xl font-serif font-bold mb-2 text-coc-text">
        Kreator Badacza
      </h2>
      <p className="text-coc-text-muted mb-8 max-w-md">
        Zew Cthulhu 7. Edycja — Wprowadź kod zaproszenia otrzymany od Strażnika
        Tajemnic, aby rozpocząć tworzenie postaci.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-coc-text-muted" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Kod zaproszenia"
            className="w-full pl-11 pr-4 py-3 bg-coc-surface border border-coc-border rounded-lg text-coc-text placeholder:text-coc-text-muted focus:outline-none focus:border-coc-accent-light transition-colors"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={!code.trim()}
          className="w-full py-3 bg-coc-accent hover:bg-coc-accent-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Rozpocznij
        </button>
      </form>
    </div>
  )
}
