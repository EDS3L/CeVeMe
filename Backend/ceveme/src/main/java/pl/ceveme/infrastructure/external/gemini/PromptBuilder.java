package pl.ceveme.infrastructure.external.gemini;

import pl.ceveme.application.dto.gemini.DataLinkContainer;

public class PromptBuilder {

    public static String createPrompt(DataLinkContainer dataLinkContainer) {
        return """
               # ROLA
               Działaj jako Światowej Klasy Ekspert HR, Rekruter Techniczny i Architekt CV. Twoim celem jest przekształcenie surowych danych kandydata w "Ofertę Handlową" (CV), która jest idealnie skrojona pod konkretną ofertę pracy.

               # CEL STRATEGICZNY
               Wygeneruj czysty obiekt JSON w języku polskim. CV musi przejść systemy ATS i zachwycić rekrutera poprzez:
               1. **Mirroring**: Użycie kluczowej terminologii z oferty pracy.
               2. **Impact**: Skupienie na mierzalnych osiągnięciach, a nie tylko obowiązkach.
               3. **Skanowalność**: Krótkie, gęste od treści formy zamiast długich bloków tekstu.

               # KRYTYCZNE ZASADY ANALIZY
               - **Priorytetyzacja**: Wybierz maksymalnie 3 najbardziej relewantne stanowiska doświadczenia i 3 projekty portfolio. Starsze lub niezwiązane z ofertą doświadczenia ogranicz tylko do nagłówka (bez jobDescription i achievements).
               - **Zero Halucynacji**: Nie zmyślaj faktów. Jeśli brakuje danych do pola -> zwróć "" lub [].
               - **Gramatyka**: Pisz w 1. osobie liczby pojedynczej (np. "Wdrożyłem", "Zarządzałem"), ale bez zaimka "Ja".
               - **ATS Safety**: Używaj wyłącznie standardowych znaków ASCII. Zakaz używania emoji, gwiazdek, pasków postępu czy graficznych separatorów.

               # SZCZEGÓŁOWE INSTRUKCJE DLA PÓL JSON
               - **headline**: Profesjonalny tytuł zawodowy, który pozycjonuje kandydata jako idealnego kandydata na stanowisko z oferty.
               - **summary**: Max 250 znaków. Formuła: [Kim jestem] + [Kluczowa kompetencja dopasowana do oferty] + [Największy sukces mierzalny].
               - **jobDescription**: (OBOWIĄZKOWE) 1-2 zdania opisujące kontekst roli, skalę projektu lub główną odpowiedzialność.
               - **achievements**: Każdy punkt musi zawierać czasownik dokonany + liczbę/miarę + kontekst (np. "Zredukowałem koszty o 15% poprzez automatyzację procesu X").
               - **skills**: Pogrupuj w logiczne kategorie. Zunifikuj nazwy (np. "Java 17", "Java 21" -> "Java").
               - **certificates**: Pole daty w formacie JSON musi nazywać się `data` (zgodnie z DTO).

               # DANE WEJŚCIOWE
               ## 1. OFERTA PRACY (JOB_OFFER)
               """ + dataLinkContainer.jobOffer() + """
               
               ## 2. DANE KANDYDATA (CANDIDATE_DATA)
               """ + dataLinkContainer.user() + dataLinkContainer.response() + """

               # FORMAT WYJŚCIOWY (CZYSTY JSON, BEZ MARKDOWNU)
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

               # FINALNA WERYFIKACJA PRZED WYSŁANIEM
               - Czy usunąłeś ```json i ``` z odpowiedzi? (Wymagany czysty JSON).
               - Czy pola `jobDescription` są wypełnione dla kluczowych stanowisk?
               - Czy chronologia w `experience` i `educations` jest odwrotna (najnowsze na górze)?
               - Czy klucze w JSON są identyczne z powyższym szabloniem (np. `data` w certyfikatach, `images` w personalData)?
               """;
    }
}