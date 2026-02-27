import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Characteristics, DerivedAttributes, Backstory } from '@/types/character'
import type { Era, CreationMethod, CharacteristicKey } from '@/types/common'

export interface WizardState {
  // Current step (0-indexed)
  currentStep: number

  // Invite code data
  inviteCodeId: string | null
  inviteCode: string | null
  method: CreationMethod | null
  era: Era | null

  // Step 2: Basic info
  name: string
  age: number | null
  gender: string
  appearance: string

  // Step 3: Characteristics
  characteristics: Partial<Characteristics>
  luck: number | null

  // Step 4: Age deductions (player distributes deduction points)
  ageDeductions: Partial<Record<CharacteristicKey, number>>

  // Step 5: Derived (auto-calculated, stored for convenience)
  derived: DerivedAttributes | null

  // Step 6: Occupation
  occupationId: string | null

  // Step 7-8: Skill points
  occupationSkillPoints: Record<string, number>
  personalSkillPoints: Record<string, number>

  // Step 9: Backstory
  backstory: Partial<Backstory>

  // Step 10: Equipment
  equipment: string[]
  customItems: string[]
  cash: string
  assets: string
  spendingLevel: string

  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setInviteCode: (data: { id: string; code: string; method: CreationMethod; era: Era }) => void
  setBasicInfo: (data: { name: string; age: number; gender: string; appearance: string }) => void
  setCharacteristics: (chars: Partial<Characteristics>) => void
  setLuck: (luck: number) => void
  setAgeDeductions: (deductions: Partial<Record<CharacteristicKey, number>>) => void
  setDerived: (derived: DerivedAttributes) => void
  setOccupation: (id: string) => void
  setOccupationSkillPoints: (points: Record<string, number>) => void
  setPersonalSkillPoints: (points: Record<string, number>) => void
  setBackstory: (backstory: Partial<Backstory>) => void
  setEquipment: (equipment: string[]) => void
  setCustomItems: (items: string[]) => void
  setWealth: (data: { cash: string; assets: string; spendingLevel: string }) => void
  reset: () => void
}

const initialState = {
  currentStep: 0,
  inviteCodeId: null,
  inviteCode: null,
  method: null,
  era: null,
  name: '',
  age: null,
  gender: '',
  appearance: '',
  characteristics: {},
  luck: null,
  ageDeductions: {},
  derived: null,
  occupationId: null,
  occupationSkillPoints: {},
  personalSkillPoints: {},
  backstory: {},
  equipment: [],
  customItems: [],
  cash: '',
  assets: '',
  spendingLevel: '',
}

export const useCharacterStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
      prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),

      setInviteCode: (data) =>
        set({
          inviteCodeId: data.id,
          inviteCode: data.code,
          method: data.method,
          era: data.era,
        }),

      setBasicInfo: (data) =>
        set({
          name: data.name,
          age: data.age,
          gender: data.gender,
          appearance: data.appearance,
        }),

      setCharacteristics: (chars) => set({ characteristics: chars }),
      setLuck: (luck) => set({ luck }),
      setAgeDeductions: (deductions) => set({ ageDeductions: deductions }),
      setDerived: (derived) => set({ derived }),
      setOccupation: (id) =>
        set({ occupationId: id, occupationSkillPoints: {}, personalSkillPoints: {} }),

      setOccupationSkillPoints: (points) => set({ occupationSkillPoints: points }),
      setPersonalSkillPoints: (points) => set({ personalSkillPoints: points }),
      setBackstory: (backstory) => set((s) => ({ backstory: { ...s.backstory, ...backstory } })),
      setEquipment: (equipment) => set({ equipment }),
      setCustomItems: (items) => set({ customItems: items }),
      setWealth: (data) =>
        set({ cash: data.cash, assets: data.assets, spendingLevel: data.spendingLevel }),

      reset: () => set(initialState),
    }),
    {
      name: 'coc-character-wizard',
    }
  )
)
