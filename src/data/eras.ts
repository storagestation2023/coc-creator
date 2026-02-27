import type { Era } from '@/types/common'

export interface EraDefinition {
  id: Era
  name: string
  description: string
  wealthTable: WealthBracket[]
}

export interface WealthBracket {
  creditRatingMin: number
  creditRatingMax: number
  spendingLevel: string
  cash: string
  assets: string
}

export const ERAS: Record<Era, EraDefinition> = {
  classic_1920s: {
    id: 'classic_1920s',
    name: 'Klasyczna (lata 20.)',
    description: 'Ameryka lat 20. XX wieku — złota era Lovecrafta',
    wealthTable: [
      { creditRatingMin: 0, creditRatingMax: 0, spendingLevel: '0,50 $', cash: '0,50 $', assets: 'brak' },
      { creditRatingMin: 1, creditRatingMax: 9, spendingLevel: '2 $', cash: '10 $ (suma)', assets: '50 $ (suma)' },
      { creditRatingMin: 10, creditRatingMax: 49, spendingLevel: '10 $', cash: '50 $ (suma)', assets: '500 $ (suma)' },
      { creditRatingMin: 50, creditRatingMax: 89, spendingLevel: '50 $', cash: '250 $ (suma)', assets: '2 500 $ (suma)' },
      { creditRatingMin: 90, creditRatingMax: 98, spendingLevel: '250 $', cash: '1 250 $ (suma)', assets: '50 000 $ (suma)' },
      { creditRatingMin: 99, creditRatingMax: 99, spendingLevel: '5 000 $', cash: '50 000 $ (suma)', assets: '5 000 000 $ (suma)' },
    ],
  },
  modern: {
    id: 'modern',
    name: 'Współczesna',
    description: 'Czasy współczesne',
    wealthTable: [
      { creditRatingMin: 0, creditRatingMax: 0, spendingLevel: '5 $', cash: '5 $', assets: 'brak' },
      { creditRatingMin: 1, creditRatingMax: 9, spendingLevel: '20 $', cash: '100 $ (suma)', assets: '500 $ (suma)' },
      { creditRatingMin: 10, creditRatingMax: 49, spendingLevel: '100 $', cash: '500 $ (suma)', assets: '5 000 $ (suma)' },
      { creditRatingMin: 50, creditRatingMax: 89, spendingLevel: '500 $', cash: '2 500 $ (suma)', assets: '25 000 $ (suma)' },
      { creditRatingMin: 90, creditRatingMax: 98, spendingLevel: '2 500 $', cash: '12 500 $ (suma)', assets: '500 000 $ (suma)' },
      { creditRatingMin: 99, creditRatingMax: 99, spendingLevel: '50 000 $', cash: '500 000 $ (suma)', assets: '5 000 000 $ + (suma)' },
    ],
  },
  gaslight: {
    id: 'gaslight',
    name: 'Gaslight (epoka wiktoriańska)',
    description: 'Wiktoriańska Anglia lat 1890.',
    wealthTable: [
      { creditRatingMin: 0, creditRatingMax: 0, spendingLevel: '1 pens', cash: '1 pens', assets: 'brak' },
      { creditRatingMin: 1, creditRatingMax: 9, spendingLevel: '5 pensów', cash: '2 szylingi (suma)', assets: '1 funt (suma)' },
      { creditRatingMin: 10, creditRatingMax: 49, spendingLevel: '2 szylingi', cash: '10 szylingów (suma)', assets: '10 funtów (suma)' },
      { creditRatingMin: 50, creditRatingMax: 89, spendingLevel: '10 szylingów', cash: '50 szylingów (suma)', assets: '500 funtów (suma)' },
      { creditRatingMin: 90, creditRatingMax: 98, spendingLevel: '5 funtów', cash: '25 funtów (suma)', assets: '10 000 funtów (suma)' },
      { creditRatingMin: 99, creditRatingMax: 99, spendingLevel: '100 funtów', cash: '1 000 funtów (suma)', assets: '100 000 funtów + (suma)' },
    ],
  },
}

export function getWealthBracket(era: Era, creditRating: number): WealthBracket {
  const eraData = ERAS[era]
  for (const bracket of eraData.wealthTable) {
    if (creditRating >= bracket.creditRatingMin && creditRating <= bracket.creditRatingMax) {
      return bracket
    }
  }
  return eraData.wealthTable[0]
}
