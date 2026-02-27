import { useState } from 'react'
import { Lock, Loader2 } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { adminValidatePassword } from '@/lib/admin'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function AdminLogin() {
  const { login } = useAdminStore()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError(null)

    const valid = await adminValidatePassword(password)
    if (valid) {
      login(password)
    } else {
      setError('Nieprawidłowe hasło.')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card title="Panel Strażnika Tajemnic" className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-coc-text-muted" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Hasło administratora"
              className="w-full pl-11 pr-4 py-2.5 bg-coc-surface-light border border-coc-border rounded-lg text-coc-text placeholder:text-coc-text-muted/50 focus:outline-none focus:border-coc-accent-light transition-colors"
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-coc-danger">{error}</p>}

          <Button type="submit" disabled={!password.trim() || loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Zaloguj'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
