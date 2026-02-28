import { PDFDocument, StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib'
import { OCCUPATIONS } from '@/data/occupations'
import { SKILLS, getSkillDisplayName, getSkillBase, getBaseSkillId, getSpecialization } from '@/data/skills'
import { WEAPONS } from '@/data/weapons'
import { EQUIPMENT_CATALOG } from '@/data/equipment'
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

// ============================================================
//  Coordinate maps for: ZewCthulhu_7ed_Karta-Badacza_1920
//  Page size: 612.283 × 858.898 pts
//  Origin: bottom-left, Y increases upward.
//  All values are approximate — adjust as needed.
// ============================================================

// --- PAGE 1: Personal info fields ---
// Calibrated from grid overlay on template PDF
const P1_INFO = {
  name:       { x: 150, y: 778 },
  occupation: { x: 115, y: 743 },
  age:        { x: 90,  y: 728 },
  sex:        { x: 160, y: 728 },
} as const

// --- PAGE 1: Characteristics grid ---
// Sheet labels → our keys:
//   S=STR, KON=CON, BC=SIZ, ZR=DEX, WYG=APP, INT=INT, MOC=POW, WYK=EDU
// Each characteristic: large value box, then two STACKED small boxes to its right
//   top small box = half value, bottom small box = fifth value
// Grid spans x≈288-600, 3 groups of ~104pt each
// Half/fifth are stacked vertically: same X (value X + ~30), Y offset ±8
const P1_CHARS: Record<CharacteristicKey, { value: [number, number]; half: [number, number]; fifth: [number, number] }> = {
  // Row 1: S, ZR, MOC  (y≈768)
  STR: { value: [317, 768], half: [347, 776], fifth: [347, 760] },
  DEX: { value: [421, 768], half: [451, 776], fifth: [451, 760] },
  POW: { value: [525, 768], half: [555, 776], fifth: [555, 760] },
  // Row 2: KON, WYG, WYK  (y≈733)
  CON: { value: [317, 733], half: [347, 741], fifth: [347, 725] },
  APP: { value: [421, 733], half: [451, 741], fifth: [451, 725] },
  EDU: { value: [525, 733], half: [555, 741], fifth: [555, 725] },
  // Row 3: BC, INT  (y≈701)  — Ruch is separate
  SIZ: { value: [317, 701], half: [347, 709], fifth: [347, 693] },
  INT: { value: [421, 701], half: [451, 709], fifth: [451, 693] },
}
const P1_MOVE: [number, number] = [530, 701]

// --- PAGE 1: Derived stats ---
const P1_HP_MAX: [number, number] = [130, 682]
const P1_SAN_START: [number, number] = [405, 688]
const P1_SAN_MAX: [number, number] = [445, 688]
const P1_MP_MAX: [number, number] = [578, 612]
const P1_LUCK: [number, number] = [265, 578]

// --- PAGE 1: Combat box (right side, bottom) ---
const P1_DAMAGE_BONUS: [number, number] = [560, 175]
const P1_BUILD: [number, number] = [560, 132]
const P1_DODGE: [number, number] = [560, 88]

// --- PAGE 1: Skills ---
// Map from composite skill key → [x, y] position for the value
// Calibrated: first row y≈508, row height ≈17.5pt
const SKILL_Y0 = 508
const SKILL_DY = 17.5
const sy = (row: number) => SKILL_Y0 - row * SKILL_DY
// Column value X positions (center of the large value box)
const C1X = 160, C2X = 330, C3X = 490, C4X = 590
// Column half/fifth X positions (center of the stacked small boxes right of value)
const C1HX = 183, C2HX = 353, C3HX = 513, C4HX = 607
// Y offset for stacked half (top) / fifth (bottom) within skill rows
const SKILL_HF_DY = 4.5
// Column label X positions (for writing names in blank rows)
const C1L = 62, C2L = 235, C3L = 398, C4L = 560

const P1_SKILLS: Record<string, [number, number]> = {
  // Column 1 (16 rows, 0-15)
  'antropologia':                  [C1X, sy(0)],
  'archeologia':                   [C1X, sy(1)],
  'bron_palna:karabin_strzelba':   [C1X, sy(2)],
  // row 3 = label continuation
  // row 4 = blank
  'bron_palna:krotka':             [C1X, sy(5)],
  'charakteryzacja':               [C1X, sy(6)],
  'elektryka':                     [C1X, sy(7)],
  'gadanina':                      [C1X, sy(8)],
  'historia':                      [C1X, sy(9)],
  'jezdziectwo':                   [C1X, sy(10)],
  'jezyk_obcy':                    [C1X, sy(11)],
  // rows 12-13 = blank for language
  'jezyk_ojczysty':                [C1X, sy(14)],
  'korzystanie_z_bibliotek':       [C1X, sy(15)],
  // Column 2 (16 rows, 0-15; Obsługa Ciężkiego Sprzętu takes 2 lines)
  'ksiegowosc':                    [C2X, sy(0)],
  'majetnosc':                     [C2X, sy(1)],
  'mechanika':                     [C2X, sy(2)],
  'medycyna':                      [C2X, sy(3)],
  'mity_cthulhu':                  [C2X, sy(4)],
  'nasluchiwanie':                 [C2X, sy(5)],
  'nauka':                         [C2X, sy(6)],
  // rows 7-8 = blank for science spec
  'nawigacja':                     [C2X, sy(9)],
  'obsluga_ciezkiego_sprzetu':     [C2X, sy(10)],
  // row 11 = continuation of Obsługa label
  'okultyzm':                      [C2X, sy(12)],
  'perswazja':                     [C2X, sy(13)],
  'pierwsza_pomoc':                [C2X, sy(14)],
  'pilotowanie':                   [C2X, sy(15)],
  // Column 3 (15 rows, 0-14)
  'plywanie':                      [C3X, sy(0)],
  'prawo':                         [C3X, sy(1)],
  'prowadzenie_samochodu':         [C3X, sy(2)],
  'psychoanaliza':                 [C3X, sy(3)],
  'psychologia':                   [C3X, sy(4)],
  'rzucanie':                      [C3X, sy(5)],
  'skakanie':                      [C3X, sy(6)],
  'spostrzegawczosc':              [C3X, sy(7)],
  'sztuka_rzemioslo':              [C3X, sy(8)],
  // rows 9-10 = blank for art spec
  'sztuka_przetrwania':            [C3X, sy(11)],
  'slusarstwo':                    [C3X, sy(12)],
  'tropienie':                     [C3X, sy(13)],
  'ukrywanie':                     [C3X, sy(14)],
  // Column 4 (13 rows, 0-12)
  'unik':                          [C4X, sy(0)],
  'urok_osobisty':                 [C4X, sy(1)],
  'walka_wrecz:bijatyka':          [C4X, sy(2)],
  // rows 3-6 = blank for combat melee specs
  'wiedza_o_naturze':              [C4X, sy(7)],
  'wspinaczka':                    [C4X, sy(8)],
  'wycena':                        [C4X, sy(9)],
  'zastraszanie':                  [C4X, sy(10)],
  // row 11 = blank
  'zreczne_palce':                 [C4X, sy(12)],
}

// Blank rows: [labelX, valueX, y]
const BLANK_LANG_ROWS: [number, number, number][] = [
  [C1L, C1X, sy(12)], [C1L, C1X, sy(13)],
]
const BLANK_SCIENCE_ROWS: [number, number, number][] = [
  [C2L, C2X, sy(7)], [C2L, C2X, sy(8)],
]
const BLANK_ART_ROWS: [number, number, number][] = [
  [C3L, C3X, sy(9)], [C3L, C3X, sy(10)],
]
const BLANK_MELEE_ROWS: [number, number, number][] = [
  [C4L, C4X, sy(3)], [C4L, C4X, sy(4)], [C4L, C4X, sy(5)], [C4L, C4X, sy(6)],
]
const BLANK_GUN_ROWS: [number, number, number][] = [
  [C1L, C1X, sy(4)],
]

// --- PAGE 1: Weapons table ---
const WEAP_Y0 = 165       // first empty row (after "Nieuzbrojony")
const WEAP_DY = 15
const WEAP_MAX = 6
const WEAP_COLS = {
  name: 50, regular: 205, hard: 260, extreme: 305,
  damage: 360, range: 420, attacks: 460, ammo: 520, malfunction: 578,
} as const

// --- PAGE 2: Backstory ---
// Left column (calibrated from grid)
const P2_BACK_L = [
  { key: 'appearance_description', x: 55, y: 755, lines: 4 },
  { key: 'ideology',               x: 55, y: 685, lines: 3 },
  { key: 'significant_people',     x: 55, y: 625, lines: 3 },
  { key: 'meaningful_locations',   x: 55, y: 570, lines: 3 },
  { key: 'treasured_possessions',  x: 55, y: 515, lines: 4 },
] as const
// Right column
const P2_BACK_R = [
  { key: 'traits',         x: 340, y: 755, lines: 4 },
  { key: 'key_connection', x: 340, y: 685, lines: 3 },
] as const

// --- PAGE 2: Equipment ---
const P2_EQ = { x1: 55, x2: 250, y0: 418, dy: 15, maxLines: 12 } as const

// --- PAGE 2: Wealth ---
const P2_WEALTH = {
  spendingLevel: [535, 413] as [number, number],
  cash:          [465, 395] as [number, number],
  assets:        [465, 378] as [number, number],
}

// ============================================================
//  Drawing helpers
// ============================================================

function drawLeft(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number) {
  page.drawText(sanitize(text), { x, y: y - size / 3, size, font })
}

function drawCentered(page: PDFPage, text: string, cx: number, cy: number, font: PDFFont, size: number) {
  const s = sanitize(text)
  const w = font.widthOfTextAtSize(s, size)
  page.drawText(s, { x: cx - w / 2, y: cy - size / 3, size, font })
}

/** Resolve numeric base for a skill composite key. */
function resolveBase(skillKey: string, chars: Record<string, number>): number {
  const base = getSkillBase(skillKey)
  if (base === 'half_dex') return Math.floor((chars['DEX'] ?? 0) / 2)
  if (base === 'edu') return chars['EDU'] ?? 0
  return base
}

/** Word-wrap text into lines of max `maxChars` characters. */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    if (current.length + word.length + 1 > maxChars && current.length > 0) {
      lines.push(current)
      current = word
    } else {
      current = current ? `${current} ${word}` : word
    }
  }
  if (current) lines.push(current)
  return lines
}

