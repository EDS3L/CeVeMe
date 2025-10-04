package pl.ceveme.infrastructure.external.gemini;

import pl.ceveme.application.dto.gemini.DataContainer;
import pl.ceveme.application.dto.gemini.DataLinkContainer;

public class PromptBuilder {


    public static String createPrompt(DataLinkContainer dataLinkContainer) {
        return """
               # ROLA
               Ekspert HR światowej klasy & Architekt CV
               → Wygeneruj perfekcyjnie dopasowane CV w **czystym obiekcie JSON** (PL), zoptymalizowane pod ATS.

               # ZASADY KLUCZOWE
               1. **Less is More** – używaj tylko danych z `CANDIDATE_DATA`, które odpowiadają `JOB_OFFER`. Wyjątkiem jest educations oraz experience, które również używaj tylko danych z `CANDIDATE_DATA`lecz zwróć całe
               2. **Zero Hallucination** – nie dopisuj informacji spoza wejścia.
               3. **STAR + liczby** – każdy bullet zawiera konkretną miarę (% / PLN / wielkość zespołu).
               4. **Mirroring** – kopiuj słowa kluczowe z oferty.
               5. **Wyjście = czysty JSON** (bez markdown, bez komentarzy), język polski.
               6. **Chronologia odwrotna** („YYYY-MM – YYYY-MM” lub „YYYY-MM – obecnie”).
               7. **Limity** – max 2 stanowiska × 2/3 bulletów; bullet ≤ 2 linie / 25 słów.
               8. **Czasowniki + liczby** – każdy bullet zaczyna się silnym czasownikiem i liczbą.
               9. **Czasy** – bieżąca rola = teraźniejszy; poprzednie = przeszły; bez „ja”.
               10. **Znaki bezpieczne dla ATS** – unikaj <> ★ ✓ itp.
               11. **Dedup skills** – pogrupuj: Technical, Soft, Tools.
               12. **Summary max 250 zzs**.
               13. **Sekcje opcjonalne** – portfolio tylko gdy wspierają ofertę - 2 max bullet pointy.
               14. **Klauzula RODO** – polska.
               15. **Image** - dodaj do jsona do pola iamges - link url z danych usera


               # DANE WEJŚCIOWE
               ## 1. JOB_OFFER
               """ + dataLinkContainer.jobOffer() + """
               
               ## 2. CANDIDATE_DATA
               """ + dataLinkContainer.user() + dataLinkContainer.response() + """

               # SZABLON JSON  
               (wypełnij wszystkie pola; brak danych = "")
               ```json
                {
                  "personalData": {
                    "name": "",
                    "city": "",
                    "phoneNumber": "",
                    "email": "",
                    "images" "",
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
               ## WSKAZÓWKI DO WYPEŁNIANIA
               • **headline** – precyzyjny tytuł pasujący do oferty.  
               • **summary** – 2-3 zdania: rola + lata dośw., tech z oferty, liczby, dopasowanie do celów firmy, powinno być zwięzłe, angażujące, skupione na wartości dla pracodawcy i dostosowane do oferty pracy.
               • **experience** – Wybierz naistotniejsze i dodaj jobDescription (musi się znaleźć w odpowiedzi) - max 2 zdania 25 słów 
               • **skills** – najpierw słowa kluczowe z oferty, dedup.  
               • **portfolio** – tylko jeśli wzmacnia trafność- wymagane w przypadku it .
               • **educations** – zawsze zwracaj; jest to obowiązkowe.
               

               ---
               ### Najważniejsze
               • Zwrot **tylko obiekt JSON**.  
               • Pole **headline** nie może być puste.  
               • **Less is More** → filtrować dane wg wymagań.  
               • **STAR + liczby w bulletach**.  
               • Chronologia odwrotna & limity objętości.
               """;
    }
}
