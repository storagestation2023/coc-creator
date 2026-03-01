import { useState } from 'react'
import { exportCharacterAsPdf } from '@/lib/exportPdf'

const TEST_CHARACTER = {
  name: 'Ernest Simmons',
  age: 25,
  gender: 'M',
  appearance: 'Wysoki, szczuply mezczyzna o ciemnych wlosach',
  characteristics: {
    STR: 60, CON: 65, SIZ: 45, DEX: 50,
    APP: 30, INT: 40, POW: 60, EDU: 67,
  },
  luck: 55,
  derived: {
    hp: 11, mp: 12, san: 60,
    db: '+0', build: 0, move_rate: 8, dodge: 25,
  },
  occupation_id: 'tramp',
  occupation_skill_points: {
    'antropologia': 39,
    'elektryka': 30,
    'gadanina': 4,
    'walka_wrecz:bijatyka': 20,
    'wspinaczka': 45,
    'ukrywanie': 40,
    'sztuka_przetrwania:tropienie': 40,
    'bron_palna:krotka': 10,
    'spostrzegawczosc': 35,
    'rzucanie': 50,
  },
  personal_skill_points: {
    'historia': 25,
    'tropienie': 40,
    'skakanie': 30,
    'sztuka_rzemioslo:malarstwo': 50,
    'nauka:biologia': 30,
  },
  backstory: {
    ideology: 'Wolnosc ponad wszystko',
    significant_people_who: 'Stary Bill, inny wloczega',
    significant_people_why: 'Uratowal mi zycie',
    meaningful_locations: 'Opuszczona stodoła na obrzezach miasta',
    treasured_possessions: 'Stary medalion po matce',
    traits: 'Nieufny wobec obcych, ale lojalny wobec przyjaciol',
    appearance_description: 'Brudny, poddarty plaszcz, twarz poorana zmarszczkami',
    key_connection: 'Bill - jedyna osoba, ktorej ufa',
  },
  equipment: [
    '[Mieszkanie] Bezdomny',
    '[Transport] Pieszo',
    '[Styl zycia] Nedzarz',
    'Noz',
    'Sznur (10m)',
    'Latarka',
    'Zapałki',
    'Manierce',
    'Koc',
  ],
  cash: '0.5 $',
  assets: '0 $',
  spending_level: 'Biedny',
  era: 'classic_1920s',
  method: 'dice',
}

export function TestPdfPage() {
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const bytes = await exportCharacterAsPdf(TEST_CHARACTER)
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'test-export-v14.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF export error:', err)
      alert('Error: ' + (err as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1 style={{ marginBottom: 20 }}>PDF Export Test</h1>
      <button
        onClick={handleGenerate}
        disabled={generating}
        style={{ padding: '12px 24px', fontSize: 18, cursor: 'pointer' }}
      >
        {generating ? 'Generating...' : 'Generate Test PDF'}
      </button>
    </div>
  )
}
