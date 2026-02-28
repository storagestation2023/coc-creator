import { useState, useMemo } from 'react'
import { Plus, Trash2, Search, Home, Shirt, Wallet, Building2, TrendingUp } from 'lucide-react'
import { useCharacterStore } from '@/stores/characterStore'
import { getEquipmentByCategory } from '@/data/equipment'
import { getWeaponsForEra, type Weapon } from '@/data/weapons'
import { getWealthBracket, formatCurrency, type HousingOption, type ClothingOption } from '@/data/eras'
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

  // Lifestyle choices
  const [housingId, setHousingId] = useState(store.housingId || wealth.housingOptions[0]?.id || '')
  const [clothingId, setClothingId] = useState(store.clothingId || wealth.clothingOptions[0]?.id || '')

  const selectedHousing = wealth.housingOptions.find((h) => h.id === housingId) ?? wealth.housingOptions[0]
  const selectedClothing = wealth.clothingOptions.find((c) => c.id === clothingId) ?? wealth.clothingOptions[0]

  // Budget calculations
  const totalAssets = wealth.assetsNumeric
  const lifestyleCost = (selectedHousing?.cost ?? 0) + (selectedClothing?.cost ?? 0)
  const remainingAssets = Math.max(0, totalAssets - lifestyleCost)

  // Asset allocation
  const [cashOnHand, setCashOnHand] = useState(store.cashOnHand || Math.round(remainingAssets * 0.6))
  const [bankSavings, setBankSavings] = useState(store.bankSavings || Math.round(remainingAssets * 0.3))
  const [investments, setInvestments] = useState(store.investments || Math.max(0, remainingAssets - Math.round(remainingAssets * 0.6) - Math.round(remainingAssets * 0.3)))

  // Equipment
  const [selectedItems, setSelectedItems] = useState<string[]>(store.equipment)
  const [customItems, setCustomItems] = useState<string[]>(store.customItems)
  const [newCustomItem, setNewCustomItem] = useState('')
  const [search, setSearch] = useState('')
  const [showWeapons, setShowWeapons] = useState(false)

  const equipmentByCategory = useMemo(() => getEquipmentByCategory(era), [era])
  const weapons = useMemo(() => getWeaponsForEra(era), [era])

  // Equipment spending from cash on hand
  const totalSpent = useMemo(() => {
    let sum = 0
    for (const category of Object.values(equipmentByCategory)) {
      for (const item of category) {
        const count = selectedItems.filter((name) => name === item.name).length
        if (count > 0) {
          const price = parsePriceToNumber(item.price)
          // Items below spending level are free
          if (price > wealth.spendingLevelNumeric) {
            sum += price * count
          }
        }
      }
    }
    return sum
  }, [selectedItems, equipmentByCategory, wealth.spendingLevelNumeric])

  const overBudget = totalSpent > cashOnHand
  const allocationTotal = cashOnHand + bankSavings + investments
  const allocationValid = Math.abs(allocationTotal - remainingAssets) <= 1

  // Recalculate allocation when lifestyle changes
  const handleHousingChange = (id: string) => {
    setHousingId(id)
    const newHousing = wealth.housingOptions.find((h) => h.id === id)
    const newRemaining = Math.max(0, totalAssets - (newHousing?.cost ?? 0) - (selectedClothing?.cost ?? 0))
    redistributeAllocation(newRemaining)
  }

  const handleClothingChange = (id: string) => {
    setClothingId(id)
    const newClothing = wealth.clothingOptions.find((c) => c.id === id)
    const newRemaining = Math.max(0, totalAssets - (selectedHousing?.cost ?? 0) - (newClothing?.cost ?? 0))
    redistributeAllocation(newRemaining)
  }

  const redistributeAllocation = (total: number) => {
    const c = Math.round(total * 0.6)
    const b = Math.round(total * 0.3)
    const inv = Math.max(0, total - c - b)
    setCashOnHand(c)
    setBankSavings(b)
    setInvestments(inv)
  }

  const handleAllocationPreset = (preset: 'cash' | 'balanced' | 'invested') => {
    if (preset === 'cash') {
      setCashOnHand(remainingAssets)
      setBankSavings(0)
      setInvestments(0)
    } else if (preset === 'balanced') {
      redistributeAllocation(remainingAssets)
    } else {
      const c = Math.round(remainingAssets * 0.2)
      const b = Math.round(remainingAssets * 0.2)
      setInvestments(Math.max(0, remainingAssets - c - b))
      setCashOnHand(c)
      setBankSavings(b)
    }
  }

  const handleAllocationChange = (field: 'cash' | 'bank' | 'invest', value: number) => {
    const v = Math.max(0, Math.round(value))
    if (field === 'cash') {
      setCashOnHand(v)
      const leftover = Math.max(0, remainingAssets - v)
      const bRatio = bankSavings / (bankSavings + investments || 1)
      setBankSavings(Math.round(leftover * bRatio))
      setInvestments(Math.max(0, leftover - Math.round(leftover * bRatio)))
    } else if (field === 'bank') {
      setBankSavings(v)
      const leftover = Math.max(0, remainingAssets - v)
      const cRatio = cashOnHand / (cashOnHand + investments || 1)
      setCashOnHand(Math.round(leftover * cRatio))
      setInvestments(Math.max(0, leftover - Math.round(leftover * cRatio)))
    } else {
      setInvestments(v)
      const leftover = Math.max(0, remainingAssets - v)
      const cRatio = cashOnHand / (cashOnHand + bankSavings || 1)
      setCashOnHand(Math.round(leftover * cRatio))
      setBankSavings(Math.max(0, leftover - Math.round(leftover * cRatio)))
    }
  }

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
      cashOnHand,
      bankSavings,
      investments,
      cash: formatCurrency(era, cashOnHand),
      assets: formatCurrency(era, totalAssets),
      spendingLevel: wealth.spendingLevel,
    })
    store.nextStep()
  }

  const curr = (n: number) => formatCurrency(era, n)

  return (
    <Card title="Ekwipunek i majątek">
      {/* Section A: Wealth Summary */}
      <div className="bg-coc-accent/10 border border-coc-accent/20 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <div className="text-xs text-coc-text-muted">Majętność</div>
            <div className="font-medium font-mono">{creditRating}</div>
          </div>
          <div>
            <div className="text-xs text-coc-text-muted">Majątek łączny</div>
            <div className="font-medium">{wealth.assets}</div>
          </div>
          <div>
            <div className="text-xs text-coc-text-muted">Poziom życia</div>
            <div className="font-medium">{wealth.spendingLevel}/dzień</div>
          </div>
        </div>
        <p className="text-xs text-coc-text-muted mt-2">
          Przedmioty za ≤ {wealth.spendingLevel} nie obciążają Twojej gotówki (drobne wydatki dnia codziennego).
        </p>
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
        <div className="flex flex-wrap gap-2">
          {wealth.clothingOptions.map((opt: ClothingOption) => (
            <label
              key={opt.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
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
                className="sr-only"
              />
              <div>
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-coc-text-muted">
                  {opt.cost > 0 ? `−${curr(opt.cost)}` : 'darmowe'}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Section D: Asset Allocation */}
      <div className="mb-4 border border-coc-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Podział pozostałego majątku</h4>
          <Badge variant={allocationValid ? 'success' : 'danger'}>
            Pozostało: {curr(remainingAssets)}
          </Badge>
        </div>

        <div className="flex gap-1 mb-3">
          <Button size="sm" variant={cashOnHand === remainingAssets ? 'primary' : 'secondary'} onClick={() => handleAllocationPreset('cash')}>
            Gotówka
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleAllocationPreset('balanced')}>
            Zrównoważone
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleAllocationPreset('invested')}>
            Zainwestowane
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-coc-text-muted flex-shrink-0" />
            <label className="text-sm w-36 flex-shrink-0">Gotówka na ręce</label>
            <input
              type="number"
              min={0}
              max={remainingAssets}
              value={cashOnHand}
              onChange={(e) => handleAllocationChange('cash', Number(e.target.value))}
              className="flex-1 px-2 py-1 text-sm bg-coc-surface-light border border-coc-border rounded text-coc-text font-mono text-right"
            />
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-coc-text-muted flex-shrink-0" />
            <label className="text-sm w-36 flex-shrink-0">Oszczędności w banku</label>
            <input
              type="number"
              min={0}
              max={remainingAssets}
              value={bankSavings}
              onChange={(e) => handleAllocationChange('bank', Number(e.target.value))}
              className="flex-1 px-2 py-1 text-sm bg-coc-surface-light border border-coc-border rounded text-coc-text font-mono text-right"
            />
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-coc-text-muted flex-shrink-0" />
            <label className="text-sm w-36 flex-shrink-0">Inwestycje</label>
            <input
              type="number"
              min={0}
              max={remainingAssets}
              value={investments}
              onChange={(e) => handleAllocationChange('invest', Number(e.target.value))}
              className="flex-1 px-2 py-1 text-sm bg-coc-surface-light border border-coc-border rounded text-coc-text font-mono text-right"
            />
          </div>
        </div>

        <p className="text-xs text-coc-text-muted mt-2">
          Gotówka = pieniądze przy sobie (do wydania na ekwipunek). Oszczędności w banku wymagają wizyty.
          Inwestycje to majątek długoterminowy, nie można go szybko spieniężyć.
        </p>
      </div>

      {/* Section E: Equipment catalog */}
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
                    const isFree = price <= wealth.spendingLevelNumeric
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
