import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { InviteCode } from '@/types/invite'

interface UseInviteCodeReturn {
  loading: boolean
  error: string | null
  inviteCode: InviteCode | null
  validate: (code: string) => Promise<InviteCode | null>
}

export function useInviteCode(): UseInviteCodeReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inviteCode, setInviteCode] = useState<InviteCode | null>(null)

  const validate = async (code: string): Promise<InviteCode | null> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: queryError } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .eq('is_active', true)
        .single()

      if (queryError || !data) {
        setError('Nieprawidłowy kod zaproszenia.')
        setInviteCode(null)
        return null
      }

      const invite = data as InviteCode

      if (invite.times_used >= invite.max_tries) {
        setError('Kod zaproszenia wyczerpał limit użyć.')
        setInviteCode(null)
        return null
      }

      setInviteCode(invite)
      return invite
    } catch {
      setError('Błąd połączenia z serwerem.')
      setInviteCode(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, inviteCode, validate }
}
