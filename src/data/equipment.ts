import type { Era } from '@/types/common'

export interface EquipmentItem {
  id: string
  name: string
  category: string
  price: string
  era?: Era[]
  description?: string
}

export const EQUIPMENT_CATEGORIES = [
  'Światło',
  'Obserwacja',
  'Fotografia',
  'Komunikacja',
  'Medycyna',
  'Narzędzia',
  'Różne',
] as const

export const EQUIPMENT_CATALOG: EquipmentItem[] = [
  // === Światło ===
  { id: 'flara', name: 'Flara (6 szt.)', category: 'Światło', price: '1 $', description: 'Świeci 1 godzinę' },
  { id: 'lampa_naftowa', name: 'Lampa naftowa', category: 'Światło', price: '2 $', description: 'Przenośna lampa' },
  { id: 'latarka', name: 'Latarka elektryczna', category: 'Światło', price: '3 $', era: ['classic_1920s', 'modern'] },
  { id: 'lampa_karbidowa', name: 'Lampa karbidowa', category: 'Światło', price: '3 $', era: ['classic_1920s', 'gaslight'] },
  { id: 'lampa_gazowa', name: 'Lampa gazowa', category: 'Światło', price: '5 $', era: ['gaslight', 'classic_1920s'] },
  { id: 'pochodnia', name: 'Pochodnia', category: 'Światło', price: '0,50 $' },

  // === Obserwacja ===
  { id: 'lornetka', name: 'Lornetka', category: 'Obserwacja', price: '15 $' },
  { id: 'lornetka_pryzmatyczna', name: 'Lornetka pryzmatyczna', category: 'Obserwacja', price: '25 $', era: ['classic_1920s', 'modern'] },
  { id: 'luneta', name: 'Luneta', category: 'Obserwacja', price: '10 $' },
  { id: 'kompas', name: 'Kompas', category: 'Obserwacja', price: '2 $' },
  { id: 'lupa', name: 'Lupa', category: 'Obserwacja', price: '1 $' },

  // === Fotografia ===
  { id: 'aparat_prosty', name: 'Aparat fotograficzny (prosty)', category: 'Fotografia', price: '5 $', era: ['classic_1920s'] },
  { id: 'aparat_skladany', name: 'Aparat składany Kodak', category: 'Fotografia', price: '15 $', era: ['classic_1920s'] },
  { id: 'aparat_profesjonalny', name: 'Aparat profesjonalny', category: 'Fotografia', price: '50 $' },
  { id: 'klisze', name: 'Klisze fotograficzne (12 szt.)', category: 'Fotografia', price: '1 $' },
  { id: 'aparat_cyfrowy', name: 'Aparat cyfrowy', category: 'Fotografia', price: '200 $', era: ['modern'] },

  // === Komunikacja ===
  { id: 'telefon_polowy', name: 'Telefon polowy', category: 'Komunikacja', price: '30 $', era: ['classic_1920s'] },
  { id: 'radioodbiornik', name: 'Radioodbiornik', category: 'Komunikacja', price: '75 $', era: ['classic_1920s'] },
  { id: 'telefon_komorkowy', name: 'Telefon komórkowy', category: 'Komunikacja', price: '200 $', era: ['modern'] },
  { id: 'laptop', name: 'Laptop', category: 'Komunikacja', price: '500 $', era: ['modern'] },
  { id: 'walkie_talkie', name: 'Walkie-talkie (para)', category: 'Komunikacja', price: '50 $', era: ['modern'] },

  // === Medycyna ===
  { id: 'torba_lekarska', name: 'Torba lekarska', category: 'Medycyna', price: '25 $', description: '+20% do Pierwszej Pomocy' },
  { id: 'apteczka', name: 'Apteczka', category: 'Medycyna', price: '5 $' },
  { id: 'bandaze', name: 'Bandaże (10 szt.)', category: 'Medycyna', price: '1 $' },
  { id: 'morfina', name: 'Morfina (dawka)', category: 'Medycyna', price: '2 $', era: ['classic_1920s', 'gaslight'] },
  { id: 'chloroform', name: 'Chloroform', category: 'Medycyna', price: '3 $', era: ['classic_1920s', 'gaslight'] },

  // === Narzędzia ===
  { id: 'lina_10m', name: 'Lina (10 m)', category: 'Narzędzia', price: '2 $' },
  { id: 'lina_30m', name: 'Lina (30 m)', category: 'Narzędzia', price: '5 $' },
  { id: 'wytrychy', name: 'Wytrychy', category: 'Narzędzia', price: '10 $' },
  { id: 'zestaw_narzedzi', name: 'Zestaw narzędzi', category: 'Narzędzia', price: '15 $' },
  { id: 'lom', name: 'Łom', category: 'Narzędzia', price: '2 $' },
  { id: 'kajdanki', name: 'Kajdanki', category: 'Narzędzia', price: '10 $' },
  { id: 'klocek_drewniany', name: 'Kłódka z kluczem', category: 'Narzędzia', price: '3 $' },
  { id: 'noz', name: 'Nóż', category: 'Narzędzia', price: '1 $' },

  // === Różne ===
  { id: 'plecak', name: 'Plecak', category: 'Różne', price: '3 $' },
  { id: 'namiot', name: 'Namiot (2-osobowy)', category: 'Różne', price: '10 $' },
  { id: 'spiworek', name: 'Śpiwór', category: 'Różne', price: '5 $' },
  { id: 'manierkka', name: 'Manierka', category: 'Różne', price: '1 $' },
  { id: 'notes_i_olowek', name: 'Notes i ołówek', category: 'Różne', price: '0,25 $' },
  { id: 'zegarek_kieszonkowy', name: 'Zegarek kieszonkowy', category: 'Różne', price: '10 $', era: ['classic_1920s', 'gaslight'] },
  { id: 'zegarek_reczny', name: 'Zegarek na rękę', category: 'Różne', price: '15 $', era: ['classic_1920s', 'modern'] },
  { id: 'zapałki', name: 'Zapałki (pudełko)', category: 'Różne', price: '0,05 $' },
  { id: 'zapalniczka', name: 'Zapalniczka', category: 'Różne', price: '1 $', era: ['classic_1920s', 'modern'] },
  { id: 'papier_listowy', name: 'Papier listowy i koperty', category: 'Różne', price: '0,50 $' },
  { id: 'gazeta', name: 'Gazeta', category: 'Różne', price: '0,05 $' },
  { id: 'rower', name: 'Rower', category: 'Różne', price: '30 $' },
]

export function getEquipmentForEra(era: Era): EquipmentItem[] {
  return EQUIPMENT_CATALOG.filter((item) => !item.era || item.era.includes(era))
}

export function getEquipmentByCategory(era: Era): Record<string, EquipmentItem[]> {
  const items = getEquipmentForEra(era)
  const grouped: Record<string, EquipmentItem[]> = {}
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  }
  return grouped
}
