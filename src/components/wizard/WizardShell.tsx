import { useEffect } from 'react'
import { KeyRound } from 'lucide-react'
import { Stepper } from '@/components/ui/Stepper'
import { useCharacterStore } from '@/stores/characterStore'
import { PL } from '@/data/i18n'
import { StepInviteCode } from './StepInviteCode'
import { StepCharacteristics } from './StepCharacteristics'
import { StepAge } from './StepAge'
import { StepAgeModifiers } from './StepAgeModifiers'
import { StepDerived } from './StepDerived'
import { StepOccupation } from './StepOccupation'
import { StepOccupationSkills } from './StepOccupationSkills'
import { StepPersonalSkills } from './StepPersonalSkills'
import { StepBackstory } from './StepBackstory'
import { StepEquipment } from './StepEquipment'
import { StepBasicInfo } from './StepBasicInfo'
import { StepReview } from './StepReview'

const STEP_LABELS = [
  PL.step_invite_code,
  PL.step_characteristics,
  PL.step_age,
  PL.step_age_modifiers,
  PL.step_derived,
  PL.step_occupation,
  PL.step_occupation_skills,
  PL.step_personal_skills,
  PL.step_backstory,
  PL.step_equipment,
  PL.step_basic_info,
  PL.step_review,
]

const STEP_COMPONENTS = [
  StepInviteCode,
  StepCharacteristics,
  StepAge,
  StepAgeModifiers,
  StepDerived,
  StepOccupation,
  StepOccupationSkills,
  StepPersonalSkills,
  StepBackstory,
  StepEquipment,
  StepBasicInfo,
  StepReview,
]

export function WizardShell() {
  const currentStep = useCharacterStore((s) => s.currentStep)
  const timesUsed = useCharacterStore((s) => s.timesUsed)
  const inviteCodeId = useCharacterStore((s) => s.inviteCodeId)
  const setStep = useCharacterStore((s) => s.setStep)
  const StepComponent = STEP_COMPONENTS[currentStep]

  // On mount (page refresh), always start at step 0 (code entry)
  useEffect(() => {
    setStep(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Key forces remount when character is abandoned or new invite code is entered
  const characterKey = `${timesUsed}-${inviteCodeId}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Stepper steps={STEP_LABELS} currentStep={currentStep} />
        {currentStep > 0 && (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-coc-text-muted hover:text-coc-accent-light border border-coc-border hover:border-coc-accent/50 rounded-lg transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Zmień kod
          </button>
        )}
      </div>
      <div className="min-h-[400px]">
        {StepComponent && <StepComponent key={characterKey} />}
      </div>
    </div>
  )
}
