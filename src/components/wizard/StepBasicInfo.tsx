import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCharacterStore } from '@/stores/characterStore'
import { basicInfoSchema, type BasicInfoFormData } from '@/lib/validation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function StepBasicInfo() {
  const store = useCharacterStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: store.name || '',
      age: store.age ?? 25,
      gender: store.gender || '',
      appearance: store.appearance || '',
    },
  })

  const onSubmit = (data: BasicInfoFormData) => {
    store.setBasicInfo({ ...data, appearance: data.appearance ?? '' })
    store.nextStep()
  }

  return (
    <Card title="Dane podstawowe">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Imię i nazwisko"
          placeholder="np. Herbert West"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Wiek (15–89)"
            type="number"
            min={15}
            max={89}
            error={errors.age?.message}
            {...register('age', { valueAsNumber: true })}
          />
          <Input
            label="Płeć"
            placeholder="np. Mężczyzna"
            error={errors.gender?.message}
            {...register('gender')}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-coc-text-muted">
            Wygląd (opcjonalnie)
          </label>
          <textarea
            placeholder="Opis wyglądu postaci..."
            className="w-full px-3 py-2 bg-coc-surface-light border border-coc-border rounded-lg text-coc-text placeholder:text-coc-text-muted/50 focus:outline-none focus:border-coc-accent-light transition-colors min-h-[80px] resize-y"
            {...register('appearance')}
          />
        </div>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="secondary" onClick={() => store.prevStep()}>
            Wstecz
          </Button>
          <Button type="submit">Dalej</Button>
        </div>
      </form>
    </Card>
  )
}
