# Tasklista projektu CoC Creator

## Aktywne zadania

_(brak aktywnych zadań)_

---

## Ukończone zadania

### Gotówka auto-wyliczona + forma majątku (ukończone)
- [x] Gotówka na ręce = auto-wyliczona (min z bracket.cashNumeric i remaining assets)
- [x] Wyświetlana jako nieedytowalny wynik
- [x] Usunięto inputy bank/inwestycje, dodano 7-10 opcji formy majątku per era
- [x] WealthForm interface + WEALTH_FORMS per era w eras.ts
- [x] Store: wealthFormId zamiast bankSavings/investments
- [x] StepReview + useCharacterSubmit zaktualizowane

### Po refreshu — ekran kodu + łatwy powrót (ukończone)
- [x] useEffect w WizardShell wymusza step 0 na mount
- [x] Przycisk "Zmień kod" (KeyRound) widoczny gdy currentStep > 0

### Wznowienie tworzenia postaci po tym samym kodzie (ukończone)
- [x] savedStep w store — śledzony automatycznie przez setStep/nextStep/prevStep
- [x] StepInviteCode: wykrywa ten sam kod → "Kontynuuj" / "Zacznij od nowa"
- [x] updateInviteCodeMeta — aktualizuje timesUsed bez resetowania postaci

### Rzuty stałe per kod zaproszenia (ukończone)
- [x] Cechy: rollAll() natychmiast zapisuje do store (store.setCharacteristics)
- [x] Szczęście: handleRollLuck() natychmiast zapisuje do store (store.setLuck)
- [x] EDU rolls: handleEduRoll() natychmiast zapisuje do store (store.setEduRolls)
- [x] Zamiana cech: handleSwap() natychmiast zapisuje do store
- [x] Wiek: handleAgeChange() natychmiast zapisuje do store
- [x] Dane przetrwają odświeżenie dzięki zustand persist + resume flow

### Skill specializations (ukończone)
- [x] Composite keys (nauka:Fizyka) w StepPersonalSkills
- [x] getSkillDisplayName() w Review, CharacterViewer, exportPdf

### Wealth/lifestyle system v1 (ukończone)
- [x] WealthBracket z housingOptions, clothingOptions
- [x] StepEquipment z wyborem mieszkania, ubrania
- [x] Asset allocation (gotówka/bank/inwestycje)
- [x] CR mini-preview w StepOccupationSkills

### Wealth/lifestyle system v2 (ukończone)
- [x] TransportOption + transportOptions per bracket
- [x] LifestyleLevel + LIFESTYLE_LEVELS per era (progi CR)
- [x] Housing rozbudowane do 4 opcji (2 rent + 2 own)
- [x] Ubranie i Transport usunięte z katalogu ekwipunku
- [x] Styl życia z progami darmowości (Biedny 0+, Skromny 10+, etc.)
- [x] Próg "darmowe" z lifestyle, nie spending level
