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
  'Transport',
  'Ubranie',
  'Biżuteria i akcesoria',
  'Światło',
  'Obserwacja',
  'Fotografia',
  'Komunikacja',
  'Medycyna',
  'Narzędzia',
  'Różne',
] as const

export const EQUIPMENT_CATALOG: EquipmentItem[] = [
  // === Transport ===
  { id: 'ford_model_t', name: 'Ford Model T (1920)', category: 'Transport', price: '260 $', era: ['classic_1920s'] },
  { id: 'chevrolet_490', name: 'Chevrolet 490 (1922)', category: 'Transport', price: '525 $', era: ['classic_1920s'] },
  { id: 'dodge_touring', name: 'Dodge Brothers Touring (1923)', category: 'Transport', price: '1000 $', era: ['classic_1920s'] },
  { id: 'buick_master_six', name: 'Buick Master Six (1925)', category: 'Transport', price: '1500 $', era: ['classic_1920s'] },
  { id: 'packard_six', name: 'Packard Six (1928)', category: 'Transport', price: '2500 $', era: ['classic_1920s'] },
  { id: 'cadillac_v8', name: 'Cadillac V-8 (1927)', category: 'Transport', price: '3350 $', era: ['classic_1920s'] },
  { id: 'lincoln_model_l', name: 'Lincoln Model L (1924)', category: 'Transport', price: '4600 $', era: ['classic_1920s'] },
  { id: 'motocykl_indian', name: 'Motocykl Indian Scout (1926)', category: 'Transport', price: '275 $', era: ['classic_1920s'] },
  { id: 'rower_transport', name: 'Rower', category: 'Transport', price: '30 $' },
  { id: 'kon_z_siodlem', name: 'Koń z siodłem', category: 'Transport', price: '150 $', era: ['classic_1920s', 'gaslight'] },
  { id: 'powoz', name: 'Powóz', category: 'Transport', price: '200 $', era: ['gaslight'] },

  // === Ubranie ===
  { id: 'ubranie_kiepskie', name: 'Ubranie kiepskiej jakości', category: 'Ubranie', price: '0 $', description: 'Zniszczone, łatane ubranie' },
  { id: 'ubranie_przecietne', name: 'Ubranie przeciętne', category: 'Ubranie', price: '15 $', description: 'Typowe ubranie robotnika lub urzędnika' },
  { id: 'ubranie_dobre', name: 'Ubranie dobrej jakości', category: 'Ubranie', price: '50 $', description: 'Dobrze skrojone, solidne materiały' },
  { id: 'ubranie_znakomite', name: 'Ubranie znakomitej jakości', category: 'Ubranie', price: '150 $', description: 'Szycie na miarę, najlepsze tkaniny' },
  { id: 'garnitur_wieczorowy', name: 'Garnitur wieczorowy / suknia wieczorowa', category: 'Ubranie', price: '75 $', description: 'Strój na oficjalne okazje' },

  // === Biżuteria i akcesoria ===
  { id: 'zegarek_kieszk_prosty', name: 'Zegarek kieszonkowy (prosty)', category: 'Biżuteria i akcesoria', price: '5 $', era: ['classic_1920s', 'gaslight'] },
  { id: 'zegarek_kieszk_srebrny', name: 'Zegarek kieszonkowy (srebrny)', category: 'Biżuteria i akcesoria', price: '25 $', era: ['classic_1920s', 'gaslight'] },
  { id: 'zegarek_kieszk_zloty', name: 'Zegarek kieszonkowy (złoty)', category: 'Biżuteria i akcesoria', price: '100 $', era: ['classic_1920s', 'gaslight'] },
  { id: 'zegarek_na_reke', name: 'Zegarek na rękę', category: 'Biżuteria i akcesoria', price: '15 $', era: ['classic_1920s', 'modern'] },
  { id: 'obraczka', name: 'Obrączka', category: 'Biżuteria i akcesoria', price: '10 $' },
  { id: 'pierscien', name: 'Pierścień z kamieniem', category: 'Biżuteria i akcesoria', price: '50 $' },
  { id: 'naszyjnik', name: 'Naszyjnik', category: 'Biżuteria i akcesoria', price: '25 $' },
  { id: 'broszka', name: 'Broszka', category: 'Biżuteria i akcesoria', price: '10 $' },
  { id: 'spinki_mankietow', name: 'Spinki do mankietów', category: 'Biżuteria i akcesoria', price: '5 $' },
  { id: 'laska_spacerowa', name: 'Laska spacerowa', category: 'Biżuteria i akcesoria', price: '5 $' },
  { id: 'kapelusz', name: 'Kapelusz (fedora/cloche)', category: 'Biżuteria i akcesoria', price: '5 $', era: ['classic_1920s'] },
  { id: 'parasol', name: 'Parasol', category: 'Biżuteria i akcesoria', price: '3 $' },

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
  { id: 'zapałki', name: 'Zapałki (pudełko)', category: 'Różne', price: '0,05 $' },
  { id: 'zapalniczka', name: 'Zapalniczka', category: 'Różne', price: '1 $', era: ['classic_1920s', 'modern'] },
  { id: 'papier_listowy', name: 'Papier listowy i koperty', category: 'Różne', price: '0,50 $' },
  { id: 'gazeta', name: 'Gazeta', category: 'Różne', price: '0,05 $' },
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

