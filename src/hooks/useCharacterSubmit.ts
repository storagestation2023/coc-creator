import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { WizardState } from '@/stores/characterStore'

interface UseCharacterSubmitReturn {
  loading: boolean
  error: string | null
  submit: (state: WizardState) => Promise<boolean>
}

export function useCharacterSubmit(): UseCharacterSubmitReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (state: WizardState): Promise<boolean> => {
    if (!state.inviteCodeId || !state.era || !state.method) {
      setError('Brak danych kodu zaproszenia.')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      // Delete any existing character for this invite code (re-roll replaces old)
      await supabase
        .from('characters')
        .delete()
        .eq('invite_code_id', state.inviteCodeId)

      // Insert the new character
      const { error: insertError } = await supabase.from('characters').insert({
        invite_code_id: state.inviteCodeId,
        status: 'submitted',
        name: state.name,
        age: state.age,
        gender: state.gender,
        appearance: state.appearance,
        characteristics: state.characteristics,
        luck: state.luck,
        derived: state.derived,
        occupation_id: state.occupationId,
        occupation_skill_points: state.occupationSkillPoints,
        personal_skill_points: state.personalSkillPoints,
        backstory: state.backstory,
        equipment: [...state.equipment, ...state.customItems],
        cash: state.cash,
        assets: state.assets,
        spending_level: state.spendingLevel,
        era: state.era,
        method: state.method,
      })

      if (insertError) {
        setError('Błąd zapisu postaci: ' + insertError.message)
        return false
      }

      // Increment times_used atomically
      await supabase.rpc('increment_times_used', { code_id: state.inviteCodeId })

      return true
    } catch {
      setError('Błąd połączenia z serwerem.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, submit }
}
