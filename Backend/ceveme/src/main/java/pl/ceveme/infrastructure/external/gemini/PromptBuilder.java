package pl.ceveme.infrastructure.external.gemini;

import pl.ceveme.application.dto.gemini.DataLinkContainer;

public class PromptBuilder {

    public static String createPrompt(DataLinkContainer dataLinkContainer) {
        return """
               # ROLA
               Działaj jako Najlepszy na Świecie Strateg CV. Twoim zadaniem jest stworzenie CV, które jest "gęste" od merytoryki, profesjonalne i mieści się na JEDNEJ STRONIE A4.

               # CEL STRATEGICZNY
               Wygeneruj obiekt JSON, który sprzedaje kandydata poprzez konkretne rezultaty. Unikaj ogólników. Każde zdanie musi być dowodem na kompetencje.

               # KRYTYCZNE ZASADY MINIMALIZMU (ZASADA A4)
               - **Selekcja**: Wybierz tylko te dane, które pasują do JOB_OFFER.
               - **Limity**: 
                 - Summary: Max 220 znaków.
                 - Doświadczenie: Max 4 punkty na stanowisko.
                 - Portfolio: Max 2-3 kluczowe projekty.
               - **Styl**: Krótko, konkretnie, bez "lania wody".

               # ZASADY DLA PORTFOLIO / PROJEKTÓW (OBOWIĄZKOWE)
               AI często pomija opisy projektów – Tobie NIE WOLNO tego zrobić. Każdy projekt w sekcji `portfolio` musi zawierać minimum 2 konkretne osiągnięcia (`achievements`):
               1. **Cel i Funkcjonalność**: Co projekt rozwiązuje i dla kogo? (np. "Zaprojektowałem system do automatyzacji faktur, który eliminuje błędy ręcznego wprowadzania danych").
               2. **Wyzwanie Techniczne**: Jaką trudną kwestię rozwiązałeś? (np. "Zoptymalizowałem zapytania SQL, co pozwoliło na płynne przetwarzanie 1 mln rekordów").
               *Jeśli dane wejściowe są ubogie, wywnioskuj logiczne korzyści wynikające z użytego stosu technologicznego.*

               # INSTRUKCJE DLA PÓL JSON
               - **headline**: Profesjonalny tytuł zawodowy + "Value Proposition".
               - **summary**: [Kim jestem] + [Kluczowy wyróżnik/technologia] + [Mierzalny sukces].
               - **jobDescription**: Max 1 zdanie o skali i kontekście pracy.
               - **achievements**: Każdy punkt musi zawierać: [Czasownik] + [Liczba/Wynik] + [Kontekst].
               - **skills**: Pogrupuj w max 4 kategorie. Tylko technologie istotne dla oferty.

               # STYL I JĘZYK
               - Używaj "Action Verbs" (Zaimplementowałem, Przeskalowałem, Zintegrowałem).
               - 1. osoba liczby pojedynczej, profesjonalny ton.
               - Zero emoji, zero markdownu wewnątrz JSON.

               # DANE WEJŚCIOWE
               ## 1. OFERTA PRACY (JOB_OFFER)
               """ + dataLinkContainer.jobOffer() + """
               
               ## 2. DANE KANDYDATA (CANDIDATE_DATA)
               """ + dataLinkContainer.user() + dataLinkContainer.response() + """

               # FORMAT WYJŚCIOWY (CZYSTY JSON, BEZ ```json)
               {
                 "summary": "",
                 "headline": "",
                 "personalData": {
                   "name": "",
                   "city": "",
                   "phoneNumber": "",
                   "email": "",
                   "links": [
                     { "type": "linkedin|github|portfolio|website", "url": "" }
                   ],
                   "images": ""
                 },
                 "educations": [
                   {
                     "period": "YYYY-MM – YYYY-MM",
                     "degree": "",
                     "institution": "",
                     "specialization": ""
                   }
                 ],
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
                     "period": "YYYY-MM – YYYY-MM lub obecnie",
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
                 "certificates": [
                   {
                     "name": "",
                     "issuer": "",
                     "data": "YYYY-MM",
                     "description": ""
                   }
                 ],
                 "languages": [
                   { "language": "", "level": "A1|A2|B1|B2|C1|C2|Native" }
                 ],
                 "gdprClause": "Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z ustawą z dnia 10 maja 2018 roku o ochronie danych osobowych (Dz. Ustaw z 2018, poz. 1000) oraz zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie obserwacji osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO)."
               }

               # FINALNA WERYFIKACJA
               - Czy sekcja `portfolio` ma bogate, minimum 2-punktowe opisy osiągnięć dla każdego projektu?
               - Czy całość mieści się (wizualnie) na jednej stronie A4?
               - Czy usunąłeś tagi ```json?
               """;
    }
}