// ============================================================
//  Template filling functions
// ============================================================

function fillPersonalInfo(page: PDFPage, font: PDFFont, char: ExportCharacter) {
  const occupation = OCCUPATIONS.find((o) => o.id === char.occupation_id)
  const sz = 9
  drawLeft(page, char.name, P1_INFO.name.x, P1_INFO.name.y, font, sz)
  drawLeft(page, occupation?.name ?? char.occupation_id, P1_INFO.occupation.x, P1_INFO.occupation.y, font, sz)
  drawLeft(page, String(char.age), P1_INFO.age.x, P1_INFO.age.y, font, sz)
  const sexLabel = char.gender === 'M' ? 'M' : char.gender === 'F' ? 'K' : char.gender
  drawLeft(page, sexLabel, P1_INFO.sex.x, P1_INFO.sex.y, font, sz)
}

function fillCharacteristics(page: PDFPage, font: PDFFont, fontBold: PDFFont, char: ExportCharacter, derived: Derived) {
  const sz = 10
  for (const key of CHAR_KEYS) {
    const val = char.characteristics[key] ?? 0
    const pos = P1_CHARS[key]
    drawCentered(page, String(val), pos.value[0], pos.value[1], fontBold, sz)
    drawCentered(page, String(halfValue(val)), pos.half[0], pos.half[1], font, 7)
    drawCentered(page, String(fifthValue(val)), pos.fifth[0], pos.fifth[1], font, 7)
  }
  // Move Rate
  drawCentered(page, String(derived.move_rate), P1_MOVE[0], P1_MOVE[1], fontBold, sz)
}

