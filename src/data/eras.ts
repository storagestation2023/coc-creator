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

export interface TransportOption {
  id: string
  label: string
  description: string
  cost: number
}

export interface LifestyleLevel {
  id: string
  label: string
  description: string
  freeItemThreshold: number
  minCreditRating: number
  cost: number
}

export interface WealthForm {
  id: string
  label: string
  description: string
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
  transportOptions: TransportOption[]
}

// ── Lifestyle levels per era ──
// minCreditRating = CR at which this level is free
// cost = deducted from assets if player picks a level above their free tier

export const LIFESTYLE_LEVELS: Record<Era, LifestyleLevel[]> = {
  classic_1920s: [
    { id: 'poor', label: 'Biedny', description: 'Ledwo wiążesz koniec z końcem', freeItemThreshold: 0.5, minCreditRating: 0, cost: 0 },
    { id: 'modest', label: 'Skromny', description: 'Proste posiłki, tanie rozrywki', freeItemThreshold: 2, minCreditRating: 10, cost: 25 },
    { id: 'average', label: 'Przeciętny', description: 'Normalne restauracje, kino, prasa', freeItemThreshold: 5, minCreditRating: 25, cost: 75 },
    { id: 'wealthy', label: 'Zamożny', description: 'Dobre restauracje, kluby, rozrywka', freeItemThreshold: 15, minCreditRating: 50, cost: 250 },
    { id: 'luxury', label: 'Luksusowy', description: 'Najlepsze lokale, prywatne kluby', freeItemThreshold: 50, minCreditRating: 80, cost: 1000 },
  ],
  modern: [
    { id: 'poor', label: 'Biedny', description: 'Ledwo wiążesz koniec z końcem', freeItemThreshold: 5, minCreditRating: 0, cost: 0 },
    { id: 'modest', label: 'Skromny', description: 'Fast food, streaming, proste rozrywki', freeItemThreshold: 20, minCreditRating: 10, cost: 250 },
    { id: 'average', label: 'Przeciętny', description: 'Restauracje, kino, subskrypcje', freeItemThreshold: 50, minCreditRating: 25, cost: 750 },
    { id: 'wealthy', label: 'Zamożny', description: 'Dobre restauracje, siłownia, podróże', freeItemThreshold: 150, minCreditRating: 50, cost: 2500 },
    { id: 'luxury', label: 'Luksusowy', description: 'Najlepsze lokale, VIP, concierge', freeItemThreshold: 500, minCreditRating: 80, cost: 10000 },
  ],
  gaslight: [
    { id: 'poor', label: 'Biedny', description: 'Ledwo wiążesz koniec z końcem', freeItemThreshold: 0.004, minCreditRating: 0, cost: 0 },
    { id: 'modest', label: 'Skromny', description: 'Proste posiłki, tani pub', freeItemThreshold: 0.02, minCreditRating: 10, cost: 0.5 },
    { id: 'average', label: 'Przeciętny', description: 'Przyzwoite posiłki, herbaciarnia, teatr', freeItemThreshold: 0.05, minCreditRating: 25, cost: 1.5 },
    { id: 'wealthy', label: 'Zamożny', description: 'Dobre restauracje, kluby dżentelmenów', freeItemThreshold: 0.25, minCreditRating: 50, cost: 10 },
    { id: 'luxury', label: 'Luksusowy', description: 'Najlepsze lokale, prywatne kluby, opery', freeItemThreshold: 1, minCreditRating: 80, cost: 50 },
  ],
}

