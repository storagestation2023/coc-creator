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
  methods: CreationMethod[]
  method: CreationMethod | null
  era: Era | null
  perks: string[]
  maxTries: number
  timesUsed: number

  // Step 2: Basic info
  name: string
  age: number | null
  gender: string
  appearance: string

  // Step 3: Characteristics
  characteristics: Partial<Characteristics>
  luck: number | null

  // Step 3 lock: characteristics + luck are locked after proceeding
  characteristicsLocked: boolean
  // Swap characteristics perk
  characteristicSwap: { from: CharacteristicKey; to: CharacteristicKey } | null

  // Step 4: Age deductions (player distributes deduction points)
  ageDeductions: Partial<Record<CharacteristicKey, number>>
  // EDU improvement rolls are permanent once rolled
  eduRolls: { roll: number; improved: boolean; newEdu: number }[]
  eduAfterRolls: number | null

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
  setInviteCode: (data: { id: string; code: string; methods: CreationMethod[]; method: CreationMethod | null; era: Era; perks: string[]; maxTries: number; timesUsed: number }) => void
  setMethod: (method: CreationMethod) => void
  setBasicInfo: (data: { name: string; age: number; gender: string; appearance: string }) => void
  setCharacteristics: (chars: Partial<Characteristics>) => void
  setLuck: (luck: number) => void
  setAgeDeductions: (deductions: Partial<Record<CharacteristicKey, number>>) => void
  lockCharacteristics: () => void
  setEduRolls: (rolls: { roll: number; improved: boolean; newEdu: number }[], eduAfter: number) => void
  setDerived: (derived: DerivedAttributes) => void
  setOccupation: (id: string) => void
  setOccupationSkillPoints: (points: Record<string, number>) => void
  setPersonalSkillPoints: (points: Record<string, number>) => void
  setBackstory: (backstory: Partial<Backstory>) => void
  setEquipment: (equipment: string[]) => void
  setCustomItems: (items: string[]) => void
  setWealth: (data: { cash: string; assets: string; spendingLevel: string }) => void
  /** Abandon current character, increment timesUsed, reset character data, go to step 1 */
  abandonCharacter: () => void
  reset: () => void
}

const initialState = {
  currentStep: 0,
  inviteCodeId: null,
  inviteCode: null,
  methods: [],
  method: null,
  era: null,
  perks: [],
  maxTries: 1,
  timesUsed: 0,
  name: '',
  age: null,
  gender: '',
  appearance: '',
  characteristics: {},
  luck: null,
  characteristicsLocked: false,
  characteristicSwap: null,
  ageDeductions: {},
  eduRolls: [],
  eduAfterRolls: null,
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
          methods: data.methods,
          method: data.method,
          era: data.era,
          perks: data.perks,
          maxTries: data.maxTries,
          timesUsed: data.timesUsed,
        }),

      setMethod: (method) => set({ method }),

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
      lockCharacteristics: () => set({ characteristicsLocked: true }),
      setEduRolls: (rolls, eduAfter) => set({ eduRolls: rolls, eduAfterRolls: eduAfter }),
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

      abandonCharacter: () =>
        set((s) => ({
          // Keep invite code data, increment timesUsed
          currentStep: 1,
          inviteCodeId: s.inviteCodeId,
          inviteCode: s.inviteCode,
          methods: s.methods,
          method: s.method,
          era: s.era,
          perks: s.perks,
          maxTries: s.maxTries,
          timesUsed: s.timesUsed + 1,
          // Reset all character data
          name: '',
          age: null,
          gender: '',
          appearance: '',
          characteristics: {},
          luck: null,
          characteristicsLocked: false,
          characteristicSwap: null,
          ageDeductions: {},
          eduRolls: [],
          eduAfterRolls: null,
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
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'coc-character-wizard',
    }
  )
)
