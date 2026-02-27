export interface AgeRange {
  min: number
  max: number
  label: string
  eduImprovementChecks: number
  deductionPoints: number
  deductionDescription: string
  appReduction: number
  moveReduction: number
}

/**
 * CoC 7e age ranges from the Polish handbook:
 * - 15-19: Siła i Budowa = łącznie -5, Wykształcenie -5, Szczęście: rzuć 2x weź lepszy
 * - 20-39: brak modyfikatorów (1 rzut na poprawę WYK)
 * - 40-49: 1 rzut poprawy WYK, odjąć 5 pkt z SIŁ/KON/ZRĘ, -5 WYG, ruch -1
 * - 50-59: 2 rzuty poprawy WYK, odjąć 10 pkt z SIŁ/KON/ZRĘ, -10 WYG, ruch -2
 * - 60-69: 3 rzuty poprawy WYK, odjąć 20 pkt z SIŁ/KON/ZRĘ, -15 WYG, ruch -3
 * - 70-79: 4 rzuty poprawy WYK, odjąć 40 pkt z SIŁ/KON/ZRĘ, -20 WYG, ruch -4
 * - 80-89: 4 rzuty poprawy WYK, odjąć 80 pkt z SIŁ/KON/ZRĘ, -25 WYG, ruch -5
 */
export const AGE_RANGES: AgeRange[] = [
  {
    min: 15,
    max: 19,
    label: 'Młody (15–19)',
    eduImprovementChecks: 0,
    deductionPoints: 5, // from STR+SIZ combined
    deductionDescription: 'Odejmij łącznie 5 punktów od SIŁ i BUD. WYK zostaje obniżone o 5.',
    appReduction: 0,
    moveReduction: 0,
  },
  {
    min: 20,
    max: 39,
    label: 'Dorosły (20–39)',
    eduImprovementChecks: 1,
    deductionPoints: 0,
    deductionDescription: 'Brak modyfikatorów wiekowych.',
    appReduction: 0,
    moveReduction: 0,
  },
  {
    min: 40,
    max: 49,
    label: 'Średni wiek (40–49)',
    eduImprovementChecks: 2,
    deductionPoints: 5,
    deductionDescription: 'Odejmij łącznie 5 punktów od SIŁ, KON lub ZRĘ (dowolny podział).',
    appReduction: 5,
    moveReduction: 1,
  },
  {
    min: 50,
    max: 59,
    label: 'Późne lata (50–59)',
    eduImprovementChecks: 3,
    deductionPoints: 10,
    deductionDescription: 'Odejmij łącznie 10 punktów od SIŁ, KON lub ZRĘ (dowolny podział).',
    appReduction: 10,
    moveReduction: 2,
  },
  {
    min: 60,
    max: 69,
    label: 'Zaawansowany wiek (60–69)',
    eduImprovementChecks: 4,
    deductionPoints: 20,
    deductionDescription: 'Odejmij łącznie 20 punktów od SIŁ, KON lub ZRĘ (dowolny podział).',
    appReduction: 15,
    moveReduction: 3,
  },
  {
    min: 70,
    max: 79,
    label: 'Starość (70–79)',
    eduImprovementChecks: 4,
    deductionPoints: 40,
    deductionDescription: 'Odejmij łącznie 40 punktów od SIŁ, KON lub ZRĘ (dowolny podział).',
    appReduction: 20,
    moveReduction: 4,
  },
  {
    min: 80,
    max: 89,
    label: 'Sędziwy wiek (80–89)',
    eduImprovementChecks: 4,
    deductionPoints: 80,
    deductionDescription: 'Odejmij łącznie 80 punktów od SIŁ, KON lub ZRĘ (dowolny podział).',
    appReduction: 25,
    moveReduction: 5,
  },
]

export function getAgeRange(age: number): AgeRange | undefined {
  return AGE_RANGES.find((r) => age >= r.min && age <= r.max)
}

export function isYoungCharacter(age: number): boolean {
  return age >= 15 && age <= 19
}
