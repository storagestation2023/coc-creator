import { z } from 'zod'

export const inviteCodeSchema = z.object({
  code: z.string().min(1, 'Kod zaproszenia jest wymagany.'),
})

export const basicInfoSchema = z.object({
  name: z.string().min(1, 'Imię i nazwisko jest wymagane.').max(100),
  age: z.number().int().min(15, 'Minimalny wiek to 15 lat.').max(89, 'Maksymalny wiek to 89 lat.'),
  gender: z.string().min(1, 'Płeć jest wymagana.'),
  appearance: z.string().max(500).optional(),
})

export const characteristicsSchema = z.object({
  STR: z.number().int().min(1).max(99),
  CON: z.number().int().min(1).max(99),
  SIZ: z.number().int().min(1).max(99),
  DEX: z.number().int().min(1).max(99),
  APP: z.number().int().min(1).max(99),
  INT: z.number().int().min(1).max(99),
  POW: z.number().int().min(1).max(99),
  EDU: z.number().int().min(1).max(99),
})

export const backstorySchema = z.object({
  ideology: z.string().max(1000).optional(),
  significant_people_who: z.string().max(1000).optional(),
  significant_people_why: z.string().max(1000).optional(),
  meaningful_locations: z.string().max(1000).optional(),
  treasured_possessions: z.string().max(1000).optional(),
  traits: z.string().max(1000).optional(),
  appearance_description: z.string().max(1000).optional(),
  key_connection: z.string().max(1000).optional(),
})

export type InviteCodeFormData = z.infer<typeof inviteCodeSchema>
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>
export type CharacteristicsFormData = z.infer<typeof characteristicsSchema>
export type BackstoryFormData = z.infer<typeof backstorySchema>
