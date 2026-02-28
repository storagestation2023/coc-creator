import { useState, useMemo } from 'react'
import { Plus, Trash2, Search, Home, Shirt, Car, Sparkles, Wallet, Landmark } from 'lucide-react'
import { useCharacterStore } from '@/stores/characterStore'
import { getEquipmentByCategory } from '@/data/equipment'
import { getWeaponsForEra, type Weapon } from '@/data/weapons'
import {
  getWealthBracket, formatCurrency, LIFESTYLE_LEVELS, WEALTH_FORMS,
  type HousingOption, type ClothingOption, type TransportOption, type LifestyleLevel,
} from '@/data/eras'
import { getSkillById } from '@/data/skills'
import type { Era } from '@/types/common'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

function parsePriceToNumber(price: string): number {
  const cleaned = price.replace(/[^0-9,.]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function StepEquipment() {
  const store = useCharacterStore()
  const era = store.era as Era
  const creditRating = (store.occupationSkillPoints['majetnosc'] ?? 0) +
    (typeof getSkillById('majetnosc')?.base === 'number' ? (getSkillById('majetnosc')?.base as number) : 0)

  const wealth = getWealthBracket(era, creditRating)
  const lifestyleLevels = LIFESTYLE_LEVELS[era]
  const wealthForms = WEALTH_FORMS[era]

  // Determine default lifestyle: highest free level for this CR
  const defaultLifestyle = [...lifestyleLevels].reverse().find((l) => creditRating >= l.minCreditRating) ?? lifestyleLevels[0]

  // Lifestyle choices
  const [housingId, setHousingId] = useState(store.housingId || wealth.housingOptions[0]?.id || '')
  const [clothingId, setClothingId] = useState(store.clothingId || wealth.clothingOptions[0]?.id || '')
  const [transportId, setTransportId] = useState(store.transportId || wealth.transportOptions[0]?.id || '')
  const [lifestyleId, setLifestyleId] = useState(store.lifestyleId || defaultLifestyle.id)
  const [wealthFormId, setWealthFormId] = useState(store.wealthFormId || wealthForms[0]?.id || '')

  const selectedHousing = wealth.housingOptions.find((h) => h.id === housingId) ?? wealth.housingOptions[0]
  const selectedClothing = wealth.clothingOptions.find((c) => c.id === clothingId) ?? wealth.clothingOptions[0]
  const selectedTransport = wealth.transportOptions.find((t) => t.id === transportId) ?? wealth.transportOptions[0]
  const selectedLifestyle = lifestyleLevels.find((l) => l.id === lifestyleId) ?? defaultLifestyle

  // Lifestyle cost: 0 if CR >= minCR, otherwise the cost
  const lifestyleCostValue = creditRating >= selectedLifestyle.minCreditRating ? 0 : selectedLifestyle.cost

  // Budget calculations
  const totalAssets = wealth.assetsNumeric
  const totalLifestyleCost = (selectedHousing?.cost ?? 0) + (selectedClothing?.cost ?? 0) + (selectedTransport?.cost ?? 0) + lifestyleCostValue
  const remainingAssets = Math.max(0, totalAssets - totalLifestyleCost)

  // Cash on hand = bracket's default cash amount (auto, not editable)
  // Capped at remaining assets so we don't go negative on wealth form
  const cashOnHand = Math.min(wealth.cashNumeric, remainingAssets)
  const wealthFormAmount = Math.max(0, remainingAssets - cashOnHand)

  // Equipment
  const [selectedItems, setSelectedItems] = useState<string[]>(store.equipment)
  const [customItems, setCustomItems] = useState<string[]>(store.customItems)
  const [newCustomItem, setNewCustomItem] = useState('')
  const [search, setSearch] = useState('')
  const [showWeapons, setShowWeapons] = useState(false)

  const equipmentByCategory = useMemo(() => getEquipmentByCategory(era), [era])
  const weapons = useMemo(() => getWeaponsForEra(era), [era])

  // Equipment spending — items above lifestyle free threshold cost cash
  const freeThreshold = selectedLifestyle.freeItemThreshold
  const totalSpent = useMemo(() => {
    let sum = 0
    for (const category of Object.values(equipmentByCategory)) {
      for (const item of category) {
        const count = selectedItems.filter((name) => name === item.name).length
        if (count > 0) {
          const price = parsePriceToNumber(item.price)
          if (price > freeThreshold) {
            sum += price * count
          }
        }
      }
    }
    return sum
  }, [selectedItems, equipmentByCategory, freeThreshold])

  const overBudget = totalSpent > cashOnHand

  const handleHousingChange = (id: string) => setHousingId(id)
  const handleClothingChange = (id: string) => setClothingId(id)
  const handleTransportChange = (id: string) => setTransportId(id)
  const handleLifestyleChange = (id: string) => setLifestyleId(id)

  const addItem = (itemName: string) => setSelectedItems((prev) => [...prev, itemName])
  const removeItem = (index: number) => setSelectedItems((prev) => prev.filter((_, i) => i !== index))
  const addCustomItem = () => {
    if (newCustomItem.trim()) {
      setCustomItems((prev) => [...prev, newCustomItem.trim()])
      setNewCustomItem('')
    }
  }
  const removeCustomItem = (index: number) => setCustomItems((prev) => prev.filter((_, i) => i !== index))
  const addWeapon = (weapon: Weapon) => setSelectedItems((prev) => [...prev, `${weapon.name} (${weapon.damage}, ${weapon.range})`])

  const handleNext = () => {
    store.setEquipment(selectedItems)
    store.setCustomItems(customItems)
    store.setLifestyle({
      housingId,
      clothingId,
      transportId,
      lifestyleId,
      wealthFormId,
      cashOnHand,
      cash: formatCurrency(era, cashOnHand),
      assets: formatCurrency(era, totalAssets),
      spendingLevel: selectedLifestyle.label,
    })
    store.nextStep()
  }

  const curr = (n: number) => formatCurrency(era, n)

  return (
    <Card title="Ekwipunek i majątek">
      {/* Section A: Wealth Summary */}
      <div className="bg-coc-accent/10 border border-coc-accent/20 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-xs text-coc-text-muted">Majętność</div>
            <div className="font-medium font-mono">{creditRating}</div>
          </div>
          <div>
            <div className="text-xs text-coc-text-muted">Majątek łączny</div>
            <div className="font-medium">{wealth.assets}</div>
          </div>
        </div>
      </div>

      {/* Section B: Housing */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Home className="w-4 h-4 text-coc-accent-light" />
          <h4 className="text-sm font-medium">Mieszkanie</h4>
        </div>
        <div className="space-y-1.5">
          {wealth.housingOptions.map((opt: HousingOption) => (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                housingId === opt.id
                  ? 'border-coc-accent bg-coc-accent/10'
                  : 'border-coc-border hover:border-coc-accent/50'
              }`}
            >
              <input
                type="radio"
                name="housing"
                value={opt.id}
                checked={housingId === opt.id}
                onChange={() => handleHousingChange(opt.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{opt.label}</span>
                  <Badge variant={opt.ownership === 'own' ? 'success' : opt.ownership === 'rent' ? 'default' : 'warning'}>
                    {opt.ownership === 'own' ? 'własność' : opt.ownership === 'rent' ? 'wynajem' : 'bezpłatne'}
                  </Badge>
                  {opt.cost > 0 && (
                    <span className="text-xs text-coc-text-muted ml-auto">−{curr(opt.cost)}</span>
                  )}
                </div>
                <p className="text-xs text-coc-text-muted">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Section C: Clothing */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shirt className="w-4 h-4 text-coc-accent-light" />
          <h4 className="text-sm font-medium">Ubranie</h4>
        </div>
        <div className="space-y-1.5">
          {wealth.clothingOptions.map((opt: ClothingOption) => (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                clothingId === opt.id
                  ? 'border-coc-accent bg-coc-accent/10'
                  : 'border-coc-border hover:border-coc-accent/50'
              }`}
            >
              <input
                type="radio"
                name="clothing"
                value={opt.id}
                checked={clothingId === opt.id}
                onChange={() => handleClothingChange(opt.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{opt.label}</span>
                  {opt.cost > 0 ? (
                    <span className="text-xs text-coc-text-muted ml-auto">−{curr(opt.cost)}</span>
                  ) : (
                    <Badge variant="warning">darmowe</Badge>
                  )}
                </div>
                <p className="text-xs text-coc-text-muted">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Section D: Transport */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Car className="w-4 h-4 text-coc-accent-light" />
          <h4 className="text-sm font-medium">Transport</h4>
        </div>
        <div className="space-y-1.5">
          {wealth.transportOptions.map((opt: TransportOption) => (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                transportId === opt.id
                  ? 'border-coc-accent bg-coc-accent/10'
                  : 'border-coc-border hover:border-coc-accent/50'
              }`}
            >
              <input
                type="radio"
                name="transport"
                value={opt.id}
                checked={transportId === opt.id}
                onChange={() => handleTransportChange(opt.id)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{opt.label}</span>
                  {opt.cost > 0 ? (
                    <span className="text-xs text-coc-text-muted ml-auto">−{curr(opt.cost)}</span>
                  ) : (
                    <Badge variant="warning">darmowe</Badge>
                  )}
                </div>
                <p className="text-xs text-coc-text-muted">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Section E: Lifestyle */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-coc-accent-light" />
          <h4 className="text-sm font-medium">Styl życia</h4>
        </div>
        <div className="space-y-1.5">
          {lifestyleLevels.map((opt: LifestyleLevel) => {
            const isFree = creditRating >= opt.minCreditRating
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                  lifestyleId === opt.id
                    ? 'border-coc-accent bg-coc-accent/10'
                    : 'border-coc-border hover:border-coc-accent/50'
                }`}
              >
                <input
                  type="radio"
                  name="lifestyle"
                  value={opt.id}
                  checked={lifestyleId === opt.id}
                  onChange={() => handleLifestyleChange(opt.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{opt.label}</span>
                    {isFree ? (
                      <Badge variant="success">darmowe (CR {opt.minCreditRating}+)</Badge>
                    ) : (
                      <span className="text-xs text-coc-text-muted ml-auto">−{curr(opt.cost)} z majątku</span>
                    )}
                  </div>
                  <p className="text-xs text-coc-text-muted">
                    {opt.description} — przedmioty ≤ {curr(opt.freeItemThreshold)} darmowe
                  </p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Section F: Wealth Summary + Form */}
      <div className="mb-4 border border-coc-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Pozostały majątek</h4>
          <Badge variant={remainingAssets > 0 ? 'success' : 'warning'}>
            {curr(remainingAssets)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3 bg-coc-surface-light/50 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-coc-accent-light" />
            <div>
              <div className="text-xs text-coc-text-muted">Gotówka na ręce</div>
              <div className="font-mono font-bold">{curr(cashOnHand)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-coc-text-muted" />
            <div>
              <div className="text-xs text-coc-text-muted">Majątek ulokowany</div>
              <div className="font-mono font-bold">{curr(wealthFormAmount)}</div>
            </div>
          </div>
        </div>

        {wealthFormAmount > 0 && (
          <>
            <p className="text-xs text-coc-text-muted mb-2">
              Gdzie przechowujesz resztę majątku ({curr(wealthFormAmount)})?
            </p>
            <div className="space-y-1.5">
              {wealthForms.map((form) => (
                <label
                  key={form.id}
                  className={`flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                    wealthFormId === form.id
                      ? 'border-coc-accent bg-coc-accent/10'
                      : 'border-coc-border hover:border-coc-accent/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="wealthForm"
                    value={form.id}
                    checked={wealthFormId === form.id}
                    onChange={() => setWealthFormId(form.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{form.label}</span>
                    <p className="text-xs text-coc-text-muted">{form.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        <p className="text-xs text-coc-text-muted mt-2">
          Gotówka na ręce to pieniądze które masz przy sobie — z nich kupujesz ekwipunek.
          Forma majątku to jak przechowujesz resztę — może mieć znaczenie fabularne w grze.
        </p>
      </div>

      {/* Section G: Equipment catalog */}
      <div className="border-t border-coc-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Ekwipunek</h4>
          <Badge variant={overBudget ? 'danger' : 'success'}>
            Wydano: {curr(totalSpent)} / Gotówka: {curr(cashOnHand)}
            {overBudget && ' — Przekroczono budżet!'}
          </Badge>
        </div>

        {/* Selected items */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-coc-text-muted mb-1">
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
                  {filtered.map((item) => {
                    const price = parsePriceToNumber(item.price)
                    const isFree = price <= freeThreshold
                    return (
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
                          <span className={`text-xs ${isFree ? 'text-green-500' : 'text-coc-text-muted'}`}>
                            {isFree ? 'darmowe' : item.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => addItem(item.name)}
                            className="text-coc-accent-light hover:text-coc-accent cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
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
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={() => store.prevStep()}>Wstecz</Button>
        <Button onClick={handleNext}>Dalej</Button>
      </div>
    </Card>
  )
}
