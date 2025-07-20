# CeVeMe - Inteligentny Asystent Kariery

CeVeMe to zaawansowany system backendowy, który automatyzuje proces analizy ofert pracy poprzez web scraping i dopasowuje je do profilu zawodowego użytkownika za pomocą sztucznej inteligencji.

## Główne Funkcjonalności

*   **Rejestracja i Autoryzacja**: Bezpieczny system logowania i rejestracji oparty na tokenach JWT.
*   **Zarządzanie Profilem Zawodowym**: Umożliwia użytkownikom tworzenie i zarządzanie kompleksowym profilem kariery, w tym:
    *   Doświadczenie zawodowe
    *   Edukacja
    *   Umiejętności (Skills)
    *   Języki
    *   Kursy i Certyfikaty
    *   Linki do portfolio (np. GitHub, LinkedIn)
*   **Web Scraping Ofert Pracy**: Automatyczne pobieranie najnowszych ofert pracy z wiodących portali w Polsce:
    *   JustJoin.it
    *   NoFluffJobs
    *   BulldogJob
    *   Pracuj.pl
    *   RocketJobs
    *   Solid.jobs
    *   TheProtocol.it
*   **Analiza AI z Google Gemini**: Inteligentna analiza treści ofert pracy w celu oceny ich zgodności z profilem zawodowym użytkownika.
*   **RESTful API**: W pełni udokumentowane i gotowe do użycia API do integracji z dowolnym interfejsem użytkownika.

## Stos Technologiczny

*   **Język**: Java 17
*   **Framework**: Spring Boot 3
*   **Baza Danych**: Spring Data JPA (łatwa do skonfigurowania z H2, PostgreSQL, MySQL itp.)
*   **Bezpieczeństwo**: Spring Security, JSON Web Tokens (JWT)
*   **Build Tool**: Gradle
*   **Sztuczna Inteligencja**: Google Gemini API
*   **Testowanie**: JUnit 5, Mockito

## Instalacja i Uruchomienie

1.  **Klonowanie repozytorium:**
    ```bash
    git clone <adres-repozytorium>
    cd ceveme
    ```

2.  **Konfiguracja zmiennych środowiskowych:**
    Przed uruchomieniem upewnij się, że skonfigurowałeś dostęp do bazy danych oraz klucz API dla Gemini w pliku `src/main/resources/application.properties`.

3.  **Budowanie projektu:**
    Użyj Gradlew do zbudowania aplikacji:
    ```bash
    ./gradlew build
    ```

4.  **Uruchomienie aplikacji:**
    Aplikację można uruchomić za pomocą następującej komendy:
    ```bash
    ./gradlew bootRun
    ```
    Serwer domyślnie uruchomi się na porcie `8080`.

## Struktura Projektu

Projekt jest zorganizowany zgodnie z zasadami czystej architektury (Clean Architecture), aby zapewnić skalowalność i łatwość w utrzymaniu.

```
.
└── src/
    ├── main/
    │   ├── java/pl/ceveme/
    │   │   ├── application/    # Logika biznesowa, DTOs, przypadki użycia (use cases)
    │   │   ├── domain/         # Encje, repozytoria, logika domenowa
    │   │   └── infrastructure/ # Kontrolery, konfiguracja, adaptery, serwisy zewnętrzne
    │   └── resources/          # Pliki konfiguracyjne, np. application.properties
    └── test/                   # Testy jednostkowe i integracyjne
```

*   **`application`**: Warstwa aplikacji, która orkiestruje przepływ danych między infrastrukturą a domeną.
*   **`domain`**: Serce aplikacji. Zawiera modele biznesowe i reguły, które są niezależne od technologii.
*   **`infrastructure`**: Warstwa zewnętrzna. Odpowiada za komunikację ze światem (kontrolery REST), implementację repozytoriów oraz integrację z zewnętrznymi API.

## Plany na Przyszłość

Obecny backend jest w pełni funkcjonalny i stanowi solidną podstawę dla dalszego rozwoju. W najbliższych planach jest stworzenie nowoczesnego interfejsu użytkownika (UI) w oparciu o bibliotekę React.
