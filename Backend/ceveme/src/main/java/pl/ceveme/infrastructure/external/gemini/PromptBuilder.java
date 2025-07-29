package pl.ceveme.infrastructure.external.gemini;

import pl.ceveme.application.dto.gemini.DataContainer;
import pl.ceveme.application.dto.gemini.DataLinkContainer;

public class PromptBuilder {


    public static String createPrompt(DataContainer dataContainer) {
        return """
                # Rola: Ekspert HR światowej klasy & Architekt CV
                Twoją misją jest wygenerowanie perfekcyjnie dopasowanego CV w strukturze JSON, zoptymalizowanego pod ATS i wymagania nowoczesnych rekruterów.
                
                # Zasady kluczowe
                1.  **Less is More (dyrektywa główna):** Zachowaj wyłącznie te informacje z `CANDIDATE_DATA`, które bezpośrednio odpowiadają wymaganiom `JOB_OFFER`.
                2.  **Zero Hallucination:** Wykorzystuj jedynie dane z `CANDIDATE_DATA`. Nigdy nic nie dopisuj.
                3.  **Mierzalne osiągnięcia:** Każdy punkt opisuj metodą STAR, zawierając liczby (% / kwoty / wielkości zespołu).
                4.  **Mirroring słów kluczowych:** Używaj dokładnych terminów z `JOB_OFFER`.
                5.  **Format & Język:** Zwróć wyłącznie czysty obiekt **JSON** w profesjonalnym języku **polskim** – bez komentarzy i markdownu.
                6.  **Chronologia & Układ:** Sekcje „experience/education/…’’ w kolejności odwrotnie chronologicznej; daty „YYYY‑MM – YYYY‑MM” lub „YYYY‑MM – obecnie”.
                7.  **Limity objętości:** Maks. 4 stanowiska (5 bulletów każde); bullet ≤ 2 wiersze/25 słów.
                8.  **Silne czasowniki + liczby:** Każdy bullet zaczynaj czasownikiem w czasie przeszłym (lub teraźniejszym dla obecnej roli) i dodaj liczbę.
                9.  **Spójność czasów & bez „ja”:** Rolę bieżącą opisuj w czasie teraźniejszym, wcześniejsze w czasie przeszłym; unikaj 1. osoby.
                10. **Jednolite znaki:** Unikaj rzadkich znaków specjalnych (<> ★ ✓) – ATS bywa wrażliwy.
                11. **Deduplikacja skills:** Usuń duplikaty, pogrupuj logicznie (Technical, Soft, Tools).
                12. **ATS‑hybryda językowa:** Gdy `JOB_OFFER` jest po angielsku, dodaj kluczowe słowo w nawiasie, np. „zarządzanie projektami (project management)”.
                13. **Maks. długość summary:** do 600 zzs (ok. 90 słów).
                14. **Sekcje opcjonalne:** `portfolio`, `volunteering`, `awards`, `publications`, `references` – tylko jeśli wnoszą realną wartość pod ofertę.
                15. **Klauzula RODO** – polska wersja.
                
                ## Dane wejściowe
                ### 1. JOB_OFFER
                """
                + dataContainer.jobOffer()
                + """
                
                ### 2. CANDIDATE_DATA
                """
                + dataContainer.user() + dataContainer.response()
                + """
                
                ## Struktura wyjściowego JSON
                **WAŻNE:** zwróć WYŁĄCZNIE poniższy obiekt, wypełnij zgodnie z regułami; Zwróć wszystkie pola, te, które nie pasują pozostał "" ale mają być wszystkie.
                
                             {
                               "personalData": {
                                 "name": "",
                                 "city": "",
                                 "phone": "",
                                 "email": "",
                                 "links": [
                                   {
                                     "type": "linkedin|github|portfolio|website",
                                     "url": "",
                                     "label": ""
                                   }
                                 ]
                               },
                               "headline": {
                                 "title": ""
                               },
                               "summary": {
                                 "text": ""
                               },
                               "skills": [
                                 {
                                   "category": "Technical Skills",
                                   "items": [
                                     {
                                       "name": ""
                                     }
                                   ]
                                 }
                               ],
                               "experience": [
                                 {
                                   "period": "",
                                   "title": "",
                                   "company": "",
                                   "location": "",
                                   "achievements": [
                                     "Osiągnięcie z kwantyfikacją (np. Zwiększył wydajność o 30%)"
                                   ]
                                 }
                               ],
                               "portfolio": [
                                 {
                                   "name": "",
                                   "period": "YYYY-MM - YYYY-MM",
                                   "description": "",
                                   "technologies": [],
                                   "achievements": [],
                                   "url": "",
                                   "type": "Professional|Personal|Open Source"
                                 }
                               ],
                               "education": [
                                 {
                                   "period": "YYYY-MM - YYYY-MM",
                                   "degree": "",
                                   "institution": "",
                                   "location": "",
                                   "specialization": "",
                                   "grade": ""
                                 }
                               ],
                               "certificates": [
                                 {
                                   "name": "",
                                   "issuer": "",
                                   "date": "YYYY-MM",
                                   "validUntil": "YYYY-MM|Never expires",
                                   "credentialId": "",
                                   "url": ""
                                 }
                               ],
                               "languages": [
                                 {
                                   "language": "",
                                   "level": "A1|A2|B1|B2|C1|C2|Native"
                                 }
                               ],
                               "gdprClause": ""
                             }
                
                ## Wskazówki dot. zawartości JSON
                * **headline** - pamiętaj o dobrze skonstrułowanym tytule do oferty w lini headline
                * **summary:** 3‑4 zdania (≤ 600 zzs). Zacznij od roli i lat doświadczenia, wpleć 2‑3 kluczowe technologie z oferty + 1‑2 mierzalne osiągnięcia; zakończ dopasowaniem do celów firmy.
                * **experience:** Skoncentruj się na osiągnięciach (STAR). Usuń role nieistotne lub zbyt stare.
                * **skills:** Usuń duplikaty; najpierw te z `JOB_OFFER`.
                * **portfolio:** Umieszczaj tylko, gdy zwiększają trafność względem oferty.  
                """;
    }

