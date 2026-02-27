import { useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { useCharacterStore } from '@/stores/characterStore'
import { useInviteCode } from '@/hooks/useInviteCode'
import { PERKS } from '@/data/perks'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { METHOD_LABELS, ERA_LABELS, type CreationMethod } from '@/types/common'

export function StepInviteCode() {
  const store = useCharacterStore()
  const { loading, error, inviteCode, validate } = useInviteCode()
  const [code, setCode] = useState(store.inviteCode ?? '')
  const [selectedMethod, setSelectedMethod] = useState<CreationMethod | null>(store.method)

  const handleValidate = async () => {
    const result = await validate(code)
    if (result) {
      const methods = result.methods ?? [result.method]
      const autoMethod = methods.length === 1 ? methods[0] : null
      setSelectedMethod(autoMethod)
      store.setInviteCode({
        id: result.id,
        code: result.code,
        methods,
        method: autoMethod,
        era: result.era,
        perks: result.perks ?? [],
        maxTries: result.max_tries,
        timesUsed: result.times_used,
        maxSkillValue: result.max_skill_value ?? 99,
      })
    }
  }

  const handleMethodSelect = (method: CreationMethod) => {
    setSelectedMethod(method)
    store.setMethod(method)
  }

  const handleContinue = () => {
    store.nextStep()
  }

  const methods = inviteCode?.methods ?? (inviteCode ? [inviteCode.method] : [])
  const perks = inviteCode?.perks ?? []
  const canContinue = selectedMethod !== null

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

          {/* Method selection */}
          {methods.length === 1 ? (
            <div>
              <span className="text-xs text-coc-text-muted">Metoda: </span>
              <Badge variant="success">{METHOD_LABELS[methods[0]]}</Badge>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium mb-2">Wybierz metodę tworzenia:</p>
              <div className="space-y-2">
                {methods.map((m) => (
                  <label
                    key={m}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedMethod === m
                        ? 'border-coc-accent bg-coc-accent/10'
                        : 'border-coc-border hover:border-coc-accent/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      checked={selectedMethod === m}
                      onChange={() => handleMethodSelect(m)}
                      className="accent-coc-accent"
                    />
                    <span className="text-sm font-medium">{METHOD_LABELS[m]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Perks display */}
          {perks.length > 0 && (
            <div>
              <span className="text-xs text-coc-text-muted">Perki: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {perks.map((p) => {
                  const perk = PERKS.find((pk) => pk.id === p)
                  return perk ? (
                    <Badge key={p} variant="warning">{perk.name}</Badge>
                  ) : null
                })}
              </div>
            </div>
          )}

          {inviteCode.times_used > 0 && (
            <p className="text-xs text-coc-warning">
              Uwaga: Ten kod był już użyty. Poprzednia postać zostanie zastąpiona nową.
            </p>
          )}
          <Button onClick={handleContinue} disabled={!canContinue} className="mt-2">
            Dalej
          </Button>
        </div>
      )}
    </Card>
  )
}
