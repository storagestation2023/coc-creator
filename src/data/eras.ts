import type { Era } from '@/types/common'

export interface EraDefinition {
  id: Era
  name: string
  description: string
  currency: string
  wealthTable: WealthBracket[]
}

export interface HousingOption {
  id: string
  label: string
  description: string
  cost: number
  ownership: 'rent' | 'own' | 'free'
}

export interface ClothingOption {
  id: string
  label: string
  description: string
  cost: number
}

export interface WealthBracket {
  creditRatingMin: number
  creditRatingMax: number
  spendingLevel: string
  spendingLevelNumeric: number
  cash: string
  cashNumeric: number
  assets: string
  assetsNumeric: number
  housingOptions: HousingOption[]
  clothingOptions: ClothingOption[]
}

export const ERAS: Record<Era, EraDefinition> = {
  classic_1920s: {
    id: 'classic_1920s',
    name: 'Klasyczna (lata 20.)',
    description: 'Ameryka lat 20. XX wieku — złota era Lovecrafta',
    currency: '$',
    wealthTable: [
      {
        creditRatingMin: 0, creditRatingMax: 0,
        spendingLevel: '0,50 $', spendingLevelNumeric: 0.5,
        cash: '0,50 $', cashNumeric: 0.5,
        assets: 'brak', assetsNumeric: 0,
        housingOptions: [
          { id: 'homeless', label: 'Bezdomny', description: 'Śpi na ulicy, w schronisku lub w opuszczonych budynkach', cost: 0, ownership: 'free' },
        ],
        clothingOptions: [
          { id: 'rags', label: 'Łachmany', description: 'Zniszczone, brudne ubranie', cost: 0 },
        ],
      },
      {
        creditRatingMin: 1, creditRatingMax: 9,
        spendingLevel: '2 $', spendingLevelNumeric: 2,
        cash: '10 $ (suma)', cashNumeric: 10,
        assets: '50 $ (suma)', assetsNumeric: 50,
        housingOptions: [
          { id: 'shelter', label: 'Schronisko / noclegownia', description: 'Najbardziej podstawowe schronienie', cost: 0, ownership: 'free' },
          { id: 'family_room', label: 'Pokój u rodziny lub znajomych', description: 'Bezpłatne zakwaterowanie z łaski bliskich', cost: 0, ownership: 'free' },
          { id: 'flophouse', label: 'Tani pokój (wynajmowany)', description: 'Ciasny pokój w kiepskiej okolicy, ~5 $/mies.', cost: 15, ownership: 'rent' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Zniszczone, łatane ubranie', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe ubranie robotnika', cost: 15 },
        ],
      },
      {
        creditRatingMin: 10, creditRatingMax: 49,
        spendingLevel: '10 $', spendingLevelNumeric: 10,
        cash: '50 $ (suma)', cashNumeric: 50,
        assets: '500 $ (suma)', assetsNumeric: 500,
        housingOptions: [
          { id: 'boarding_room', label: 'Pokój w pensjonacie', description: 'Prosty pokój z posiłkami, ~20 $/mies.', cost: 100, ownership: 'rent' },
          { id: 'studio', label: 'Kawalerka wynajmowana', description: 'Skromne, ale własne lokum, ~30 $/mies.', cost: 175, ownership: 'rent' },
          { id: 'apartment_2room', label: 'Mieszkanie 2-pokojowe', description: 'Wygodne mieszkanie, ~50 $/mies.', cost: 275, ownership: 'rent' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Zniszczone, łatane ubranie', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe ubranie robotnika lub urzędnika', cost: 15 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone, solidne materiały', cost: 50 },
        ],
      },
      {
        creditRatingMin: 50, creditRatingMax: 89,
        spendingLevel: '50 $', spendingLevelNumeric: 50,
        cash: '250 $ (suma)', cashNumeric: 250,
        assets: '2 500 $ (suma)', assetsNumeric: 2500,
        housingOptions: [
          { id: 'nice_apartment', label: 'Mieszkanie 2–3-pokojowe', description: 'Wygodne mieszkanie w dobrej dzielnicy, wynajem', cost: 500, ownership: 'rent' },
          { id: 'suburban_house', label: 'Dom podmiejski (własność)', description: 'Skromny dom na przedmieściach', cost: 1200, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe ubranie', cost: 15 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone, solidne materiały', cost: 50 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Szycie na miarę, najlepsze tkaniny', cost: 150 },
        ],
      },
      {
        creditRatingMin: 90, creditRatingMax: 98,
        spendingLevel: '250 $', spendingLevelNumeric: 250,
        cash: '1 250 $ (suma)', cashNumeric: 1250,
        assets: '50 000 $ (suma)', assetsNumeric: 50000,
        housingOptions: [
          { id: 'luxury_apartment', label: 'Apartament luksusowy', description: 'Ekskluzywny apartament w centrum miasta', cost: 10000, ownership: 'rent' },
          { id: 'prestige_house', label: 'Dom w prestiżowej dzielnicy', description: 'Okazały dom z ogrodem i garażem', cost: 15000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone', cost: 50 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Szycie na miarę, najlepsze tkaniny', cost: 150 },
          { id: 'evening', label: 'Garnitur / suknia wieczorowa', description: 'Strój na oficjalne okazje (dodatkowy)', cost: 75 },
        ],
      },
      {
        creditRatingMin: 99, creditRatingMax: 99,
        spendingLevel: '5 000 $', spendingLevelNumeric: 5000,
        cash: '50 000 $ (suma)', cashNumeric: 50000,
        assets: '5 000 000 $ (suma)', assetsNumeric: 5000000,
        housingOptions: [
          { id: 'mansion', label: 'Rezydencja ze służbą', description: 'Imponująca rezydencja z ogrodem i garażem', cost: 500000, ownership: 'own' },
          { id: 'multiple_properties', label: 'Wiele nieruchomości', description: 'Posiadłości w różnych lokalizacjach', cost: 1000000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Szycie na miarę, najlepsze tkaniny', cost: 150 },
          { id: 'evening', label: 'Garnitur / suknia wieczorowa', description: 'Strój na oficjalne okazje (dodatkowy)', cost: 75 },
        ],
      },
    ],
  },
  modern: {
    id: 'modern',
    name: 'Współczesna',
    description: 'Czasy współczesne',
    currency: '$',
    wealthTable: [
      {
        creditRatingMin: 0, creditRatingMax: 0,
        spendingLevel: '5 $', spendingLevelNumeric: 5,
        cash: '5 $', cashNumeric: 5,
        assets: 'brak', assetsNumeric: 0,
        housingOptions: [
          { id: 'homeless', label: 'Bezdomny', description: 'Śpi na ulicy, w schronisku lub w samochodzie', cost: 0, ownership: 'free' },
        ],
        clothingOptions: [
          { id: 'rags', label: 'Łachmany', description: 'Zniszczone, brudne ubranie', cost: 0 },
        ],
      },
      {
        creditRatingMin: 1, creditRatingMax: 9,
        spendingLevel: '20 $', spendingLevelNumeric: 20,
        cash: '100 $ (suma)', cashNumeric: 100,
        assets: '500 $ (suma)', assetsNumeric: 500,
        housingOptions: [
          { id: 'shelter', label: 'Schronisko', description: 'Schronienie dla bezdomnych', cost: 0, ownership: 'free' },
          { id: 'family_room', label: 'Pokój u rodziny', description: 'Bezpłatne zakwaterowanie z łaski bliskich', cost: 0, ownership: 'free' },
          { id: 'flophouse', label: 'Tani pokój', description: 'Pokój w kiepskiej okolicy, ~100 $/mies.', cost: 150, ownership: 'rent' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Zniszczone, z second-handu', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe sieciówkowe ubranie', cost: 100 },
        ],
      },
      {
        creditRatingMin: 10, creditRatingMax: 49,
        spendingLevel: '100 $', spendingLevelNumeric: 100,
        cash: '500 $ (suma)', cashNumeric: 500,
        assets: '5 000 $ (suma)', assetsNumeric: 5000,
        housingOptions: [
          { id: 'room_shared', label: 'Pokój we wspólnym mieszkaniu', description: 'Współlokator, ~400 $/mies.', cost: 1000, ownership: 'rent' },
          { id: 'studio', label: 'Kawalerka wynajmowana', description: 'Małe mieszkanie, ~600 $/mies.', cost: 1750, ownership: 'rent' },
          { id: 'apartment_2room', label: 'Mieszkanie 2-pokojowe', description: 'Wygodne mieszkanie, ~900 $/mies.', cost: 2750, ownership: 'rent' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Tanie, z second-handu', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe sieciówkowe ubranie', cost: 100 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Markowe ubranie', cost: 500 },
        ],
      },
      {
        creditRatingMin: 50, creditRatingMax: 89,
        spendingLevel: '500 $', spendingLevelNumeric: 500,
        cash: '2 500 $ (suma)', cashNumeric: 2500,
        assets: '25 000 $ (suma)', assetsNumeric: 25000,
        housingOptions: [
          { id: 'nice_apartment', label: 'Mieszkanie w dobrej dzielnicy', description: 'Wygodne 2-3 pokoje, wynajem', cost: 5000, ownership: 'rent' },
          { id: 'suburban_house', label: 'Dom podmiejski (własność)', description: 'Dom z ogródkiem na przedmieściach', cost: 12000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe sieciówkowe', cost: 100 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Markowe ubranie', cost: 500 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Projektanckie, szycie na miarę', cost: 1500 },
        ],
      },
      {
        creditRatingMin: 90, creditRatingMax: 98,
        spendingLevel: '2 500 $', spendingLevelNumeric: 2500,
        cash: '12 500 $ (suma)', cashNumeric: 12500,
        assets: '500 000 $ (suma)', assetsNumeric: 500000,
        housingOptions: [
          { id: 'luxury_apartment', label: 'Apartament luksusowy', description: 'Ekskluzywne penthouse w centrum', cost: 100000, ownership: 'rent' },
          { id: 'prestige_house', label: 'Dom w prestiżowej dzielnicy', description: 'Willa z basenem i garażem', cost: 150000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Markowe ubranie', cost: 500 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Projektanckie, szycie na miarę', cost: 1500 },
          { id: 'evening', label: 'Strój wieczorowy', description: 'Strój na oficjalne okazje', cost: 750 },
        ],
      },
      {
        creditRatingMin: 99, creditRatingMax: 99,
        spendingLevel: '50 000 $', spendingLevelNumeric: 50000,
        cash: '500 000 $ (suma)', cashNumeric: 500000,
        assets: '5 000 000 $ + (suma)', assetsNumeric: 5000000,
        housingOptions: [
          { id: 'mansion', label: 'Rezydencja ze służbą', description: 'Luksusowa willa z obsługą', cost: 2000000, ownership: 'own' },
          { id: 'multiple_properties', label: 'Wiele nieruchomości', description: 'Apartamenty i domy w wielu miastach', cost: 3000000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Haute couture', cost: 1500 },
          { id: 'evening', label: 'Strój wieczorowy', description: 'Na oficjalne gale', cost: 750 },
        ],
      },
    ],
  },
  gaslight: {
    id: 'gaslight',
    name: 'Gaslight (epoka wiktoriańska)',
    description: 'Wiktoriańska Anglia lat 1890.',
    currency: '£',
    wealthTable: [
      {
        creditRatingMin: 0, creditRatingMax: 0,
        spendingLevel: '1 pens', spendingLevelNumeric: 0.01,
        cash: '1 pens', cashNumeric: 0.01,
        assets: 'brak', assetsNumeric: 0,
        housingOptions: [
          { id: 'homeless', label: 'Bezdomny', description: 'Śpi na ulicy lub w przytułku', cost: 0, ownership: 'free' },
        ],
        clothingOptions: [
          { id: 'rags', label: 'Łachmany', description: 'Zniszczone, brudne łachmany', cost: 0 },
        ],
      },
      {
        creditRatingMin: 1, creditRatingMax: 9,
        spendingLevel: '5 pensów', spendingLevelNumeric: 0.05,
        cash: '2 szylingi (suma)', cashNumeric: 0.1,
        assets: '1 funt (suma)', assetsNumeric: 1,
        housingOptions: [
          { id: 'workhouse', label: 'Przytułek / dom pracy', description: 'Darmowe, ale ponure schronienie', cost: 0, ownership: 'free' },
          { id: 'lodging', label: 'Kwatera (tania)', description: 'Pokój w ciasnej kamienicy, ~2 szylingi/tydz.', cost: 0.3, ownership: 'rent' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Zniszczone, łatane', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Proste ubranie robotnika', cost: 0.5 },
        ],
      },
      {
        creditRatingMin: 10, creditRatingMax: 49,
        spendingLevel: '2 szylingi', spendingLevelNumeric: 0.1,
        cash: '10 szylingów (suma)', cashNumeric: 0.5,
        assets: '10 funtów (suma)', assetsNumeric: 10,
        housingOptions: [
          { id: 'boarding_room', label: 'Pokój w pensjonacie', description: 'Prosty pokój z posiłkami, ~10 szylingów/mies.', cost: 2, ownership: 'rent' },
          { id: 'lodgings', label: 'Wynajmowane kwatery', description: 'Skromne mieszkanie, ~1 funt/mies.', cost: 3.5, ownership: 'rent' },
          { id: 'flat', label: 'Mieszkanie 2-pokojowe', description: 'Wygodne mieszkanie, ~2 funty/mies.', cost: 5.5, ownership: 'rent' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Proste, zniszczone', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe ubranie klasy średniej', cost: 0.5 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone', cost: 2 },
        ],
      },
      {
        creditRatingMin: 50, creditRatingMax: 89,
        spendingLevel: '10 szylingów', spendingLevelNumeric: 0.5,
        cash: '50 szylingów (suma)', cashNumeric: 2.5,
        assets: '500 funtów (suma)', assetsNumeric: 500,
        housingOptions: [
          { id: 'nice_flat', label: 'Mieszkanie w dobrej dzielnicy', description: 'Wygodne mieszkanie, wynajem', cost: 100, ownership: 'rent' },
          { id: 'townhouse', label: 'Kamienica (własność)', description: 'Dom w mieście z ogródkiem', cost: 250, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe', cost: 0.5 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone, angielska wełna', cost: 2 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Szycie na miarę u krawca', cost: 10 },
        ],
      },
      {
        creditRatingMin: 90, creditRatingMax: 98,
        spendingLevel: '5 funtów', spendingLevelNumeric: 5,
        cash: '25 funtów (suma)', cashNumeric: 25,
        assets: '10 000 funtów (suma)', assetsNumeric: 10000,
        housingOptions: [
          { id: 'mayfair_flat', label: 'Apartament w Mayfair', description: 'Eleganckie mieszkanie w prestiżowej dzielnicy', cost: 2000, ownership: 'rent' },
          { id: 'country_house', label: 'Posiadłość wiejska', description: 'Dom ze służbą na wsi', cost: 3000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone', cost: 2 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Savile Row, najlepsze tkaniny', cost: 10 },
          { id: 'evening', label: 'Strój wieczorowy', description: 'Frak lub suknia balowa', cost: 5 },
        ],
      },
      {
        creditRatingMin: 99, creditRatingMax: 99,
        spendingLevel: '100 funtów', spendingLevelNumeric: 100,
        cash: '1 000 funtów (suma)', cashNumeric: 1000,
        assets: '100 000 funtów + (suma)', assetsNumeric: 100000,
        housingOptions: [
          { id: 'estate', label: 'Posiadłość ze służbą', description: 'Wielka posiadłość z parkiem i stajniami', cost: 20000, ownership: 'own' },
          { id: 'multiple_properties', label: 'Wiele nieruchomości', description: 'Rezydencja w Londynie i posiadłość na wsi', cost: 35000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Savile Row, najwyższa klasa', cost: 10 },
          { id: 'evening', label: 'Strój wieczorowy', description: 'Frak lub suknia balowa', cost: 5 },
        ],
      },
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

/** Format a numeric value with the era's currency symbol */
export function formatCurrency(era: Era, amount: number): string {
  const currency = ERAS[era].currency
  if (currency === '£') {
    if (amount < 0.05) return `${Math.round(amount * 240)} pensów`
    if (amount < 1) return `${Math.round(amount * 20)} szylingów`
    return `${amount.toLocaleString('pl')} funtów`
  }
  return `${amount.toLocaleString('pl')} $`
}
