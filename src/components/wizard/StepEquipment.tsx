import { useState, useMemo } from 'react'
import { Plus, Trash2, Search } from 'lucide-react'
import { useCharacterStore } from '@/stores/characterStore'
import { getEquipmentByCategory } from '@/data/equipment'
import { getWeaponsForEra, type Weapon } from '@/data/weapons'
import { getWealthBracket } from '@/data/eras'
import { getSkillById } from '@/data/skills'
import type { Era } from '@/types/common'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function StepEquipment() {
  const store = useCharacterStore()
  const era = store.era as Era
  const creditRating = (store.occupationSkillPoints['majetnosc'] ?? 0) +
    (typeof getSkillById('majetnosc')?.base === 'number' ? (getSkillById('majetnosc')?.base as number) : 0)

  const wealth = getWealthBracket(era, creditRating)

  const [selectedItems, setSelectedItems] = useState<string[]>(store.equipment)
  const [customItems, setCustomItems] = useState<string[]>(store.customItems)
  const [newCustomItem, setNewCustomItem] = useState('')
  const [search, setSearch] = useState('')
  const [showWeapons, setShowWeapons] = useState(false)

  const equipmentByCategory = useMemo(() => getEquipmentByCategory(era), [era])
  const weapons = useMemo(() => getWeaponsForEra(era), [era])

  const addItem = (itemName: string) => {
    setSelectedItems((prev) => [...prev, itemName])
  }

  const removeItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index))
  }

  const addCustomItem = () => {
    if (newCustomItem.trim()) {
      setCustomItems((prev) => [...prev, newCustomItem.trim()])
      setNewCustomItem('')
    }
  }

  const removeCustomItem = (index: number) => {
    setCustomItems((prev) => prev.filter((_, i) => i !== index))
  }

  const addWeapon = (weapon: Weapon) => {
    setSelectedItems((prev) => [...prev, `${weapon.name} (${weapon.damage}, ${weapon.range})`])
  }

  const handleNext = () => {
    store.setEquipment(selectedItems)
    store.setCustomItems(customItems)
    store.setWealth({
      cash: wealth.cash,
      assets: wealth.assets,
      spendingLevel: wealth.spendingLevel,
    })
    store.nextStep()
  }

  return (
    <Card title="Ekwipunek">
      {/* Wealth summary */}
      <div className="bg-coc-accent/10 border border-coc-accent/20 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <div className="text-xs text-coc-text-muted">Poziom życia</div>
            <div className="font-medium">{wealth.spendingLevel}</div>
          </div>
          <div>
            <div className="text-xs text-coc-text-muted">Gotówka</div>
            <div className="font-medium">{wealth.cash}</div>
          </div>
          <div>
            <div className="text-xs text-coc-text-muted">Majątek</div>
            <div className="font-medium">{wealth.assets}</div>
          </div>
        </div>
        <p className="text-xs text-coc-text-muted mt-2">
          Majętność: {creditRating} — dobieraj ekwipunek odpowiednio do statusu postaci.
        </p>
      </div>

      {/* Selected items */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">
          Wybrany ekwipunek ({selectedItems.length + customItems.length})
        </h4>
        {selectedItems.length === 0 && customItems.length === 0 && (
          <p className="text-sm text-coc-text-muted">Brak wybranych przedmiotów.</p>
        )}
        <div className="space-y-1">
          {selectedItems.map((item, i) => (
            <div key={`item-${i}`} className="flex items-center justify-between py-1 px-2 bg-coc-surface-light rounded text-sm">
              <span>{item}</span>
              <button type="button" onClick={() => removeItem(i)} className="text-coc-text-muted hover:text-coc-danger cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {customItems.map((item, i) => (
            <div key={`custom-${i}`} className="flex items-center justify-between py-1 px-2 bg-coc-surface-light rounded text-sm">
              <span>{item} <Badge>własny</Badge></span>
              <button type="button" onClick={() => removeCustomItem(i)} className="text-coc-text-muted hover:text-coc-danger cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom item input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCustomItem}
          onChange={(e) => setNewCustomItem(e.target.value)}
          placeholder="Własny przedmiot..."
          className="flex-1 px-3 py-2 bg-coc-surface-light border border-coc-border rounded-lg text-coc-text placeholder:text-coc-text-muted/50 focus:outline-none focus:border-coc-accent-light transition-colors text-sm"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem())}
        />
        <Button size="sm" onClick={addCustomItem} disabled={!newCustomItem.trim()}>
          <Plus className="w-4 h-4" /> Dodaj
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coc-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Szukaj w katalogu..."
          className="w-full pl-10 pr-4 py-2 bg-coc-surface-light border border-coc-border rounded-lg text-coc-text placeholder:text-coc-text-muted/50 focus:outline-none focus:border-coc-accent-light transition-colors text-sm"
        />
      </div>

      {/* Equipment catalog */}
      <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1 mb-4">
        {Object.entries(equipmentByCategory).map(([category, items]) => {
          const filtered = search
            ? items.filter((it) => it.name.toLowerCase().includes(search.toLowerCase()))
            : items
          if (filtered.length === 0) return null

          return (
            <div key={category}>
              <h4 className="text-xs font-medium text-coc-text-muted uppercase tracking-wider mb-1">
                {category}
              </h4>
              <div className="space-y-0.5">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-coc-surface-light transition-colors"
                  >
                    <div>
                      <span className="text-sm">{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-coc-text-muted ml-2">— {item.description}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-coc-text-muted">{item.price}</span>
                      <button
                        type="button"
                        onClick={() => addItem(item.name)}
                        className="text-coc-accent-light hover:text-coc-accent cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Weapons toggle */}
      <div className="border-t border-coc-border pt-3 mb-4">
        <Button size="sm" variant="secondary" onClick={() => setShowWeapons(!showWeapons)}>
          {showWeapons ? 'Ukryj broń' : 'Pokaż broń (Tabela Broni)'}
        </Button>

        {showWeapons && (
          <div className="mt-2 max-h-[250px] overflow-y-auto space-y-1">
            {weapons.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-coc-surface-light transition-colors"
              >
                <div>
                  <span className="text-sm font-medium">{w.name}</span>
                  <span className="text-xs text-coc-text-muted ml-2">
                    {w.damage} | {w.range} | {w.price}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => addWeapon(w)}
                  className="text-coc-accent-light hover:text-coc-accent cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={() => store.prevStep()}>Wstecz</Button>
        <Button onClick={handleNext}>Dalej</Button>
      </div>
    </Card>
  )
}
