package pl.ceveme.infrastructure.external.interview;

import pl.ceveme.domain.model.entities.InterviewQuestion;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.enums.SessionMode;

public class InterviewPromptBuilder {


    public static String buildQuestionGenerationPrompt(JobOffer jobOffer, SessionMode mode, int questionCount) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Jesteś ekspertem HR i rekruterem technicznym. ");
        prompt.append("Wygeneruj ").append(questionCount).append(" unikalnych pytań rekrutacyjnych PO POLSKU.\n\n");

        prompt.append("=== DANE OFERTY PRACY ===\n");
        prompt.append("STANOWISKO: ").append(jobOffer.getTitle()).append("\n");
        if (jobOffer.getCompany() != null) {
            prompt.append("FIRMA: ").append(jobOffer.getCompany()).append("\n");
        }
        if (jobOffer.getExperienceLevel() != null) {
            prompt.append("POZIOM DOŚWIADCZENIA: ").append(jobOffer.getExperienceLevel()).append("\n");
        }

        if (jobOffer.getRequirements() != null && !jobOffer.getRequirements().isBlank()) {
            prompt.append("\nWYMAGANIA:\n").append(jobOffer.getRequirements()).append("\n");
        }
        if (jobOffer.getResponsibilities() != null && !jobOffer.getResponsibilities().isBlank()) {
            prompt.append("\nOBOWIĄZKI:\n").append(jobOffer.getResponsibilities()).append("\n");
        }
        if (jobOffer.getNiceToHave() != null && !jobOffer.getNiceToHave().isBlank()) {
            prompt.append("\nMILE WIDZIANE:\n").append(jobOffer.getNiceToHave()).append("\n");
        }
        if (jobOffer.getBenefits() != null && !jobOffer.getBenefits().isBlank()) {
            prompt.append("\nBENEFITY:\n").append(jobOffer.getBenefits()).append("\n");
        }

        prompt.append("\n=== ZASADY GENEROWANIA PYTAŃ ===\n");
        prompt.append("1. PROPORCJE KATEGORII:\n");
        prompt.append("   - 75% TECHNICAL - konkretne pytania o technologie wymienione w wymaganiach\n");
        prompt.append("   - 15% SITUATIONAL - pytania sytuacyjne związane z obowiązkami\n");
        prompt.append("   - 10% BEHAVIORAL - pytania behawioralne o doświadczenie\n\n");
        
        prompt.append("2. TRUDNOŚĆ:\n");
        prompt.append("   - 25% EASY - podstawowe pytania\n");
        prompt.append("   - 50% MEDIUM - średniozaawansowane\n");
        prompt.append("   - 25% HARD - zaawansowane pytania\n\n");
        
        prompt.append("3. WYMAGANIA JAKOŚCIOWE:\n");
        prompt.append("   - KAŻDE pytanie MUSI odnosić się do KONKRETNEJ technologii/umiejętności z oferty\n");
        prompt.append("   - Pytania muszą być praktyczne i sprawdzające rzeczywistą wiedzę\n");
        prompt.append("   - ZABRONIONE: 'Opowiedz o sobie', 'Dlaczego chcesz tu pracować?', ogólniki\n");
        prompt.append("   - Pytania muszą być zróżnicowane - nie powtarzaj schematów\n");
        prompt.append("   - Dla pytań BEHAVIORAL dodaj starHint z metodą STAR\n\n");

        prompt.append("=== FORMAT ODPOWIEDZI (JSON ARRAY) ===\n");
        prompt.append("[\n");
        prompt.append("  {\n");
        prompt.append("    \"questionText\": \"Treść pytania po polsku\",\n");
        prompt.append("    \"category\": \"TECHNICAL|SITUATIONAL|BEHAVIORAL\",\n");
        prompt.append("    \"difficulty\": \"EASY|MEDIUM|HARD\",\n");
        prompt.append("    \"expectedKeyPoints\": \"Kluczowe elementy oczekiwanej odpowiedzi\",\n");
        prompt.append("    \"starHint\": \"Podpowiedź STAR dla pytań BEHAVIORAL, null dla innych\"\n");
        prompt.append("  }\n");
        prompt.append("]\n\n");
        prompt.append("Zwróć TYLKO JSON array bez dodatkowego tekstu.");