function fillDerived(page: PDFPage, font: PDFFont, fontBold: PDFFont, char: ExportCharacter, derived: Derived) {
  const sz = 10
  drawCentered(page, String(derived.hp), P1_HP_MAX[0], P1_HP_MAX[1], fontBold, sz)
  drawCentered(page, String(derived.san), P1_SAN_START[0], P1_SAN_START[1], fontBold, sz)
  drawCentered(page, String(99 - (char.characteristics['POW'] ?? 0)), P1_SAN_MAX[0], P1_SAN_MAX[1], font, 8)
  drawCentered(page, String(derived.mp), P1_MP_MAX[0], P1_MP_MAX[1], fontBold, sz)
  drawCentered(page, String(char.luck), P1_LUCK[0], P1_LUCK[1], fontBold, sz)
}

function fillCombat(page: PDFPage, font: PDFFont, fontBold: PDFFont, char: ExportCharacter, derived: Derived) {
  // Damage Bonus
  drawCentered(page, String(derived.db), P1_DAMAGE_BONUS[0], P1_DAMAGE_BONUS[1], fontBold, 10)
  // Build
  drawCentered(page, String(derived.build), P1_BUILD[0], P1_BUILD[1], fontBold, 10)
  // Dodge = base (half DEX) + invested — with half/fifth stacked boxes
  const dodgeInvested = (char.occupation_skill_points['unik'] ?? 0) + (char.personal_skill_points['unik'] ?? 0)
  const dodgeTotal = resolveBase('unik', char.characteristics) + dodgeInvested
  drawCentered(page, String(dodgeTotal), P1_DODGE[0], P1_DODGE[1], fontBold, 10)
  drawCentered(page, String(halfValue(dodgeTotal)), P1_DODGE[0] + 28, P1_DODGE[1] + 6, font, 7)
  drawCentered(page, String(fifthValue(dodgeTotal)), P1_DODGE[0] + 28, P1_DODGE[1] - 6, font, 7)
}

