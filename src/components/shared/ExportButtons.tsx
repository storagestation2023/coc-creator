import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { exportCharacterAsText } from '@/lib/exportText'
import { Button } from '@/components/ui/Button'

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

interface ExportButtonsProps {
  character: ExportCharacter
}

export function ExportButtons({ character }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyText = async () => {
    const text = exportCharacterAsText(character)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={handleCopyText}>
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Skopiowano!' : 'Kopiuj tekst'}
      </Button>
    </div>
  )
}