        return prompt.toString();
    }

    public static String buildAnswerFeedbackPrompt(InterviewQuestion question, String answer, SessionMode mode) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Oceń odpowiedź kandydata na pytanie rekrutacyjne. Bądź SZCZEGÓŁOWY i SPRAWIEDLIWY.\n\n");

        prompt.append("PYTANIE: ").append(question.getQuestionText()).append("\n");
        prompt.append("KATEGORIA: ").append(question.getCategory().name()).append("\n");
        if (question.getExpectedKeyPoints() != null && !question.getExpectedKeyPoints().isEmpty()) {
            prompt.append("OCZEKIWANE: ").append(question.getExpectedKeyPoints()).append("\n");
        }
        prompt.append("\nODPOWIEDŹ KANDYDATA:\n").append(answer).append("\n\n");

        prompt.append("ZASADY OCENY (0-100):\n");
        prompt.append("- 0-30: Błędna/brak odpowiedzi\n");
        prompt.append("- 31-50: Słaba, brakuje kluczowych elementów\n");
        prompt.append("- 51-70: Przeciętna, podstawowe elementy są\n");
        prompt.append("- 71-85: Dobra, większość kluczowych punktów\n");
        prompt.append("- 86-100: Świetna, kompletna odpowiedź\n\n");

        prompt.append("OCEŃ REALNIE na podstawie treści odpowiedzi! Nie dawaj 50 domyślnie.\n\n");

        prompt.append("Zwróć JSON:\n");
        prompt.append("{\"overallScore\":X,\"clarityScore\":X,\"relevanceScore\":X,\"depthScore\":X,\"confidenceScore\":X,");
        if (question.getCategory().name().equals("BEHAVIORAL")) {
            prompt.append("\"situationScore\":X,\"taskScore\":X,\"actionScore\":X,\"resultScore\":X,");
        }
        prompt.append("\"strengths\":\"mocne strony po polsku\",\"improvements\":\"do poprawy po polsku\",");
        prompt.append("\"sampleAnswer\":\"wzorcowa odpowiedź max 3 zdania\",\"keyPointsCovered\":\"co było\",\"keyPointsMissed\":\"co pominięto\"}");

        return prompt.toString();
    }

    public static String buildSessionSummaryPrompt(String sessionData) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Jesteś coachem kariery analizującym wyniki rozmowy kwalifikacyjnej.\n\n");

        prompt.append("=== DANE SESJI ===\n");
        prompt.append(sessionData).append("\n\n");

        prompt.append("=== INSTRUKCJE ===\n");
        prompt.append("Na podstawie wyników sesji przygotuj:\n");
        prompt.append("1. Szczegółowe rekomendacje rozwojowe\n");
        prompt.append("2. Podsumowanie mocnych stron kandydata\n");
        prompt.append("3. Podsumowanie obszarów do poprawy\n\n");

        prompt.append("=== FORMAT ODPOWIEDZI (JSON) ===\n");
        prompt.append("{\n");
        prompt.append("  \"recommendations\": \"Szczegółowe rekomendacje w punktach (po polsku)\",\n");
        prompt.append("  \"strengthsSummary\": \"Podsumowanie mocnych stron (po polsku)\",\n");
        prompt.append("  \"weaknessesSummary\": \"Podsumowanie obszarów do poprawy (po polsku)\"\n");
        prompt.append("}\n");

        return prompt.toString();
    }

    private static String getModeDescription(SessionMode mode) {
        return switch (mode) {
            case TEXT_BASIC -> "Tryb podstawowy tekstowy - pytania standardowe, bez limitu czasu";
            case TEXT_TIMED -> "Tryb czasowy - pytania z limitem czasu, symulacja presji czasowej";
            case VOICE_BASIC -> "Tryb głosowy podstawowy - odpowiedzi ustne, standardowe tempo";
            case VOICE_PRESSURE -> "Tryb presji - symulacja stresującej rozmowy, trudniejsze pytania";
            case REALTIME_FEEDBACK -> "Tryb z natychmiastowym feedbackiem po każdej odpowiedzi";
        };
    }
}