export const WEALTH_FORMS: Record<Era, WealthForm[]> = {
  classic_1920s: [
    { id: 'cash_safe', label: 'Gotówka w sejfie', description: 'Banknoty schowane w domu — łatwo dostępne, ale ryzykowne' },
    { id: 'bank_account', label: 'Konto bankowe', description: 'Bezpieczne oszczędności — wymagają wizyty w banku' },
    { id: 'bonds', label: 'Obligacje rządowe', description: 'Bezpieczna inwestycja z niskim zyskiem' },
    { id: 'stocks', label: 'Akcje giełdowe', description: 'Ryzykowna inwestycja — może przynieść fortunę lub ruinę' },
    { id: 'gold', label: 'Złoto i kosztowności', description: 'Trwała wartość, łatwa do ukrycia i przeniesienia' },
    { id: 'jewelry', label: 'Biżuteria', description: 'Klejnoty, zegarki, szlachetne kamienie' },
    { id: 'art', label: 'Dzieła sztuki', description: 'Obrazy, rzeźby, antyki — wartość zależy od znawcy' },
    { id: 'real_estate', label: 'Nieruchomości (dodatkowe)', description: 'Działka, kamienica do wynajmu, ziemia' },
    { id: 'goods', label: 'Towary (import/eksport)', description: 'Udziały w handlu towarami — zysk niepewny' },
  ],
  modern: [
    { id: 'cash_safe', label: 'Gotówka w sejfie', description: 'Banknoty w domu — łatwo dostępne, ale ryzykowne' },
    { id: 'bank_account', label: 'Konto bankowe', description: 'Bezpieczne oszczędności na koncie' },
    { id: 'bonds', label: 'Bezpieczne inwestycje (lokaty, obligacje)', description: 'Niski zysk, ale pewny' },
    { id: 'stocks', label: 'Akcje giełdowe', description: 'Portfel inwestycyjny na giełdzie' },
    { id: 'crypto', label: 'Kryptowaluty', description: 'Bitcoin, Ethereum — bardzo zmienne, ale potencjalnie zyskowne' },
    { id: 'gold', label: 'Złoto i kosztowności', description: 'Sztabki, monety — trwała wartość' },
    { id: 'art', label: 'Dzieła sztuki', description: 'Kolekcja sztuki współczesnej' },
    { id: 'real_estate', label: 'Nieruchomości (dodatkowe)', description: 'Mieszkanie na wynajem, działka' },
    { id: 'retirement', label: 'Fundusz emerytalny', description: 'Długoterminowe oszczędności — trudno dostępne' },
  ],
  gaslight: [
    { id: 'cash_safe', label: 'Gotówka w sejfie', description: 'Monety i banknoty w domowym sejfie' },
    { id: 'bank_account', label: 'Konto bankowe', description: 'Depozyty w banku — wymagają wizyty' },
    { id: 'consols', label: 'Obligacje rządowe (consols)', description: 'Bezpieczna inwestycja w Imperium Brytyjskie' },
    { id: 'railway', label: 'Akcje kolejowe i kopalniane', description: 'Ryzykowne udziały w przemyśle — mogą przynieść fortunę' },
    { id: 'gold', label: 'Złoto i kosztowności', description: 'Suwereny złote, kamienie szlachetne' },
    { id: 'heirloom_jewelry', label: 'Biżuteria rodowa', description: 'Rodzinne klejnoty przekazywane z pokolenia na pokolenie' },
    { id: 'art', label: 'Dzieła sztuki i antyki', description: 'Obrazy starych mistrzów, antyczne meble' },
    { id: 'real_estate', label: 'Nieruchomości (dodatkowe)', description: 'Kamienica w mieście, ziemia na wsi' },
    { id: 'colonial_goods', label: 'Towary kolonialne', description: 'Udziały w handlu z koloniami — herbata, przyprawy, jedwab' },
  ],
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
        transportOptions: [
          { id: 'walking', label: 'Pieszo', description: 'Brak środków na transport', cost: 0 },
        ],
      },
      {
        creditRatingMin: 1, creditRatingMax: 9,
        spendingLevel: '2 $', spendingLevelNumeric: 2,
        cash: '10 $ (suma)', cashNumeric: 10,
        assets: '50 $ (suma)', assetsNumeric: 50,
        housingOptions: [
          { id: 'shelter', label: 'Schronisko / noclegownia', description: 'Najbardziej podstawowe schronienie', cost: 0, ownership: 'free' },
          { id: 'flophouse', label: 'Tani pokój (wynajmowany)', description: 'Ciasny pokój w kiepskiej okolicy, ~5 $/mies.', cost: 15, ownership: 'rent' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Zniszczone, łatane ubranie', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe ubranie robotnika', cost: 15 },
        ],
        transportOptions: [
          { id: 'public_2nd', label: 'Komunikacja 2. klasy', description: 'Tramwaj, autobus — tanie przejazdy', cost: 0 },
          { id: 'bicycle', label: 'Rower', description: 'Prosty, ale niezawodny środek transportu', cost: 30 },
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
          { id: 'small_flat_own', label: 'Małe mieszkanie (własność)', description: 'Skromne mieszkanie na obrzeżach', cost: 350, ownership: 'own' },
          { id: 'cottage', label: 'Domek podmiejski (własność)', description: 'Mały domek na przedmieściach', cost: 450, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Zniszczone, łatane ubranie', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe ubranie robotnika lub urzędnika', cost: 15 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone, solidne materiały', cost: 50 },
        ],
        transportOptions: [
          { id: 'public_2nd', label: 'Komunikacja 2. klasy', description: 'Tramwaj, autobus — codzienne przejazdy', cost: 0 },
          { id: 'public_1st', label: 'Komunikacja 1. kl. + taksówki', description: 'Wygodne przejazdy, okazjonalne taksówki', cost: 50 },
          { id: 'bicycle', label: 'Rower', description: 'Prosty, ale niezawodny', cost: 30 },
          { id: 'motorcycle', label: 'Motocykl (Indian Scout)', description: 'Szybki i ekonomiczny', cost: 275 },
          { id: 'car_cheap', label: 'Słabe auto (Ford Model T)', description: 'Podstawowy samochód — niezawodny, ale skromny', cost: 260 },
        ],
      },
      {
        creditRatingMin: 50, creditRatingMax: 89,
        spendingLevel: '50 $', spendingLevelNumeric: 50,
        cash: '250 $ (suma)', cashNumeric: 250,
        assets: '2 500 $ (suma)', assetsNumeric: 2500,
        housingOptions: [
          { id: 'nice_apartment', label: 'Mieszkanie 2–3-pokojowe', description: 'Wygodne mieszkanie w dobrej dzielnicy', cost: 500, ownership: 'rent' },
          { id: 'large_apartment', label: 'Apartament', description: 'Przestronne mieszkanie w centrum', cost: 700, ownership: 'rent' },
          { id: 'suburban_house', label: 'Dom podmiejski (własność)', description: 'Skromny dom na przedmieściach', cost: 1200, ownership: 'own' },
          { id: 'house_garden', label: 'Dom z ogrodem (własność)', description: 'Wygodny dom z ogrodem i garażem', cost: 1800, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe ubranie', cost: 15 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone, solidne materiały', cost: 50 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Szycie na miarę, najlepsze tkaniny', cost: 150 },
        ],
        transportOptions: [
          { id: 'public_1st', label: 'Komunikacja 1. kl. + taksówki', description: 'Wygodne przejazdy i taksówki', cost: 0 },
          { id: 'motorcycle', label: 'Motocykl', description: 'Szybki środek transportu', cost: 275 },
          { id: 'car_cheap', label: 'Słabe auto', description: 'Podstawowy samochód', cost: 260 },
          { id: 'car_good', label: 'Dobre auto (Dodge/Buick)', description: 'Solidny, wygodny samochód', cost: 1000 },
        ],
      },
      {
        creditRatingMin: 90, creditRatingMax: 98,
        spendingLevel: '250 $', spendingLevelNumeric: 250,
        cash: '1 250 $ (suma)', cashNumeric: 1250,
        assets: '50 000 $ (suma)', assetsNumeric: 50000,
        housingOptions: [
          { id: 'luxury_apartment', label: 'Apartament luksusowy', description: 'Ekskluzywny apartament w centrum miasta', cost: 10000, ownership: 'rent' },
          { id: 'penthouse', label: 'Penthouse', description: 'Apartament na najwyższym piętrze z widokiem', cost: 15000, ownership: 'rent' },
          { id: 'villa', label: 'Willa (własność)', description: 'Okazała willa z ogrodem i garażem', cost: 20000, ownership: 'own' },
          { id: 'residence', label: 'Rezydencja (własność)', description: 'Prestiżowa rezydencja w najlepszej dzielnicy', cost: 30000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone', cost: 50 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Szycie na miarę, najlepsze tkaniny', cost: 150 },
          { id: 'evening', label: 'Garnitur / suknia wieczorowa', description: 'Strój na oficjalne okazje (dodatkowy)', cost: 75 },
        ],
        transportOptions: [
          { id: 'car_good', label: 'Dobre auto', description: 'Solidny, wygodny samochód', cost: 0 },
          { id: 'car_luxury', label: 'Luksusowe auto (Cadillac/Lincoln)', description: 'Prestiżowy samochód klasy premium', cost: 3500 },
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
        transportOptions: [
          { id: 'car_luxury', label: 'Luksusowe auto', description: 'Prestiżowy samochód klasy premium', cost: 0 },
          { id: 'car_collection', label: 'Kolekcja pojazdów', description: 'Kilka luksusowych samochodów, szofer', cost: 50000 },
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
        transportOptions: [
          { id: 'walking', label: 'Pieszo', description: 'Brak środków na transport', cost: 0 },
        ],
      },
      {
        creditRatingMin: 1, creditRatingMax: 9,
        spendingLevel: '20 $', spendingLevelNumeric: 20,
        cash: '100 $ (suma)', cashNumeric: 100,
        assets: '500 $ (suma)', assetsNumeric: 500,
        housingOptions: [
          { id: 'shelter', label: 'Schronisko', description: 'Schronienie dla bezdomnych', cost: 0, ownership: 'free' },
          { id: 'flophouse', label: 'Tani pokój', description: 'Pokój w kiepskiej okolicy, ~100 $/mies.', cost: 150, ownership: 'rent' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Zniszczone, z second-handu', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe sieciówkowe ubranie', cost: 100 },
        ],
        transportOptions: [
          { id: 'public_2nd', label: 'Komunikacja 2. klasy', description: 'Autobus, metro — tanie przejazdy', cost: 0 },
          { id: 'bicycle', label: 'Rower', description: 'Prosty środek transportu', cost: 300 },
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
          { id: 'small_flat_own', label: 'Małe mieszkanie (własność)', description: 'Skromne mieszkanie na obrzeżach', cost: 3500, ownership: 'own' },
          { id: 'cottage', label: 'Domek podmiejski (własność)', description: 'Mały domek na przedmieściach', cost: 4500, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Tanie, z second-handu', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe sieciówkowe ubranie', cost: 100 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Markowe ubranie', cost: 500 },
        ],
        transportOptions: [
          { id: 'public_2nd', label: 'Komunikacja 2. klasy', description: 'Autobus, metro — codzienne przejazdy', cost: 0 },
          { id: 'public_1st', label: 'Komunikacja 1. kl. + taksówki', description: 'Wygodne przejazdy, okazjonalne Uber', cost: 500 },
          { id: 'bicycle', label: 'Rower', description: 'Prosty środek transportu', cost: 300 },
          { id: 'motorcycle', label: 'Motocykl', description: 'Szybki i ekonomiczny', cost: 5000 },
          { id: 'car_cheap', label: 'Słabe auto (używane)', description: 'Podstawowy samochód z drugiej ręki', cost: 5000 },
        ],
      },
      {
        creditRatingMin: 50, creditRatingMax: 89,
        spendingLevel: '500 $', spendingLevelNumeric: 500,
        cash: '2 500 $ (suma)', cashNumeric: 2500,
        assets: '25 000 $ (suma)', assetsNumeric: 25000,
        housingOptions: [
          { id: 'nice_apartment', label: 'Mieszkanie w dobrej dzielnicy', description: 'Wygodne 2-3 pokoje, wynajem', cost: 5000, ownership: 'rent' },
          { id: 'large_apartment', label: 'Apartament', description: 'Przestronne mieszkanie w centrum', cost: 7000, ownership: 'rent' },
          { id: 'suburban_house', label: 'Dom podmiejski (własność)', description: 'Dom z ogródkiem na przedmieściach', cost: 12000, ownership: 'own' },
          { id: 'house_garden', label: 'Dom z ogrodem (własność)', description: 'Wygodny dom z garażem i ogrodem', cost: 18000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe sieciówkowe', cost: 100 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Markowe ubranie', cost: 500 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Projektanckie, szycie na miarę', cost: 1500 },
        ],
        transportOptions: [
          { id: 'public_1st', label: 'Komunikacja 1. kl. + taksówki', description: 'Wygodne przejazdy i Uber', cost: 0 },
          { id: 'motorcycle', label: 'Motocykl', description: 'Szybki środek transportu', cost: 5000 },
          { id: 'car_cheap', label: 'Słabe auto (używane)', description: 'Podstawowy samochód', cost: 5000 },
          { id: 'car_good', label: 'Dobre auto', description: 'Solidny, wygodny samochód', cost: 25000 },
        ],
      },
      {
        creditRatingMin: 90, creditRatingMax: 98,
        spendingLevel: '2 500 $', spendingLevelNumeric: 2500,
        cash: '12 500 $ (suma)', cashNumeric: 12500,
        assets: '500 000 $ (suma)', assetsNumeric: 500000,
        housingOptions: [
          { id: 'luxury_apartment', label: 'Apartament luksusowy', description: 'Ekskluzywne penthouse w centrum', cost: 100000, ownership: 'rent' },
          { id: 'penthouse', label: 'Penthouse', description: 'Apartament na szczycie wieżowca', cost: 150000, ownership: 'rent' },
          { id: 'villa', label: 'Willa (własność)', description: 'Willa z basenem i garażem', cost: 200000, ownership: 'own' },
          { id: 'residence', label: 'Rezydencja (własność)', description: 'Prestiżowa rezydencja w najlepszej okolicy', cost: 300000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Markowe ubranie', cost: 500 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Projektanckie, szycie na miarę', cost: 1500 },
          { id: 'evening', label: 'Strój wieczorowy', description: 'Strój na oficjalne okazje', cost: 750 },
        ],
        transportOptions: [
          { id: 'car_good', label: 'Dobre auto', description: 'Solidny, wygodny samochód', cost: 0 },
          { id: 'car_luxury', label: 'Luksusowe auto', description: 'Prestiżowy samochód klasy premium', cost: 80000 },
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
        transportOptions: [
          { id: 'car_luxury', label: 'Luksusowe auto', description: 'Prestiżowy samochód klasy premium', cost: 0 },
          { id: 'car_collection', label: 'Kolekcja pojazdów', description: 'Kilka luksusowych aut, szofer', cost: 500000 },
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
        transportOptions: [
          { id: 'walking', label: 'Pieszo', description: 'Brak środków na transport', cost: 0 },
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
        transportOptions: [
          { id: 'omnibus', label: 'Omnibus', description: 'Tani transport konny', cost: 0 },
          { id: 'bicycle', label: 'Rower', description: 'Prosty rower', cost: 0.5 },
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
          { id: 'small_flat_own', label: 'Małe kwatery (własność)', description: 'Skromne mieszkanie na obrzeżach', cost: 7, ownership: 'own' },
          { id: 'cottage', label: 'Domek na przedmieściu (własność)', description: 'Mały domek za miastem', cost: 9, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'poor', label: 'Ubranie kiepskiej jakości', description: 'Proste, zniszczone', cost: 0 },
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe ubranie klasy średniej', cost: 0.5 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone', cost: 2 },
        ],
        transportOptions: [
          { id: 'omnibus', label: 'Omnibus', description: 'Tani transport konny — codziennie', cost: 0 },
          { id: 'cab', label: 'Dorożka', description: 'Wygodne przejazdy dorożką', cost: 2 },
          { id: 'bicycle', label: 'Rower', description: 'Prosty rower', cost: 0.5 },
          { id: 'horse', label: 'Koń z siodłem', description: 'Własny koń — wygodny i szybki', cost: 5 },
        ],
      },
      {
        creditRatingMin: 50, creditRatingMax: 89,
        spendingLevel: '10 szylingów', spendingLevelNumeric: 0.5,
        cash: '50 szylingów (suma)', cashNumeric: 2.5,
        assets: '500 funtów (suma)', assetsNumeric: 500,
        housingOptions: [
          { id: 'nice_flat', label: 'Mieszkanie w dobrej dzielnicy', description: 'Wygodne mieszkanie, wynajem', cost: 100, ownership: 'rent' },
          { id: 'large_flat', label: 'Duże mieszkanie', description: 'Przestronne kwatery w dobrej okolicy', cost: 140, ownership: 'rent' },
          { id: 'townhouse', label: 'Kamienica (własność)', description: 'Dom w mieście z ogródkiem', cost: 250, ownership: 'own' },
          { id: 'house_garden', label: 'Dom z ogrodem (własność)', description: 'Wygodny dom z posesją', cost: 360, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'average', label: 'Ubranie przeciętne', description: 'Typowe', cost: 0.5 },
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone, angielska wełna', cost: 2 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Szycie na miarę u krawca', cost: 10 },
        ],
        transportOptions: [
          { id: 'cab', label: 'Dorożka', description: 'Regularne przejazdy dorożką', cost: 0 },
          { id: 'horse', label: 'Koń z siodłem', description: 'Własny koń wierzchowy', cost: 5 },
          { id: 'carriage', label: 'Powóz', description: 'Własny powóz z koniem', cost: 30 },
        ],
      },
      {
        creditRatingMin: 90, creditRatingMax: 98,
        spendingLevel: '5 funtów', spendingLevelNumeric: 5,
        cash: '25 funtów (suma)', cashNumeric: 25,
        assets: '10 000 funtów (suma)', assetsNumeric: 10000,
        housingOptions: [
          { id: 'mayfair_flat', label: 'Apartament w Mayfair', description: 'Eleganckie mieszkanie w prestiżowej dzielnicy', cost: 2000, ownership: 'rent' },
          { id: 'belgravia', label: 'Apartament w Belgravii', description: 'Luksusowe kwatery w najlepszej okolicy', cost: 3000, ownership: 'rent' },
          { id: 'country_house', label: 'Posiadłość wiejska (własność)', description: 'Dom ze służbą na wsi', cost: 4000, ownership: 'own' },
          { id: 'estate', label: 'Rezydencja (własność)', description: 'Okazała posiadłość z parkiem', cost: 6000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'good', label: 'Ubranie dobrej jakości', description: 'Dobrze skrojone', cost: 2 },
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Savile Row, najlepsze tkaniny', cost: 10 },
          { id: 'evening', label: 'Strój wieczorowy', description: 'Frak lub suknia balowa', cost: 5 },
        ],
        transportOptions: [
          { id: 'carriage', label: 'Powóz', description: 'Własny powóz z koniem', cost: 0 },
          { id: 'carriage_luxury', label: 'Powóz luksusowy', description: 'Elegancki powóz z parą koni', cost: 100 },
        ],
      },
      {
        creditRatingMin: 99, creditRatingMax: 99,
        spendingLevel: '100 funtów', spendingLevelNumeric: 100,
        cash: '1 000 funtów (suma)', cashNumeric: 1000,
        assets: '100 000 funtów + (suma)', assetsNumeric: 100000,
        housingOptions: [
          { id: 'grand_estate', label: 'Posiadłość ze służbą', description: 'Wielka posiadłość z parkiem i stajniami', cost: 20000, ownership: 'own' },
          { id: 'multiple_properties', label: 'Wiele nieruchomości', description: 'Rezydencja w Londynie i posiadłość na wsi', cost: 35000, ownership: 'own' },
        ],
        clothingOptions: [
          { id: 'excellent', label: 'Ubranie znakomitej jakości', description: 'Savile Row, najwyższa klasa', cost: 10 },
          { id: 'evening', label: 'Strój wieczorowy', description: 'Frak lub suknia balowa', cost: 5 },
        ],
        transportOptions: [
          { id: 'carriage_luxury', label: 'Powóz luksusowy', description: 'Elegancki powóz z parą koni', cost: 0 },
          { id: 'stable', label: 'Stajnia koni + powozy', description: 'Kilka koni i powozów, stangret', cost: 500 },
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