/** Draw a skill value + stacked half/fifth in the small boxes to its right. */
function drawSkillEntry(page: PDFPage, font: PDFFont, total: number, vx: number, vy: number) {
  const hfx = vx === C1X ? C1HX : vx === C2X ? C2HX : vx === C3X ? C3HX : C4HX
  drawCentered(page, String(total), vx, vy, font, 8)
  drawCentered(page, String(halfValue(total)), hfx, vy + SKILL_HF_DY, font, 5.5)
  drawCentered(page, String(fifthValue(total)), hfx, vy - SKILL_HF_DY, font, 5.5)
}

function fillSkills(page: PDFPage, font: PDFFont, char: ExportCharacter) {
  // Merge occupation + personal points
  const allPoints: Record<string, number> = { ...char.occupation_skill_points }
  for (const [id, pts] of Object.entries(char.personal_skill_points)) {
    allPoints[id] = (allPoints[id] ?? 0) + pts
  }

  // Track blank row usage
  let langIdx = 0, sciIdx = 0, artIdx = 0, meleeIdx = 0, gunIdx = 0
  const nameSz = 7

  for (const [skillKey, invested] of Object.entries(allPoints)) {
    if (invested <= 0) continue
    const total = resolveBase(skillKey, char.characteristics) + invested

    // Direct mapping?
    if (P1_SKILLS[skillKey]) {
      const [x, y] = P1_SKILLS[skillKey]
      drawSkillEntry(page, font, total, x, y)
      continue
    }

    // Specialization handling
    const baseId = getBaseSkillId(skillKey)
    const spec = getSpecialization(skillKey)

    if (baseId === 'jezyk_obcy' && spec && langIdx < BLANK_LANG_ROWS.length) {
      const [lx, vx, y] = BLANK_LANG_ROWS[langIdx++]
      drawLeft(page, spec, lx, y, font, nameSz)
      drawSkillEntry(page, font, total, vx, y)
    } else if (baseId === 'nauka' && spec && sciIdx < BLANK_SCIENCE_ROWS.length) {
      const [lx, vx, y] = BLANK_SCIENCE_ROWS[sciIdx++]
      drawLeft(page, spec, lx, y, font, nameSz)
      drawSkillEntry(page, font, total, vx, y)
    } else if (baseId === 'sztuka_rzemioslo' && spec && artIdx < BLANK_ART_ROWS.length) {
      const [lx, vx, y] = BLANK_ART_ROWS[artIdx++]
      drawLeft(page, spec, lx, y, font, nameSz)
      drawSkillEntry(page, font, total, vx, y)
    } else if (baseId === 'walka_wrecz' && spec && spec !== 'bijatyka' && meleeIdx < BLANK_MELEE_ROWS.length) {
      const [lx, vx, y] = BLANK_MELEE_ROWS[meleeIdx++]
      const combatSpec = SKILLS.find(s => s.id === 'walka_wrecz')?.combatSpecializations?.find(cs => cs.id === spec)
      drawLeft(page, `WW (${combatSpec?.name ?? spec})`, lx, y, font, nameSz)
      drawSkillEntry(page, font, total, vx, y)
    } else if (baseId === 'bron_palna' && spec && spec !== 'krotka' && spec !== 'karabin_strzelba' && gunIdx < BLANK_GUN_ROWS.length) {
      const [lx, vx, y] = BLANK_GUN_ROWS[gunIdx++]
      const combatSpec = SKILLS.find(s => s.id === 'bron_palna')?.combatSpecializations?.find(cs => cs.id === spec)
      drawLeft(page, `BP (${combatSpec?.name ?? spec})`, lx, y, font, nameSz)
      drawSkillEntry(page, font, total, vx, y)
    } else if (baseId === 'sztuka_przetrwania' && spec) {
      const pos = P1_SKILLS['sztuka_przetrwania']
      if (pos) drawSkillEntry(page, font, total, pos[0], pos[1])
    } else if (baseId === 'pilotowanie' && spec) {
      const pos = P1_SKILLS['pilotowanie']
      if (pos) drawSkillEntry(page, font, total, pos[0], pos[1])
    }
    // Other unmapped skills are silently skipped
  }
}

