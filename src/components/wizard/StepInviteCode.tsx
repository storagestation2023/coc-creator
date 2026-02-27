import { useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { useCharacterStore } from '@/stores/characterStore'
import { useInviteCode } from '@/hooks/useInviteCode'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { METHOD_LABELS, ERA_LABELS } from '@/types/common'

export function StepInviteCode() {
  const store = useCharacterStore()
  const { loading, error, inviteCode, validate } = useInviteCode()
  const [code, setCode] = useState(store.inviteCode ?? '')

  const handleValidate = async () => {
    const result = await validate(code)
    if (result) {
      store.setInviteCode({
        id: result.id,
        code: result.code,
        method: result.method,
        era: result.era,
      })
    }
  }

  const handleContinue = () => {
    store.nextStep()
  }

  return (
    <Card title="Kod zaproszenia">
      <p className="text-coc-text-muted text-sm mb-6">
        Wprowadź kod otrzymany od Strażnika Tajemnic, aby rozpocząć tworzenie Badacza.
      </p>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-coc-text-muted" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="np. ABC-1234-XYZ"
            className="w-full pl-11 pr-4 py-2.5 bg-coc-surface-light border border-coc-border rounded-lg text-coc-text placeholder:text-coc-text-muted/50 focus:outline-none focus:border-coc-accent-light transition-colors font-mono tracking-wider"
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
          />
        </div>
        <Button onClick={handleValidate} disabled={!code.trim() || loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sprawdź'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-coc-danger mb-4">{error}</p>
      )}

      {inviteCode && (
        <div className="bg-coc-surface-light border border-coc-accent/30 rounded-lg p-4 space-y-3">
          <p className="text-sm text-coc-accent-light font-medium">Kod prawidłowy!</p>
          <div className="flex flex-wrap gap-3">
            <div>
              <span className="text-xs text-coc-text-muted">Metoda: </span>
              <Badge variant="success">{METHOD_LABELS[inviteCode.method]}</Badge>
            </div>
            <div>
              <span className="text-xs text-coc-text-muted">Era: </span>
              <Badge>{ERA_LABELS[inviteCode.era]}</Badge>
            </div>
            <div>
              <span className="text-xs text-coc-text-muted">Użycia: </span>
              <Badge variant={inviteCode.times_used >= inviteCode.max_tries - 1 ? 'warning' : 'default'}>
                {inviteCode.times_used} / {inviteCode.max_tries}
              </Badge>
            </div>
          </div>
          {inviteCode.times_used > 0 && (
            <p className="text-xs text-coc-warning">
              Uwaga: Ten kod był już użyty. Poprzednia postać zostanie zastąpiona nową.
            </p>
          )}
          <Button onClick={handleContinue} className="mt-2">
            Dalej
          </Button>
        </div>
      )}
    </Card>
  )
}
