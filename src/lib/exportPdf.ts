import { PDFDocument, StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib'
import { OCCUPATIONS } from '@/data/occupations'
import { getSkillDisplayName, getSkillBase } from '@/data/skills'
import type { CharacteristicKey } from '@/types/common'
import { halfValue, fifthValue } from '@/lib/utils'

const CHAR_KEYS: CharacteristicKey[] = ['STR', 'CON', 'SIZ', 'DEX', 'APP', 'INT', 'POW', 'EDU']

interface ExportCharacter {
  name: string
  age: number
  gender: string
  appearance: string
  characteristics: Record<string, number>
  luck: number
  derived: Record<string, unknown>
  occupation_id: string
  occupation_skill_points: Record<string, number>
  personal_skill_points: Record<string, number>
  backstory: Record<string, string>
  equipment: string[]
  cash: string
  assets: string
  spending_level: string
  era: string
  method: string
}

type Derived = {
  hp: number; mp: number; san: number
  db: string; build: number; move_rate: number; dodge: number
}

/** Strip Polish diacritics for pdf-lib standard fonts. */
function sanitize(text: string): string {
  const map: Record<string, string> = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N',
    'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
  }
  return text.replace(/[^\x00-\x7F]/g, (c) => map[c] ?? c)
}

/** Resolve numeric base for a skill composite key. */
function resolveBase(skillKey: string, chars: Record<string, number>): number {
  const base = getSkillBase(skillKey)
  if (base === 'half_dex') return Math.floor((chars['DEX'] ?? 0) / 2)
  if (base === 'edu') return chars['EDU'] ?? 0
  return base
}

function generateTextPdf(pdfDoc: PDFDocument, char: ExportCharacter, font: PDFFont) {
  const occupation = OCCUPATIONS.find((o) => o.id === char.occupation_id)
  const derived = char.derived as Derived

  let currentPage: PDFPage = pdfDoc.addPage([595, 842])
  let y = currentPage.getSize().height - 50

  const ensureSpace = (needed: number) => {
    if (y < needed) {
      currentPage = pdfDoc.addPage([595, 842])
      y = currentPage.getSize().height - 50
    }
  }
  const text = (t: string, x: number, yPos: number, size = 10) => {
    currentPage.drawText(sanitize(t), { x, y: yPos, size, font })
  }

  text('KARTA BADACZA - Zew Cthulhu 7e', 50, y, 16); y -= 30
  text(`Imie: ${char.name}`, 50, y)
  text(`Wiek: ${char.age}   Plec: ${char.gender === 'M' ? 'Mezczyzna' : char.gender === 'F' ? 'Kobieta' : char.gender}`, 350, y); y -= 15
  text(`Zawod: ${occupation?.name ?? char.occupation_id}`, 50, y); y -= 25

  text('CECHY', 50, y, 12); y -= 18
  for (const key of CHAR_KEYS) {
    const val = char.characteristics[key] ?? 0
    text(`${key}: ${val}  (1/2: ${halfValue(val)}, 1/5: ${fifthValue(val)})`, 50, y); y -= 14
  }
  y -= 10

  if (derived) {
    text('ATRYBUTY POCHODNE', 50, y, 12); y -= 18
    text(`PW: ${derived.hp}  PM: ${derived.mp}  PP: ${derived.san}  Szczescie: ${char.luck}`, 50, y); y -= 14
    text(`PO: ${derived.db}  Krzepa: ${derived.build}  Ruch: ${derived.move_rate}  Unik: ${derived.dodge}`, 50, y); y -= 20
  }

  text('UMIEJETNOSCI', 50, y, 12); y -= 18
  const allPts: Record<string, number> = { ...char.occupation_skill_points }
  for (const [id, pts] of Object.entries(char.personal_skill_points)) {
    allPts[id] = (allPts[id] ?? 0) + pts
  }
  const entries = Object.entries(allPts).filter(([, p]) => p > 0)
    .sort(([a], [b]) => getSkillDisplayName(a).localeCompare(getSkillDisplayName(b), 'pl'))

  let col = 0
  for (const [sid, pts] of entries) {
    ensureSpace(50)
    if (y === currentPage.getSize().height - 50) { text('UMIEJETNOSCI (cd.)', 50, y, 12); y -= 18; col = 0 }
    const total = resolveBase(sid, char.characteristics) + pts
    const x = col === 0 ? 50 : 310
    text(`${getSkillDisplayName(sid)}: ${total}%`, x, y, 9)
    if (col === 1) { y -= 13; col = 0 } else { col = 1 }
  }
  if (col === 1) y -= 13

  // Backstory
  const bsLabels: Record<string, string> = {
    ideology: 'Ideologia / Przekonania', significant_people_who: 'Wazne osoby - Kto',
    significant_people_why: 'Wazne osoby - Dlaczego', meaningful_locations: 'Znaczace miejsca',
    treasured_possessions: 'Rzeczy osobiste', traits: 'Przymioty',
    appearance_description: 'Opis postaci', key_connection: 'Kluczowa wiez',
  }
  const bsEntries = Object.entries(char.backstory).filter(([, v]) => v)
  if (bsEntries.length > 0) {
    y -= 10; ensureSpace(80); text('HISTORIA POSTACI', 50, y, 12); y -= 18
    for (const [key, value] of bsEntries) {
      ensureSpace(50); text(`${bsLabels[key] ?? key}:`, 50, y, 9); y -= 13
      const lines = value.match(/.{1,80}/g) ?? [value]
      for (const line of lines) { ensureSpace(30); text(`  ${line}`, 60, y, 8); y -= 11 }
      y -= 4
    }
  }

  // Equipment
  if (char.equipment.length > 0) {
    y -= 10; ensureSpace(80); text('EKWIPUNEK', 50, y, 12); y -= 18
    if (char.cash) { text(`Gotowka: ${char.cash}  Majatek: ${char.assets}`, 50, y); y -= 14 }
    if (char.spending_level) { text(`Poziom zycia: ${char.spending_level}`, 50, y); y -= 14 }
    for (const item of char.equipment) { ensureSpace(30); text(`- ${item}`, 60, y, 9); y -= 13 }
  }
}

// ============================================================
//  Main export function
// ============================================================

export async function exportCharacterAsPdf(char: ExportCharacter): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  generateTextPdf(pdfDoc, char, font)
  return pdfDoc.save()
}
