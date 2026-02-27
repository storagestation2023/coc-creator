/**
 * All Polish UI strings for the app.
 * Official terminology from "Zew Cthulhu — Podręcznik Badacza" (7th Edition, Polish)
 */
export const PL = {
  // App
  app_title: 'Zew Cthulhu — Kreator Badacza',
  app_subtitle: 'Zew Cthulhu 7. Edycja',

  // Roles
  investigator: 'Badacz',
  keeper: 'Strażnik Tajemnic',
  character_sheet: 'Karta Badacza',

  // Navigation
  home: 'Strona główna',
  admin: 'Panel MG',
  back: 'Wstecz',
  next: 'Dalej',
  submit: 'Zatwierdź',
  cancel: 'Anuluj',
  save: 'Zapisz',
  delete: 'Usuń',
  edit: 'Edytuj',
  close: 'Zamknij',
  copy: 'Kopiuj',
  download: 'Pobierz',

  // Wizard steps
  step_invite_code: 'Kod zaproszenia',
  step_basic_info: 'Dane podstawowe',
  step_characteristics: 'Cechy',
  step_age_modifiers: 'Modyfikatory wiekowe',
  step_derived: 'Atrybuty pochodne',
  step_occupation: 'Zawód',
  step_occupation_skills: 'Umiejętności zawodowe',
  step_personal_skills: 'Umiejętności osobiste',
  step_backstory: 'Historia postaci',
  step_equipment: 'Ekwipunek',
  step_review: 'Podsumowanie',

  // Characteristics
  characteristic_str: 'Siła (SIŁ)',
  characteristic_con: 'Kondycja (KON)',
  characteristic_siz: 'Budowa (BUD)',
  characteristic_dex: 'Zręczność (ZRĘ)',
  characteristic_app: 'Wygląd (WYG)',
  characteristic_int: 'Inteligencja (INT)',
  characteristic_pow: 'Moc (MOC)',
  characteristic_edu: 'Wykształcenie (WYK)',

  // Derived
  hit_points: 'Punkty Wytrzymałości',
  magic_points: 'Punkty Magii',
  sanity: 'Poczytalność',
  damage_bonus: 'Premia do Obrażeń',
  build: 'Krzepa',
  move_rate: 'Ruch',
  dodge: 'Unik',
  luck: 'Szczęście',

  // Creation methods
  method_dice: 'Rzut kośćmi',
  method_point_buy: 'Kupowanie punktów',
  method_direct: 'Swobodne wprowadzanie',

  // Eras
  era_classic: 'Klasyczna (lata 20.)',
  era_modern: 'Współczesna',
  era_gaslight: 'Gaslight (epoka wiktoriańska)',

  // Skills
  occupation_skills: 'Umiejętności zawodowe',
  personal_skills: 'Umiejętności osobiste (zainteresowania)',
  skill_points_remaining: 'Pozostałe punkty',
  base_value: 'Wartość bazowa',
  added_points: 'Dodane punkty',
  total: 'Suma',
  credit_rating: 'Majętność',

  // Backstory
  backstory_ideology: 'Ideologia / Przekonania',
  backstory_significant_people: 'Ważne osoby',
  backstory_meaningful_locations: 'Znaczące miejsca',
  backstory_treasured_possessions: 'Rzeczy osobiste',
  backstory_traits: 'Przymioty',
  backstory_appearance: 'Opis postaci',
  backstory_key_connection: 'Kluczowa więź',
  roll_random: 'Losuj (1K10)',

  // Equipment
  equipment: 'Ekwipunek',
  spending_level: 'Poziom życia',
  cash: 'Gotówka',
  assets: 'Majątek',
  add_item: 'Dodaj przedmiot',
  custom_item: 'Własny przedmiot',
  budget_remaining: 'Pozostały budżet',

  // Admin
  admin_title: 'Panel Strażnika Tajemnic',
  admin_login: 'Logowanie',
  admin_password: 'Hasło',
  generate_code: 'Wygeneruj kod',
  invite_codes: 'Kody zaproszenia',
  characters: 'Postacie',
  code: 'Kod',
  method: 'Metoda',
  era: 'Era',
  max_tries: 'Maks. prób',
  times_used: 'Użyto',
  active: 'Aktywny',
  status: 'Status',

  // Status
  status_draft: 'Szkic',
  status_submitted: 'Zatwierdzona',

  // Messages
  invite_code_prompt: 'Wprowadź kod zaproszenia otrzymany od Strażnika Tajemnic',
  invite_code_invalid: 'Nieprawidłowy kod zaproszenia.',
  invite_code_expired: 'Kod zaproszenia wyczerpał limit użyć.',
  invite_code_inactive: 'Kod zaproszenia jest nieaktywny.',
  character_submitted: 'Postać została pomyślnie utworzona!',
  character_submitted_desc: 'Twój Badacz jest gotowy. Możesz wyeksportować kartę postaci.',
  confirm_submit: 'Czy na pewno chcesz zatwierdzić postać? Po zatwierdzeniu nie będzie możliwości edycji.',
  export_text: 'Eksportuj jako tekst',
  export_pdf: 'Eksportuj jako PDF',

  // Errors
  error_generic: 'Wystąpił błąd. Spróbuj ponownie.',
  error_network: 'Błąd połączenia z serwerem.',
  error_not_found: 'Nie znaleziono.',
  loading: 'Ładowanie...',
} as const

export type TranslationKey = keyof typeof PL
