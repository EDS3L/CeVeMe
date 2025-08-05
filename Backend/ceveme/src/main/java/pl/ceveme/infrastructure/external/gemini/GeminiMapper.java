package pl.ceveme.infrastructure.external.gemini;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import pl.ceveme.application.dto.gemini.GeminiResponse;
import pl.ceveme.application.dto.gemini.cvStructure.*;

import java.util.ArrayList;
import java.util.List;

public interface GeminiMapper {


    default String cleanJsonResponse(String aiResponse) {
        if (aiResponse == null || aiResponse.trim()
                .isEmpty()) {
            throw new IllegalArgumentException("AI response is empty");
        }

        String cleaned = aiResponse.trim()
                .replaceAll("^```json\\s*", "")
                .replaceAll("^```\\s*", "")
                .replaceAll("\\s*```$", "");

        int firstBrace = cleaned.indexOf('{');
        int lastBrace = cleaned.lastIndexOf('}');

        if (firstBrace != -1 && lastBrace != -1 && firstBrace < lastBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
        return cleaned.trim();
    }

    default GeminiResponse parseJson(String json, ObjectMapper mapper) throws JsonProcessingException {

        JsonNode root = mapper.readTree(json);

        String summary = root.path("summary")
                .asText();
        String headline = root.path("headline")
                .asText();
        PersonalData personalData = mapper.treeToValue(root.path("personalData"), PersonalData.class);

        List<Educations> education = mapArray(root.path("education"), Educations.class, mapper);
        List<Skills> skills = mapArray(root.path("skills"), Skills.class, mapper);
        List<Experience> experience = mapArray(root.path("experience"), Experience.class, mapper);
        List<Portfolio> portfolio = mapArray(root.path("portfolio"), Portfolio.class, mapper);
        List<Certificate> certificates = mapArray(root.path("certificates"), Certificate.class, mapper);
        List<Language> languages = mapArray(root.path("languages"), Language.class, mapper);

        String gdprClause = root.path("gdprClause")
                .asText();

        return new GeminiResponse(summary, headline, personalData, education, skills, experience, portfolio, certificates, languages, gdprClause);
    }

    /* ---------- GENERYCZNE MAPOWANIE TABLICY ---------- */
    private <T> List<T> mapArray(JsonNode node, Class<T> clazz, ObjectMapper mapper) throws JsonProcessingException {
        List<T> result = new ArrayList<>();
        if (node == null || node.isMissingNode() || node.isNull()) {
            return result;                   // zwracamy pustą listę, nigdy null
        }
        if (node.isArray()) {
            for (JsonNode item : node) {
                result.add(mapper.treeToValue(item, clazz));
            }
        } else {                             // pojedynczy obiekt też przyjmujemy
            result.add(mapper.treeToValue(node, clazz));
        }
        return result;
    }
}
