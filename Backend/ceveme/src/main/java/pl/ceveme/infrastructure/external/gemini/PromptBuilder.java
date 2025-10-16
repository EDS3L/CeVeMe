package pl.ceveme.infrastructure.external.gemini;

import pl.ceveme.application.dto.gemini.DataLinkContainer;

public class PromptBuilder {


    public static String createPrompt(DataLinkContainer dataLinkContainer) {
        return """
               # ROLA
               Ekspert HR światowej klasy & Architekt CV
               → Wygeneruj perfekcyjnie dopasowane CV w **czystym obiekcie JSON** (PL), zoptymalizowane pod ATS.

               # ZASADY KLUCZOWE
               1. **Inteligentne filtrowanie** – używaj tylko danych z `CANDIDATE_DATA`, które są istotne dla `JOB_OFFER`. Wyjątki:
                  - `experience`: zwróć wszystkie wpisy chronologicznie, ale `achievements` filtruj pod ofertę
                  - `educations`: zwróć wszystkie wpisy chronologicznie bez filtrowania
               2. **Zero Hallucination** – nie dopisuj informacji spoza wejścia. Brak danych = puste pole "" lub pusta tablica [].
               3. **STAR + liczby** – priorytetowo używaj konkretnych miar (%, PLN, wielkość zespołu, czas). Jeśli niemożliwe: opisz konkretny impact (np. "skrócenie procesu o 2 dni").
               4. **Mirroring** – kopiuj kluczowe słowa z oferty (technologie, metodyki, narzędzia).
               5. **Wyjście = czysty JSON** (bez markdown, bez komentarzy, bez ```, bez "```json"), tylko sam obiekt JSON.
               6. **Chronologia odwrotna** – od najnowszych. Format dat: "YYYY-MM – YYYY-MM" lub "YYYY-MM – obecnie".
               7. **Limity objętości**:
                  - Experience: maksymalnie 3 ostatnie stanowiska
                  - Achievements na stanowisko: 2-4 bulletów (optymalnie 3)
                  - Długość bulletu: maksymalnie 2 linie tekstu lub 35 słów
                  - Portfolio: maksymalnie 3 projekty (każdy z 2 bulletami achievements)
                  - Summary: maksymalnie 250 znaków ze spacjami
               8. **Struktura bulletu** – rozpocznij silnym czasownikiem (Wdrożyłem, Zwiększyłem, Zoptymalizowałem, Zarządzałem, Stworzyłem), następnie liczba/miara, potem kontekst.
               9. **Czasy gramatyczne** – bieżąca rola = czas teraźniejszy; zakończone role = czas przeszły; unikaj pierwszej osoby ("ja") jednocześnie pisz w pierwszej osobie liczby pojedyńczej.
               10. **Znaki bezpieczne dla ATS** – używaj tylko standardowych znaków ASCII. Unikaj: <> ★ ✓ • ◆ → oraz emoji.
               11. **Deduplikacja skills** – pogrupuj w kategorie (Technical Skills, Soft Skills, Tools & Technologies). Zunifikuj duplikaty (React.js = React = ReactJS → "React").
               12. **Sekcje opcjonalne**:
                   - `portfolio`: OBOWIĄZKOWE dla IT; dla non-IT tylko jeśli wzmacnia profil. Każdy projekt WYMAGA `achievements` (co robi/osiągnął projekt).
                   - `certificates`: dodaj tylko jeśli wspierają ofertę (np. AWS cert dla roli cloud).
                   - `links`: dodaj tylko istniejące (LinkedIn, GitHub, portfolio, website).
               13. **RODO** – użyj dokładnie tego tekstu w `gdprClause`.
               14. **Obrazek profilowy** – przekopiuj URL z danych kandydata do pola `images` (jeśli brak → "").

               # DANE WEJŚCIOWE
               ## 1. JOB_OFFER
               """ + dataLinkContainer.jobOffer() + """
               
               ## 2. CANDIDATE_DATA
               """ + dataLinkContainer.user() + dataLinkContainer.response() + """

               # SZABLON JSON
               (wypełnij wszystkie pola; brak danych = "" lub [])
                ```json
                {
                  "personalData": {
                    "name": "",
                    "city": "",
                    "phoneNumber": "",
                    "email": "",
                    "images": "",
                    "links": [
                      { "type": "linkedin|github|portfolio|website", "url": "" }
                    ]
                  },
                  "headline": "",
                  "summary": "",
                  "skills": [
                    {
                      "category": "",
                      "items": [
                        { "name": "" }
                      ]
                    }
                  ],
                
                  "experience": [
                    {
                      "period": "",
                      "title": "",
                      "company": "",
                      "location": "",
                      "jobDescription": "",
                      "achievements": [
                        { "description": "" }
                      ]
                    }
                  ],
                
                  "portfolio": [
                    {
                      "name": "",
                      "technologies": [
                        { "name": "" }
                      ],
                      "achievements": [
                        { "description": "" }
                      ],
                      "url": ""
                    }
                  ],
                
                  "educations": [
                    {
                      "period": "YYYY-MM – YYYY-MM",
                      "degree": "",
                      "institution": "",
                      "specialization": ""
                    }
                  ],
                
                  "certificates": [
                    {
                      "name": "",
                      "issuer": "",
                      "date": "YYYY-MM",
                      "description": ""
                    }
                  ],
                
                  "languages": [
                    { "language": "", "level": "A1|A2|B1|B2|C1|C2|Native" }
                  ],
                
                  "gdprClause": ""
                }
```
               
               ## SZCZEGÓŁOWE WSKAZÓWKI DO WYPEŁNIANIA
               
               ### personalData
               - `name`: pełne imię i nazwisko
               - `images`: URL do zdjęcia profilowego (jeśli dostępne w danych kandydata)
               - `links`: tylko istniejące linki; jeśli brak → pusta tablica []
               
               ### headline
               - Precyzyjny tytuł zawodowy dopasowany do oferty (np. "Senior Full-Stack Developer" dla oferty senior developer)
               - NIE kopiuj dosłownie tytułu z CV – dostosuj do poziomu i wymagań oferty
               - Pole OBOWIĄZKOWE – nie może być puste
               
               ### summary
               - 2-3 zdania (max 250 znaków ze spacjami)
               - Struktura: [rola + lata doświadczenia] + [kluczowe technologie] + [największe osiągnięcie z liczbą] + [cel zawodowy połączony z misją/produktem firmy] - opisana w sposób naturalny, w profesjonalnym tonie - bez młodzieżowych słów. Wzoruj się na przykładzie.
               - Przykład: "Pasjonat nowych technologii z 2 letnim doświadczeniem w Java i React, nastawiony na zrozumienie potrzeb użytkowników i tworzenie skutecznych rozwiązań. Cenię współpracę, rozwój i ciągłe doskonalenie w środowisku technologicznym.."
               
               ### skills
               - Pierwszeństwo: słowa kluczowe z oferty pracy
               - Pogrupuj w kategorie: "Technical Skills", "Soft Skills", "Tools & Technologies"
               - Zunifikuj duplikaty (JavaScript/JS → "JavaScript", React.js/ReactJS → "React")
               - Usuń zbędne szczegóły (nie: "React 18.2.0", tylko: "React")
               
               ### experience
               - Zwróć wszystkie stanowiska w kolejności chronologicznej odwrotnej (najnowsze pierwsze)
               - Maksymalnie 3 ostatnie stanowiska – jeśli kandydat ma więcej, wybierz najistotniejsze dla oferty
               - `jobDescription`: 1-2 zdania (max 25 słów) opisujące zakres obowiązków. Przykład: "Odpowiedzialność za rozwój aplikacji webowej obsługującej 50k użytkowników dziennie."
               - `achievements`: 2-4 bulletów na stanowisko (optymalnie 3)
                 * Każdy bullet: czasownik + liczba + kontekst
                 * Filtruj tylko te osiągnięcia, które pasują do oferty
                 * Max 2 linie/30 słów każdy
                 * Przykład: "Zoptymalizowałem pipeline CI/CD, redukując czas deploymentu z 45 do 12 minut (73% redukcja)"
               
               ### portfolio
               - **OBOWIĄZKOWE dla IT** – dodaj 2-3 najistotniejsze projekty
               - **Opcjonalne dla non-IT** – tylko jeśli wzmacnia profil
               - Każdy projekt MUSI mieć `achievements` (2/3 bullety):
                 * Opisz co robi projket, co umożliwia, opis oraz z czego projekt jest zbudowany(technologia)
                 * Przykład: "użytkownik może się zalogować, dodać swoje ulubione filmy do list i wyszukać na ich podstawie podobne),
               - `technologies`: lista kluczowych tech (max 5 najważniejszych)
               - `url`: link do projektu (GitHub/live demo) – jeśli brak → ""
               
               ### educations
               - Zwróć WSZYSTKIE wpisy chronologicznie (najnowsze pierwsze)
               - Pole OBOWIĄZKOWE – zawsze wypełnij, nawet jeśli kandydat ma tylko szkołę średnią
               - `specialization`: kierunek studiów (jeśli dotyczy)
               
               ### certificates
               - Dodaj tylko certyfikaty istotne dla oferty (np. AWS dla cloud, PSM dla Scrum Mastera)
               - Jeśli kandydat ma wiele certów, wybierz max 3-4 najważniejsze
               - Jeśli brak istotnych → pusta tablica []
               
               ### languages
               - Zawsze uwzględnij język polski (poziom Native)
               - Dodaj tylko języki z potwierdzonym poziomem
               - Poziomy: A1, A2, B1, B2, C1, C2, Native
               
               ### gdprClause
               Użyj dokładnie tego tekstu:
               "Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z ustawą z dnia 10 maja 2018 roku o ochronie danych osobowych (Dz. Ustaw z 2018, poz. 1000) oraz zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO)."

               ---
               
               # CHECKLIST KOŃCOWY (przed zwróceniem JSON)
               ✓ JSON jest poprawny składniowo (bez markdown, bez ```)
               ✓ Pole `headline` nie jest puste
               ✓ Pole `educations` nie jest puste (zawsze zwróć wszystkie)
               ✓ Portfolio ma wypełnione `achievements` (jeśli sekcja istnieje)
               ✓ Wszystkie bullety zaczynają się czasownikiem i zawierają liczby/miary
               ✓ Chronologia jest odwrotna (najnowsze → najstarsze)
               ✓ Używasz tylko danych z `CANDIDATE_DATA`
               ✓ Mirroring: kluczowe słowa z oferty są w skills/summary/achievements
               ✓ Klauzula RODO jest dokładnie skopiowana
               ✓ Brak znaków specjalnych (★ ✓ →)
               """;
    }
}