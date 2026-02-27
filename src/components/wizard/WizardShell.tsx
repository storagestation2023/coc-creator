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
  const StepComponent = STEP_COMPONENTS[currentStep]

  return (
    <div className="space-y-6">
      <Stepper steps={STEP_LABELS} currentStep={currentStep} />
      <div className="min-h-[400px]">
        {StepComponent && <StepComponent />}
      </div>
    </div>
  )
}
