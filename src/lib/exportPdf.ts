import { PDFDocument } from 'pdf-lib'
import { CHARACTERISTIC_MAP } from '@/data/characteristics'
import { OCCUPATIONS } from '@/data/occupations'
import { getSkillById } from '@/data/skills'
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

/**
 * Generate a PDF character sheet.
 * Attempts to fill a template PDF if available, otherwise creates a simple text-based PDF.
 */
export async function exportCharacterAsPdf(char: ExportCharacter): Promise<Uint8Array> {
  const occupation = OCCUPATIONS.find((o) => o.id === char.occupation_id)
  const derived = char.derived as { hp: number; mp: number; san: number; db: string; build: number; move_rate: number; dodge: number }

  // Try to load template
  let pdfDoc: PDFDocument
  let usedTemplate = false

  try {
    const templateResponse = await fetch('/coc-sheet-template.pdf')
    if (templateResponse.ok) {
      const templateBytes = await templateResponse.arrayBuffer()
      pdfDoc = await PDFDocument.load(templateBytes)
      usedTemplate = true

      // Try to fill form fields
      const form = pdfDoc.getForm()
      try {
        // Common field names (will vary by template)
        const trySetField = (name: string, value: string) => {
          try { form.getTextField(name).setText(value) } catch { /* field not found */ }
        }

        trySetField('Name', char.name)
        trySetField('Occupation', occupation?.name ?? '')
        trySetField('Age', String(char.age))
        trySetField('Sex', char.gender)

        for (const key of CHAR_KEYS) {
          const val = char.characteristics[key] ?? 0
          const abbr = CHARACTERISTIC_MAP[key].abbreviation
          trySetField(abbr, String(val))
          trySetField(`${abbr}_half`, String(halfValue(val)))
          trySetField(`${abbr}_fifth`, String(fifthValue(val)))
        }

        if (derived) {
          trySetField('HP', String(derived.hp))
          trySetField('MP', String(derived.mp))
          trySetField('SAN', String(derived.san))
          trySetField('Luck', String(char.luck))
          trySetField('DB', String(derived.db))
          trySetField('Build', String(derived.build))
          trySetField('Move', String(derived.move_rate))
        }
      } catch {
        // Template has no form fields - that's OK
      }
    } else {
      throw new Error('Template not found')
    }
  } catch {
    // No template available - create a simple PDF
    pdfDoc = await PDFDocument.create()
    usedTemplate = false
  }

  // If no template, add text pages
  if (!usedTemplate) {
    const page = pdfDoc.addPage([595, 842]) // A4
    const { height } = page.getSize()
    let y = height - 50

    const drawText = (text: string, x: number, yPos: number, size: number = 10) => {
      page.drawText(text, { x, y: yPos, size })
    }

    drawText('KARTA BADACZA - Zew Cthulhu 7e', 50, y, 16)
    y -= 30

    drawText(`Imie: ${char.name}`, 50, y)
    drawText(`Wiek: ${char.age}   Plec: ${char.gender}`, 350, y)
    y -= 15
    drawText(`Zawod: ${occupation?.name ?? char.occupation_id}`, 50, y)
    y -= 25

    // Characteristics
    drawText('CECHY', 50, y, 12)
    y -= 18
    for (const key of CHAR_KEYS) {
      const val = char.characteristics[key] ?? 0
      const def = CHARACTERISTIC_MAP[key]
      drawText(`${def.abbreviation}: ${val}  (1/2: ${halfValue(val)}, 1/5: ${fifthValue(val)})`, 50, y)
      y -= 14
    }
    y -= 10

    // Derived
    if (derived) {
      drawText('ATRYBUTY POCHODNE', 50, y, 12)
      y -= 18
      drawText(`PW: ${derived.hp}  PM: ${derived.mp}  PP: ${derived.san}  Szczescie: ${char.luck}`, 50, y)
      y -= 14
      drawText(`PO: ${derived.db}  Krzepa: ${derived.build}  Ruch: ${derived.move_rate}  Unik: ${derived.dodge}`, 50, y)
      y -= 20
    }

    // Skills
    drawText('UMIEJETNOSCI', 50, y, 12)
    y -= 18

    const allSkillPoints: Record<string, number> = { ...char.occupation_skill_points }
    for (const [id, pts] of Object.entries(char.personal_skill_points)) {
      allSkillPoints[id] = (allSkillPoints[id] ?? 0) + pts
    }

    const getBase = (skillId: string) => {
      const skill = getSkillById(skillId)
      if (!skill) return 0
      if (skill.base === 'half_dex') return Math.floor((char.characteristics['DEX'] ?? 0) / 2)
      if (skill.base === 'edu') return char.characteristics['EDU'] ?? 0
      return skill.base
    }

    const skillEntries = Object.entries(allSkillPoints)
      .filter(([, pts]) => pts > 0)
      .sort(([a], [b]) => {
        const sA = getSkillById(a)
        const sB = getSkillById(b)
        return (sA?.name ?? a).localeCompare(sB?.name ?? b, 'pl')
      })

    let col = 0
    for (const [skillId, pts] of skillEntries) {
      if (y < 50) {
        const newPage = pdfDoc.addPage([595, 842])
        y = newPage.getSize().height - 50
        col = 0
        // Draw on new page
        newPage.drawText('UMIEJETNOSCI (cd.)', { x: 50, y, size: 12 })
        y -= 18
      }
      const skill = getSkillById(skillId)
      const base = getBase(skillId)
      const total = base + pts
      const name = (skill?.name ?? skillId).replace(/[^\x00-\x7F]/g, (c) => {
        // Basic Polish char substitution for PDF (pdf-lib has limited unicode)
        const map: Record<string, string> = {
          'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
          'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
          'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N',
          'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
        }
        return map[c] ?? c
      })

      const x = col === 0 ? 50 : 310
      page.drawText(`${name}: ${total}%`, { x, y, size: 9 })

      if (col === 1) {
        y -= 13
        col = 0
      } else {
        col = 1
      }
    }
    if (col === 1) y -= 13

    // Equipment on a new page if needed
    if (char.equipment.length > 0) {
      if (y < 100) {
        const newPage = pdfDoc.addPage([595, 842])
        y = newPage.getSize().height - 50
      }
      y -= 10
      drawText('EKWIPUNEK', 50, y, 12)
      y -= 18
      if (char.cash) { drawText(`Gotowka: ${char.cash}  Majatek: ${char.assets}`, 50, y); y -= 14 }
      for (const item of char.equipment) {
        if (y < 50) break
        const safeItem = item.replace(/[^\x00-\x7F]/g, (c) => {
          const map: Record<string, string> = {
            'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
            'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
          }
          return map[c] ?? c
        })
        drawText(`- ${safeItem}`, 60, y, 9)
        y -= 13
      }
    }
  }

  return pdfDoc.save()
}
