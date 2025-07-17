package pl.ceveme.infrastructure.external.gemini;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import pl.ceveme.application.dto.gemini.GeminiResponse;

import java.util.logging.Logger;

public interface GeminiMapper {


    default String cleanJsonResponse(String aiResponse) {
        if (aiResponse == null || aiResponse.trim().isEmpty()) {
            throw new IllegalArgumentException("AI response is empty");
        }

        String cleaned = aiResponse.trim();

        cleaned = cleaned.replaceAll("^```json\\s*", "");
        cleaned = cleaned.replaceAll("^```\\s*", "");
        cleaned = cleaned.replaceAll("\\s*```$", "");

        int firstBrace = cleaned.indexOf('{');
        int lastBrace = cleaned.lastIndexOf('}');

        if (firstBrace != -1 && lastBrace != -1 && firstBrace < lastBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }

        return cleaned.trim();
    }

    default GeminiResponse parseJsonManually(String jsonString, ObjectMapper objectMapper) throws JsonProcessingException {
        JsonNode node = objectMapper.readTree(jsonString);

        return new GeminiResponse(
                getNodeAsString(node, "summary"),
                getNodeAsString(node, "personalData"),
                getNodeAsString(node, "education"),
                getNodeAsString(node, "skills"),
                getNodeAsString(node, "experience"),
                getNodeAsString(node, "portfolio"),
                getNodeAsString(node, "certificates"),
                getNodeAsString(node, "gdprClause")
        );
    }

    private String getNodeAsString(JsonNode node, String fieldName) {
        JsonNode fieldNode = node.get(fieldName);

        if (fieldNode == null || fieldNode.isNull()) {
            return "";
        }

        if (fieldNode.isTextual()) {
            return fieldNode.asText();
        }

        if (fieldNode.isObject() || fieldNode.isArray()) {
            return formatJsonNode(fieldNode);
        }

        return fieldNode.asText();
    }

    private String formatJsonNode(JsonNode node) {
        try {
            if (node.isObject()) {
                return formatJsonObject(node);
            } else if (node.isArray()) {
                return formatJsonArray(node);
            }
            return node.toString();
        } catch (Exception e) {
            return node.toString();
        }
    }

    private String formatJsonObject(JsonNode objectNode) {
        StringBuilder sb = new StringBuilder();
        objectNode.fields().forEachRemaining(entry -> {
            String key = entry.getKey();
            JsonNode value = entry.getValue();

            if (sb.length() > 0) {
                sb.append("\n");
            }

            if (value.isTextual()) {
                sb.append(key).append(": ").append(value.asText());
            } else if (value.isObject() || value.isArray()) {
                sb.append(key).append(": ").append(formatJsonNode(value));
            } else {
                sb.append(key).append(": ").append(value.asText());
            }
        });
        return sb.toString();
    }

    private String formatJsonArray(JsonNode arrayNode) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < arrayNode.size(); i++) {
            JsonNode item = arrayNode.get(i);

            if (sb.length() > 0) {
                sb.append("\n");
            }

            if (item.isTextual()) {
                sb.append("• ").append(item.asText());
            } else if (item.isObject()) {
                sb.append("• ").append(formatJsonObject(item));
            } else {
                sb.append("• ").append(item.asText());
            }
        }
        return sb.toString();
    }
}
