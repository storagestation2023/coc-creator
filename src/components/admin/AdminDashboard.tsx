import { useState } from 'react'
import { LogOut, KeyRound, Users } from 'lucide-react'
import { useAdminStore } from '@/stores/adminStore'
import { InviteCodeManager } from './InviteCodeManager'
import { CharacterList } from './CharacterList'
import { Button } from '@/components/ui/Button'

type Tab = 'codes' | 'characters'

export function AdminDashboard() {
  const { logout } = useAdminStore()
  const [activeTab, setActiveTab] = useState<Tab>('codes')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-bold">Panel Strażnika Tajemnic</h2>
        <Button size="sm" variant="ghost" onClick={logout}>
          <LogOut className="w-4 h-4" /> Wyloguj
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-coc-border">
        <button
          type="button"
          onClick={() => setActiveTab('codes')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'codes'
              ? 'border-coc-accent-light text-coc-accent-light'
              : 'border-transparent text-coc-text-muted hover:text-coc-text'
          }`}
        >
          <KeyRound className="w-4 h-4" /> Kody zaproszenia
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('characters')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === 'characters'
              ? 'border-coc-accent-light text-coc-accent-light'
              : 'border-transparent text-coc-text-muted hover:text-coc-text'
          }`}
        >
          <Users className="w-4 h-4" /> Postacie
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'codes' && <InviteCodeManager />}
      {activeTab === 'characters' && <CharacterList />}
    </div>
  )
}