    public static String createPrompt(DataLinkContainer dataLinkContainer) {
        return """
                # Rola: Ekspert HR światowej klasy & Architekt CV
                Twoją misją jest wygenerowanie perfekcyjnie dopasowanego CV w strukturze JSON, zoptymalizowanego pod ATS i wymagania nowoczesnych rekruterów.
                
                # Zasady kluczowe
                1.  **Less is More (dyrektywa główna):** Zachowaj wyłącznie te informacje z `CANDIDATE_DATA`, które bezpośrednio odpowiadają wymaganiom `JOB_OFFER`.
                2.  **Zero Hallucination:** Wykorzystuj jedynie dane z `CANDIDATE_DATA`. Nigdy nic nie dopisuj.
                3.  **Mierzalne osiągnięcia:** Każdy punkt opisuj metodą STAR, zawierając liczby (% / kwoty / wielkości zespołu).
                4.  **Mirroring słów kluczowych:** Używaj dokładnych terminów z `JOB_OFFER`.
                5.  **Format & Język:** Zwróć wyłącznie czysty obiekt **JSON** w profesjonalnym języku **polskim** – bez komentarzy i markdownu.
                6.  **Chronologia & Układ:** Sekcje „experience/education/…’’ w kolejności odwrotnie chronologicznej; daty „YYYY‑MM – YYYY‑MM” lub „YYYY‑MM – obecnie”.
                7.  **Limity objętości:** Maks. 4 stanowiska (5 bulletów każde); bullet ≤ 2 wiersze/25 słów.
                8.  **Silne czasowniki + liczby:** Każdy bullet zaczynaj czasownikiem w czasie przeszłym (lub teraźniejszym dla obecnej roli) i dodaj liczbę.
                9.  **Spójność czasów & bez „ja”:** Rolę bieżącą opisuj w czasie teraźniejszym, wcześniejsze w czasie przeszłym; unikaj 1. osoby.
                10. **Jednolite znaki:** Unikaj rzadkich znaków specjalnych (<> ★ ✓) – ATS bywa wrażliwy.
                11. **Deduplikacja skills:** Usuń duplikaty, pogrupuj logicznie (Technical, Soft, Tools).
                12. **ATS‑hybryda językowa:** Gdy `JOB_OFFER` jest po angielsku, dodaj kluczowe słowo w nawiasie, np. „zarządzanie projektami (project management)”.
                13. **Maks. długość summary:** do 600 zzs (ok. 90 słów).
                14. **Sekcje opcjonalne:** `portfolio` – tylko jeśli wnoszą realną wartość pod ofertę.
                15. **Klauzula RODO** – polska wersja.
                
                ## Dane wejściowe
                ### 1. JOB_OFFER
                """
                + dataLinkContainer.jobOffer()
                + """
                
                ### 2. CANDIDATE_DATA
                """
                + dataLinkContainer.user() + dataLinkContainer.response()
                + """
                
                ## Struktura wyjściowego JSON
                **WAŻNE:** zwróć WYŁĄCZNIE poniższy obiekt, wypełnij zgodnie z regułami; Zwróć wszystkie pola, te, które nie pasują pozostał "" ale mają być wszystkie.
                
                             {
                               "personalData": {
                                 "name": "",
                                 "city": "",
                                 "phone": "",
                                 "email": "",
                                 "links": [
                                   {
                                     "type": "linkedin|github|portfolio|website",
                                     "url": "",
                                     "label": ""
                                   }
                                 ]
                               },
                               "headline": {
                                 "title": ""
                               },
                               "summary": {
                                 "text": ""
                               },
                               "skills": [
                                 {
                                   "category": "Technical Skills",
                                   "items": [
                                     {
                                       "name": ""
                                     }
                                   ]
                                 }
                               ],
                               "experience": [
                                 {
                                   "period": "",
                                   "title": "",
                                   "company": "",
                                   "location": "",
                                   "achievements": [
                                     "Osiągnięcie z kwantyfikacją (np. Zwiększył wydajność o 30%)"
                                   ]
                                 }
                               ],
                               "portfolio": [
                                 {
                                   "name": "",
                                   "period": "YYYY-MM - YYYY-MM",
                                   "description": "",
                                   "technologies": [],
                                   "achievements": [],
                                   "url": "",
                                   "type": "Professional|Personal|Open Source"
                                 }
                               ],
                               "education": [
                                 {
                                   "period": "YYYY-MM - YYYY-MM",
                                   "degree": "",
                                   "institution": "",
                                   "location": "",
                                   "specialization": "",
                                   "grade": ""
                                 }
                               ],
                               "certificates": [
                                 {
                                   "name": "",
                                   "issuer": "",
                                   "date": "YYYY-MM",
                                   "validUntil": "YYYY-MM|Never expires",
                                   "credentialId": "",
                                   "url": ""
                                 }
                               ],
                               "languages": [
                                 {
                                   "language": "",
                                   "level": "A1|A2|B1|B2|C1|C2|Native"
                                 }
                               ],
                               "gdprClause": ""
                             }
                
                ## Wskazówki dot. zawartości JSON
                 * **headline** - pamiętaj o dobrze skonstrułowanym tytule do oferty w lini headline
                * **summary:** 3‑4 zdania (≤ 600 zzs). Zacznij od roli i lat doświadczenia, wpleć 2‑3 kluczowe technologie z oferty + 1‑2 mierzalne osiągnięcia; zakończ dopasowaniem do celów firmy.
                * **experience:** Skoncentruj się na osiągnięciach (STAR). Usuń role nieistotne lub zbyt stare.
                * **skills:** Usuń duplikaty; najpierw te z `JOB_OFFER`.
                * **portfolio** Umieszczaj tylko, gdy zwiększają trafność względem oferty.  
                """;
    }
}