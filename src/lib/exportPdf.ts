import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { OCCUPATIONS } from '@/data/occupations'
import { getSkillDisplayName, getSkillBase } from '@/data/skills'
import { WEAPONS } from '@/data/weapons'
import type { CharacteristicKey } from '@/types/common'
import { halfValue, fifthValue } from '@/lib/utils'

const CHAR_LABELS: Record<CharacteristicKey, string> = {
  STR: 'S', CON: 'KON', SIZ: 'BC', DEX: 'ZR', APP: 'WYG', INT: 'INT', POW: 'MOC', EDU: 'WYK',
}

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

function sanitize(text: string): string {
  const map: Record<string, string> = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N',
    'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
  }
  return text.replace(/[^\x00-\x7F]/g, (c) => map[c] ?? c)
}

function resolveBase(skillKey: string, chars: Record<string, number>): number {
  const base = getSkillBase(skillKey)
  if (base === 'half_dex') return Math.floor((chars['DEX'] ?? 0) / 2)
  if (base === 'edu') return chars['EDU'] ?? 0
  return base
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = sanitize(text).split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

// ============================================================
//  Layout constants
// ============================================================
const W = 595
const H = 842
const M = 36        // page margin
const CW = W - 2 * M // content width = 523

const DARK = rgb(0.15, 0.15, 0.15)
const MID = rgb(0.4, 0.4, 0.4)
const LIGHT = rgb(0.85, 0.85, 0.85)
const ACCENT = rgb(0.2, 0.35, 0.2)

// ============================================================
//  Drawing primitives
// ============================================================

function sectionHeader(page: PDFPage, title: string, x: number, y: number, w: number, font: PDFFont): number {
  page.drawRectangle({ x, y: y - 14, width: w, height: 14, color: ACCENT })
  page.drawText(sanitize(title), { x: x + 4, y: y - 11, size: 9, font, color: rgb(1, 1, 1) })
  return y - 14
}

function labelValue(page: PDFPage, label: string, value: string, x: number, y: number, font: PDFFont, fontBold: PDFFont, labelW = 60) {
  page.drawText(sanitize(label), { x, y, size: 8, font, color: MID })
  page.drawText(sanitize(value), { x: x + labelW, y, size: 9, font: fontBold, color: DARK })
}

function drawBox(page: PDFPage, x: number, y: number, w: number, h: number) {
  page.drawRectangle({ x, y, width: w, height: h, borderColor: LIGHT, borderWidth: 0.5, color: rgb(0.97, 0.97, 0.97) })
}

function textInBox(page: PDFPage, text: string, x: number, y: number, w: number, h: number, font: PDFFont, size: number, bold = false) {
  drawBox(page, x, y, w, h)
  const s = sanitize(text)
  const tw = font.widthOfTextAtSize(s, size)
  page.drawText(s, { x: x + (w - tw) / 2, y: y + (h - size) / 2, size, font, color: bold ? DARK : MID })
}

// ============================================================
//  Page builders
// ============================================================

function buildPage1(page: PDFPage, font: PDFFont, fontBold: PDFFont, char: ExportCharacter, derived: Derived) {
  let y = H - M

  // ── Title bar ──
  page.drawRectangle({ x: M, y: y - 22, width: CW, height: 22, color: DARK })
  page.drawText('KARTA BADACZA  -  Zew Cthulhu 7ed', { x: M + 6, y: y - 17, size: 11, font: fontBold, color: rgb(1, 1, 1) })
  const eraLabel = char.era === 'classic_1920s' ? '1920s' : char.era === 'modern' ? 'Wspolczesnosc' : char.era
  page.drawText(sanitize(eraLabel), { x: M + CW - 60, y: y - 17, size: 9, font, color: rgb(0.7, 0.7, 0.7) })
  y -= 30

  // ── Personal info ──
  const occupation = OCCUPATIONS.find((o) => o.id === char.occupation_id)
  const sexLabel = char.gender === 'M' ? 'Mezczyzna' : char.gender === 'F' ? 'Kobieta' : char.gender

  labelValue(page, 'Imie:', char.name, M, y, font, fontBold, 32)
  labelValue(page, 'Wiek:', String(char.age), M + 280, y, font, fontBold, 30)
  labelValue(page, 'Plec:', sanitize(sexLabel), M + 370, y, font, fontBold, 28)
  y -= 14
  labelValue(page, 'Zawod:', occupation?.name ?? char.occupation_id, M, y, font, fontBold, 38)
  y -= 20

  // ── Characteristics ──
  y = sectionHeader(page, 'CECHY', M, y, CW, fontBold)
  y -= 4

  // Header row
  const charColW = 62
  const charX0 = M + 2
  const labels = ['', 'Wartosc', '1/2', '1/5']
  for (let i = 0; i < labels.length; i++) {
    page.drawText(labels[i], { x: charX0 + i * charColW + (i === 0 ? 0 : 16), y: y - 9, size: 6, font, color: MID })
  }
  y -= 12

  // Characteristic rows (2 columns of 4)
  const charRowH = 16
  const drawCharRow = (key: CharacteristicKey, cx: number, cy: number) => {
    const val = char.characteristics[key] ?? 0
    page.drawText(CHAR_LABELS[key], { x: cx, y: cy - 11, size: 9, font: fontBold, color: DARK })
    textInBox(page, String(val), cx + 30, cy - 14, 30, charRowH, fontBold, 10, true)
    textInBox(page, String(halfValue(val)), cx + 64, cy - 14, 26, charRowH, font, 8)
    textInBox(page, String(fifthValue(val)), cx + 94, cy - 14, 26, charRowH, font, 8)
  }

  const leftKeys: CharacteristicKey[] = ['STR', 'CON', 'SIZ', 'DEX']
  const rightKeys: CharacteristicKey[] = ['APP', 'INT', 'POW', 'EDU']

  for (let i = 0; i < 4; i++) {
    drawCharRow(leftKeys[i], M + 2, y)
    drawCharRow(rightKeys[i], M + 140, y)

    // Derived stats in third column
    if (i === 0) { labelValue(page, 'PW:', String(derived.hp), M + 290, y - 10, font, fontBold, 22); labelValue(page, 'PP:', String(derived.san), M + 350, y - 10, font, fontBold, 22) }
    if (i === 1) { labelValue(page, 'PM:', String(derived.mp), M + 290, y - 10, font, fontBold, 22); labelValue(page, 'Szczescie:', String(char.luck), M + 350, y - 10, font, fontBold, 55) }
    if (i === 2) { labelValue(page, 'PO:', String(derived.db), M + 290, y - 10, font, fontBold, 22); labelValue(page, 'Krzepa:', String(derived.build), M + 350, y - 10, font, fontBold, 42) }
    if (i === 3) { labelValue(page, 'Ruch:', String(derived.move_rate), M + 290, y - 10, font, fontBold, 32); labelValue(page, 'Unik:', String(derived.dodge), M + 350, y - 10, font, fontBold, 32) }

    y -= charRowH + 2
  }

  y -= 6

  // ── Skills ──
  y = sectionHeader(page, 'UMIEJETNOSCI', M, y, CW, fontBold)
  y -= 2

  const allPts: Record<string, number> = { ...char.occupation_skill_points }
  for (const [id, pts] of Object.entries(char.personal_skill_points)) {
    allPts[id] = (allPts[id] ?? 0) + pts
  }
  const skillEntries = Object.entries(allPts)
    .filter(([, p]) => p > 0)
    .map(([sid, pts]) => ({
      name: getSkillDisplayName(sid),
      total: resolveBase(sid, char.characteristics) + pts,
      half: halfValue(resolveBase(sid, char.characteristics) + pts),
      fifth: fifthValue(resolveBase(sid, char.characteristics) + pts),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'))

  // Skill header
  const skillColW = CW / 2
  for (let c = 0; c < 2; c++) {
    const sx = M + c * skillColW
    page.drawText('Umiejetnosc', { x: sx + 2, y: y - 8, size: 6, font, color: MID })
    page.drawText('%', { x: sx + skillColW - 52, y: y - 8, size: 6, font, color: MID })
    page.drawText('1/2', { x: sx + skillColW - 36, y: y - 8, size: 6, font, color: MID })
    page.drawText('1/5', { x: sx + skillColW - 18, y: y - 8, size: 6, font, color: MID })
  }
  y -= 10

  const skillRowH = 12
  const midIdx = Math.ceil(skillEntries.length / 2)

  for (let i = 0; i < midIdx; i++) {
    if (y - skillRowH < M + 10) break // safety

    for (let c = 0; c < 2; c++) {
      const idx = c === 0 ? i : i + midIdx
      if (idx >= skillEntries.length) continue
      const s = skillEntries[idx]
      const sx = M + c * skillColW

      if (i % 2 === 0) {
        page.drawRectangle({ x: sx, y: y - skillRowH, width: skillColW - 4, height: skillRowH, color: rgb(0.95, 0.95, 0.95) })
      }

      page.drawText(sanitize(s.name), { x: sx + 2, y: y - skillRowH + 3, size: 7, font, color: DARK })
      page.drawText(String(s.total), { x: sx + skillColW - 54, y: y - skillRowH + 3, size: 7, font: fontBold, color: DARK })
      page.drawText(String(s.half), { x: sx + skillColW - 36, y: y - skillRowH + 3, size: 7, font, color: MID })
      page.drawText(String(s.fifth), { x: sx + skillColW - 18, y: y - skillRowH + 3, size: 7, font, color: MID })
    }
    y -= skillRowH
  }

  y -= 8

  // ── Weapons ──
  const weaponItems: { name: string; skill: number; damage: string; range: string }[] = []
  for (const item of char.equipment) {
    const matched = WEAPONS.find((w) => item.startsWith(w.name))
    if (matched) {
      const invested = (char.occupation_skill_points[matched.skill_id] ?? 0) + (char.personal_skill_points[matched.skill_id] ?? 0)
      const base = resolveBase(matched.skill_id, char.characteristics)
      weaponItems.push({ name: matched.name, skill: base + invested, damage: matched.damage, range: matched.range })
    }
  }

  if (weaponItems.length > 0 && y > M + 60) {
    y = sectionHeader(page, 'UZBROJENIE', M, y, CW, fontBold)
    y -= 2
    page.drawText('Bron', { x: M + 2, y: y - 8, size: 6, font, color: MID })
    page.drawText('Zwykly', { x: M + 170, y: y - 8, size: 6, font, color: MID })
    page.drawText('Trudny', { x: M + 210, y: y - 8, size: 6, font, color: MID })
    page.drawText('Ekstr.', { x: M + 250, y: y - 8, size: 6, font, color: MID })
    page.drawText('Obrazenia', { x: M + 290, y: y - 8, size: 6, font, color: MID })
    page.drawText('Zasieg', { x: M + 370, y: y - 8, size: 6, font, color: MID })
    y -= 10

    for (const w of weaponItems) {
      if (y - 12 < M) break
      page.drawText(sanitize(w.name), { x: M + 2, y: y - 10, size: 7, font, color: DARK })
      page.drawText(String(w.skill), { x: M + 175, y: y - 10, size: 7, font: fontBold, color: DARK })
      page.drawText(String(halfValue(w.skill)), { x: M + 215, y: y - 10, size: 7, font, color: MID })
      page.drawText(String(fifthValue(w.skill)), { x: M + 255, y: y - 10, size: 7, font, color: MID })
      page.drawText(sanitize(w.damage), { x: M + 290, y: y - 10, size: 7, font, color: DARK })
      page.drawText(sanitize(w.range), { x: M + 370, y: y - 10, size: 7, font, color: DARK })
      y -= 12
    }
  }

  // ── Combat stats footer ──
  if (y > M + 20) {
    y -= 4
    page.drawLine({ start: { x: M, y }, end: { x: M + CW, y }, thickness: 0.5, color: LIGHT })
    y -= 12
    page.drawText(sanitize(`Modyfikator Obrazen: ${derived.db}    Krzepa: ${derived.build}    Ruch: ${derived.move_rate}    Unik: ${derived.dodge} (1/2: ${halfValue(derived.dodge)}, 1/5: ${fifthValue(derived.dodge)})`),
      { x: M, y, size: 8, font, color: DARK })
  }

  return y
}

function buildPage2(page: PDFPage, font: PDFFont, fontBold: PDFFont, char: ExportCharacter) {
  let y = H - M

  // ── Backstory ──
  y = sectionHeader(page, 'HISTORIA POSTACI', M, y, CW, fontBold)
  y -= 6

  const bsSections: { label: string; key: string }[] = [
    { label: 'Ideologia / Przekonania', key: 'ideology' },
    { label: 'Wazne osoby', key: 'significant_people_who' },
    { label: 'Dlaczego sa wazne', key: 'significant_people_why' },
    { label: 'Znaczace miejsca', key: 'meaningful_locations' },
    { label: 'Cenny przedmiot', key: 'treasured_possessions' },
    { label: 'Cechy charakteru', key: 'traits' },
    { label: 'Opis wygladu', key: 'appearance_description' },
    { label: 'Kluczowa wiez', key: 'key_connection' },
  ]

  for (const section of bsSections) {
    const value = char.backstory[section.key]
    if (!value) continue
    if (y < M + 40) break

    page.drawText(sanitize(section.label + ':'), { x: M, y: y - 9, size: 8, font: fontBold, color: ACCENT })
    y -= 12

    const lines = wrapText(value, font, 8, CW - 10)
    for (const line of lines) {
      if (y < M + 10) break
      page.drawText(line, { x: M + 6, y: y - 8, size: 8, font, color: DARK })
      y -= 11
    }
    y -= 4
  }

  y -= 6

  // ── Equipment ──
  const nonWeapons = char.equipment.filter(
    (item) =>
      !WEAPONS.some((w) => item.startsWith(w.name)) &&
      !item.startsWith('[Mieszkanie]') &&
      !item.startsWith('[Transport]') &&
      !item.startsWith('[Styl')
  )

  if (nonWeapons.length > 0 && y > M + 60) {
    y = sectionHeader(page, 'EKWIPUNEK', M, y, CW, fontBold)
    y -= 4

    const eqColW = CW / 2
    const midEq = Math.ceil(nonWeapons.length / 2)
    for (let i = 0; i < midEq; i++) {
      if (y - 11 < M) break
      for (let c = 0; c < 2; c++) {
        const idx = c === 0 ? i : i + midEq
        if (idx >= nonWeapons.length) continue
        const ex = M + c * eqColW
        page.drawText(sanitize(`- ${nonWeapons[idx]}`), { x: ex + 2, y: y - 9, size: 7, font, color: DARK })
      }
      y -= 11
    }
    y -= 4
  }

  // ── Wealth ──
  if (y > M + 40) {
    y = sectionHeader(page, 'MAJATEK', M, y, CW / 2, fontBold)
    y -= 4
    if (char.spending_level) {
      page.drawText(sanitize(`Poziom zycia: ${char.spending_level}`), { x: M + 4, y: y - 9, size: 8, font, color: DARK })
      y -= 12
    }
    if (char.cash) {
      page.drawText(sanitize(`Gotowka: ${char.cash}`), { x: M + 4, y: y - 9, size: 8, font, color: DARK })
      y -= 12
    }
    if (char.assets) {
      page.drawText(sanitize(`Dobytek: ${char.assets}`), { x: M + 4, y: y - 9, size: 8, font, color: DARK })
    }
  }
}

// ============================================================
//  Main export
// ============================================================

export async function exportCharacterAsPdf(char: ExportCharacter): Promise<Uint8Array> {
  const derived = char.derived as Derived
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const p1 = pdfDoc.addPage([W, H])
  buildPage1(p1, font, fontBold, char, derived)

  const p2 = pdfDoc.addPage([W, H])
  buildPage2(p2, font, fontBold, char)

  return pdfDoc.save()
}