function fillWeapons(page: PDFPage, font: PDFFont, char: ExportCharacter) {
  // Try to match equipment items to weapon data
  const weaponItems: { weapon: typeof WEAPONS[number]; skillTotal: number }[] = []

  for (const item of char.equipment) {
    // Equipment stores weapons as "Name (damage, range)" — match by name prefix
    const matched = WEAPONS.find((w) => item.startsWith(w.name))
    if (matched) {
      const invested =
        (char.occupation_skill_points[matched.skill_id] ?? 0) +
        (char.personal_skill_points[matched.skill_id] ?? 0)
      const base = resolveBase(matched.skill_id, char.characteristics)
      weaponItems.push({ weapon: matched, skillTotal: base + invested })
    }
  }

  const sz = 7
  for (let i = 0; i < Math.min(weaponItems.length, WEAP_MAX); i++) {
    const { weapon: w, skillTotal } = weaponItems[i]
    const y = WEAP_Y0 - i * WEAP_DY

    drawLeft(page, w.name, WEAP_COLS.name, y, font, sz)
    drawCentered(page, String(skillTotal), WEAP_COLS.regular, y, font, sz)
    drawCentered(page, String(halfValue(skillTotal)), WEAP_COLS.hard, y, font, sz)
    drawCentered(page, String(fifthValue(skillTotal)), WEAP_COLS.extreme, y, font, sz)
    drawLeft(page, w.damage, WEAP_COLS.damage, y, font, sz)
    drawLeft(page, w.range, WEAP_COLS.range, y, font, sz)
    drawLeft(page, w.attacks_per_round, WEAP_COLS.attacks, y, font, sz)
    if (w.ammo) drawCentered(page, String(w.ammo), WEAP_COLS.ammo, y, font, sz)
    if (w.malfunction) drawCentered(page, String(w.malfunction), WEAP_COLS.malfunction, y, font, sz)
  }
}

