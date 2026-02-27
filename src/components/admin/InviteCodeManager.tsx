import { useState, useEffect, useCallback } from 'react'
import { Copy, Trash2, Plus, Loader2, RefreshCw } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { adminGetCodes, adminCreateCode, adminDeleteCode } from '@/lib/admin'
import { generateInviteCode } from '@/lib/inviteCode'
import { ERA_LABELS, METHOD_LABELS, type Era, type CreationMethod } from '@/types/common'
import { PERKS } from '@/data/perks'
import type { InviteCode } from '@/types/invite'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'

const ALL_METHODS: CreationMethod[] = ['dice', 'point_buy', 'direct']

export function InviteCodeManager() {
  const { password } = useAdminStore()
  const [codes, setCodes] = useState<InviteCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [newMethods, setNewMethods] = useState<CreationMethod[]>(['dice'])
  const [newEra, setNewEra] = useState<Era>('classic_1920s')
  const [newMaxTries, setNewMaxTries] = useState(1)
  const [newPerks, setNewPerks] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchCodes = useCallback(async () => {
    if (!password) return
    setLoading(true)
    try {
      const data = await adminGetCodes(password)
      setCodes(data)
      setError(null)
    } catch {
      setError('Błąd pobierania kodów.')
    } finally {
      setLoading(false)
    }
  }, [password])

  useEffect(() => { fetchCodes() }, [fetchCodes])

  const toggleMethod = (method: CreationMethod) => {
    setNewMethods((prev) => {
      if (prev.includes(method)) {
        if (prev.length === 1) return prev
        return prev.filter((m) => m !== method)
      }
      return [...prev, method]
    })
  }

  const togglePerk = (perkId: string) => {
    setNewPerks((prev) =>
      prev.includes(perkId) ? prev.filter((p) => p !== perkId) : [...prev, perkId]
    )
  }

  const handleCreate = async () => {
    if (!password || newMethods.length === 0) return
    setCreating(true)
    try {
      const code = generateInviteCode()
      await adminCreateCode(password, {
        code,
        methods: newMethods,
        era: newEra,
        max_tries: newMaxTries,
        perks: newPerks,
      })
      await fetchCodes()
    } catch {
      setError('Błąd tworzenia kodu.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!password) return
    try {
      await adminDeleteCode(password, id)
      setCodes((prev) => prev.filter((c) => c.id !== id))
    } catch {
      setError('Błąd usuwania kodu.')
    }
  }

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Create new code form */}
      <Card title="Nowy kod zaproszenia">
        <div className="space-y-3 mb-3">
          {/* Methods checkboxes */}
          <div>
            <label className="block text-sm font-medium text-coc-text-muted mb-1">Dozwolone metody</label>
            <div className="flex flex-wrap gap-3">
              {ALL_METHODS.map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMethods.includes(method)}
                    onChange={() => toggleMethod(method)}
                    className="accent-coc-accent"
                  />
                  <span className="text-sm">{METHOD_LABELS[method]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Era"
              value={newEra}
              onChange={(e) => setNewEra(e.target.value as Era)}
              options={[
                { value: 'classic_1920s', label: ERA_LABELS.classic_1920s },
                { value: 'modern', label: ERA_LABELS.modern },
                { value: 'gaslight', label: ERA_LABELS.gaslight },
              ]}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-coc-text-muted">Maks. prób</label>
              <input
                type="number"
                min={1}
                max={99}
                value={newMaxTries}
                onChange={(e) => setNewMaxTries(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-coc-surface-light border border-coc-border rounded-lg text-coc-text focus:outline-none focus:border-coc-accent-light"
              />
            </div>
          </div>

          {/* Perks checkboxes */}
          {PERKS.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-coc-text-muted mb-1">Perki</label>
              <div className="space-y-2">
                {PERKS.map((perk) => (
                  <label key={perk.id} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPerks.includes(perk.id)}
                      onChange={() => togglePerk(perk.id)}
                      className="accent-coc-accent mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium">{perk.name}</span>
                      <p className="text-xs text-coc-text-muted">{perk.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleCreate} disabled={creating || newMethods.length === 0}>
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Wygeneruj kod
        </Button>
      </Card>

      {/* Codes list */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-serif font-bold">Kody zaproszenia ({codes.length})</h3>
          <Button size="sm" variant="ghost" onClick={fetchCodes} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {error && <p className="text-sm text-coc-danger mb-3">{error}</p>}

        {codes.length === 0 && !loading && (
          <p className="text-sm text-coc-text-muted">Brak kodów zaproszenia.</p>
        )}

        <div className="space-y-2">
          {codes.map((code) => {
            const methods = code.methods ?? [code.method]
            const perks = code.perks ?? []
            return (
              <div
                key={code.id}
                className="flex items-center justify-between p-3 bg-coc-surface-light rounded-lg border border-coc-border"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold tracking-wider">{code.code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(code.code, code.id)}
                      className="text-coc-text-muted hover:text-coc-accent-light cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedId === code.id && (
                      <span className="text-xs text-coc-accent-light">Skopiowano!</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {methods.map((m) => (
                      <Badge key={m} variant="success">{METHOD_LABELS[m as CreationMethod]}</Badge>
                    ))}
                    <Badge>{ERA_LABELS[code.era]}</Badge>
                    <Badge variant={code.times_used >= code.max_tries ? 'danger' : 'default'}>
                      {code.times_used}/{code.max_tries} użyć
                    </Badge>
                    {!code.is_active && <Badge variant="danger">Nieaktywny</Badge>}
                    {perks.map((p) => (
                      <Badge key={p} variant="warning">{PERKS.find((pk) => pk.id === p)?.name ?? p}</Badge>
                    ))}
                  </div>
                </div>
                <Button size="sm" variant="danger" onClick={() => handleDelete(code.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
