package pl.ceveme.infrastructure.external.interview;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.AnswerFeedback;
import pl.ceveme.domain.model.entities.InterviewQuestion;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.model.enums.DifficultyLevel;
import pl.ceveme.domain.model.enums.QuestionCategory;
import pl.ceveme.domain.model.enums.SessionMode;
import pl.ceveme.infrastructure.external.gemini.GeminiHttpClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
public class InterviewAIService {

    private static final Logger log = LoggerFactory.getLogger(InterviewAIService.class);

    private final GeminiHttpClient geminiHttpClient;
    private final ObjectMapper objectMapper;

    public InterviewAIService(GeminiHttpClient geminiHttpClient, ObjectMapper objectMapper) {
        this.geminiHttpClient = geminiHttpClient;
        this.objectMapper = objectMapper;
    }


    public List<InterviewQuestion> generateQuestions(JobOffer jobOffer, SessionMode mode, int questionCount) {
        String prompt = InterviewPromptBuilder.buildQuestionGenerationPrompt(jobOffer, mode, questionCount);

        try {
            String response = geminiHttpClient.getResponse(prompt).text();
            String cleanedJson = cleanJsonResponse(response);
            return parseQuestionsFromJson(cleanedJson);
        } catch (Exception e) {
            log.error("Failed to generate questions from AI", e);
            throw new RuntimeException("Nie udało się wygenerować pytań. Spróbuj ponownie.", e);
        }
    }


    public AnswerFeedback evaluateAnswer(InterviewQuestion question, String answer, SessionMode mode) {
        String prompt = InterviewPromptBuilder.buildAnswerFeedbackPrompt(question, answer, mode);

        try {
            String response = geminiHttpClient.getResponse(prompt).text();
            String cleanedJson = cleanJsonResponse(response);
            return parseFeedbackFromJson(cleanedJson);
        } catch (Exception e) {
            log.error("Failed to evaluate answer from AI", e);
            return generateFallbackFeedback();
        }
    }


    public Map<String, String> generateSessionSummary(String sessionData) {
        String prompt = InterviewPromptBuilder.buildSessionSummaryPrompt(sessionData);

        try {
            String response = geminiHttpClient.getResponse(prompt).text();
            String cleanedJson = cleanJsonResponse(response);
            return objectMapper.readValue(cleanedJson, new TypeReference<>() {});
        } catch (Exception e) {
            log.error("Failed to generate session summary", e);
            return Map.of(
                    "recommendations", "Kontynuuj ćwiczenie odpowiedzi na pytania rekrutacyjne.",
                    "strengthsSummary", "Analiza niedostępna.",
                    "weaknessesSummary", "Analiza niedostępna."
            );
        }
    }


    private List<InterviewQuestion> parseQuestionsFromJson(String json) throws JsonProcessingException {
        List<InterviewQuestion> questions = new ArrayList<>();
        JsonNode arrayNode = objectMapper.readTree(json);

        int index = 0;
        for (JsonNode node : arrayNode) {
            String questionText = node.get("questionText").asText();
            QuestionCategory category = QuestionCategory.valueOf(node.get("category").asText());
            DifficultyLevel difficulty = DifficultyLevel.valueOf(node.get("difficulty").asText());
            String expectedKeyPoints = node.has("expectedKeyPoints") ? node.get("expectedKeyPoints").asText() : null;
            String starHint = node.has("starHint") && !node.get("starHint").isNull() ? node.get("starHint").asText() : null;

            questions.add(InterviewQuestion.create(questionText, category, difficulty, expectedKeyPoints, starHint, index++));
        }

        return questions;
    }

    private AnswerFeedback parseFeedbackFromJson(String json) throws JsonProcessingException {
        JsonNode node = objectMapper.readTree(json);

        return AnswerFeedback.create(
                getIntOrDefault(node, "overallScore", 50),
                getIntOrNull(node, "situationScore"),
                getIntOrNull(node, "taskScore"),
                getIntOrNull(node, "actionScore"),
                getIntOrNull(node, "resultScore"),
                getIntOrDefault(node, "clarityScore", 50),
                getIntOrDefault(node, "relevanceScore", 50),
                getIntOrDefault(node, "depthScore", 50),
                getIntOrDefault(node, "confidenceScore", 50),
                getTextOrDefault(node, "strengths", ""),
                getTextOrDefault(node, "improvements", ""),
                getTextOrDefault(node, "sampleAnswer", ""),
                getTextOrDefault(node, "keyPointsCovered", ""),
                getTextOrDefault(node, "keyPointsMissed", "")
        );
    }

    private AnswerFeedback generateFallbackFeedback() {
        return AnswerFeedback.create(
                60, null, null, null, null,
                60, 60, 60, 60,
                "Odpowiedź została zarejestrowana. System AI jest chwilowo niedostępny.",
                "Ze względu na ograniczenia API, szczegółowa ocena jest niedostępna. Spróbuj ponownie za chwilę.",
                "Brak wzorcowej odpowiedzi - system AI niedostępny.",
                "",
                ""
        );
    }

    private String cleanJsonResponse(String response) {
        if (response == null) return "{}";
        String cleaned = response.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }

    private Integer getIntOrDefault(JsonNode node, String field, int defaultValue) {
        return node.has(field) && !node.get(field).isNull() ? node.get(field).asInt() : defaultValue;
    }

    private Integer getIntOrNull(JsonNode node, String field) {
        return node.has(field) && !node.get(field).isNull() ? node.get(field).asInt() : null;
    }

    private String getTextOrDefault(JsonNode node, String field, String defaultValue) {
        return node.has(field) && !node.get(field).isNull() ? node.get(field).asText() : defaultValue;
    }

    private List<String> parseStringList(JsonNode arrayNode) {
        List<String> result = new ArrayList<>();
        if (arrayNode != null && arrayNode.isArray()) {
            for (JsonNode item : arrayNode) {
                result.add(item.asText());
            }
        }
        return result;
    }
}