function fillBackstory(page: PDFPage, font: PDFFont, char: ExportCharacter) {
  const sz = 7
  const lineH = 13
  const maxWidth = 50 // chars per line

  const draw = (sections: readonly { key: string; x: number; y: number; lines: number }[]) => {
    for (const section of sections) {
      let value = ''
      if (section.key === 'significant_people') {
        const who = char.backstory['significant_people_who'] ?? ''
        const why = char.backstory['significant_people_why'] ?? ''
        value = [who, why].filter(Boolean).join(' — ')
      } else {
        value = char.backstory[section.key] ?? ''
      }
      if (!value) continue
      const wrapped = wrapText(value, maxWidth)
      for (let i = 0; i < Math.min(wrapped.length, section.lines); i++) {
        drawLeft(page, wrapped[i], section.x, section.y - i * lineH, font, sz)
      }
    }
  }

  draw(P2_BACK_L)
  draw(P2_BACK_R)
}

function fillEquipment(page: PDFPage, font: PDFFont, char: ExportCharacter) {
  // Filter out weapons (page 1 table) and structural items (housing/transport/lifestyle)
  const nonWeapons = char.equipment.filter(
    (item) =>
      !WEAPONS.some((w) => item.startsWith(w.name)) &&
      !item.startsWith('[Mieszkanie]') &&
      !item.startsWith('[Transport]') &&
      !item.startsWith('[Styl')
  )

  const sz = 7
  for (let i = 0; i < Math.min(nonWeapons.length, P2_EQ.maxLines * 2); i++) {
    const col = i < P2_EQ.maxLines ? 0 : 1
    const row = i < P2_EQ.maxLines ? i : i - P2_EQ.maxLines
    const x = col === 0 ? P2_EQ.x1 : P2_EQ.x2
    const y = P2_EQ.y0 - row * P2_EQ.dy

    // Try to find display name from catalog
    const catalogItem = EQUIPMENT_CATALOG.find((eq) => eq.name === nonWeapons[i])
    const displayName = catalogItem ? catalogItem.name : nonWeapons[i]
    drawLeft(page, displayName, x, y, font, sz)
  }
}

function fillWealth(page: PDFPage, font: PDFFont, char: ExportCharacter) {
  const sz = 8
  if (char.spending_level) {
    drawLeft(page, char.spending_level, P2_WEALTH.spendingLevel[0], P2_WEALTH.spendingLevel[1], font, sz)
  }
  if (char.cash) {
    drawLeft(page, char.cash, P2_WEALTH.cash[0], P2_WEALTH.cash[1], font, sz)
  }
  if (char.assets) {
    drawLeft(page, char.assets, P2_WEALTH.assets[0], P2_WEALTH.assets[1], font, sz)
  }
}

// ============================================================
//  Fallback: simple text-based PDF (when template is missing)
// ============================================================

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
  const derived = char.derived as Derived

  let pdfDoc: PDFDocument
  let usedTemplate = false

  try {
    const basePath = import.meta.env.BASE_URL ?? '/'
    const resp = await fetch(`${basePath}coc-sheet-template.pdf`)
    if (!resp.ok) throw new Error('Template not found')
    const bytes = await resp.arrayBuffer()
    pdfDoc = await PDFDocument.load(bytes)
    usedTemplate = true
  } catch {
    pdfDoc = await PDFDocument.create()
  }

  if (usedTemplate) {
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const pages = pdfDoc.getPages()
    const p1 = pages[0]
    const p2 = pages.length > 1 ? pages[1] : null

    // DEBUG: position markers — letters at various X positions on row 1 level
    // to find correct column positions
    const dbY = 790 // above char rows
    for (let x = 280; x <= 600; x += 20) {
      p1.drawText(String(x), { x, y: dbY, size: 6, font })
    }

    fillPersonalInfo(p1, font, char)
    fillCharacteristics(p1, font, fontBold, char, derived)
    fillDerived(p1, font, fontBold, char, derived)
    fillCombat(p1, font, fontBold, char, derived)
    fillSkills(p1, font, char)
    fillWeapons(p1, font, char)

    if (p2) {
      fillBackstory(p2, font, char)
      fillEquipment(p2, font, char)
      fillWealth(p2, font, char)
    }
  } else {
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    generateTextPdf(pdfDoc, char, font)
  }

  return pdfDoc.save()
}
