package pl.ceveme.application.dto.gemini;

public record GeminiResponse(String summary,String personalData, String education, String skills, String experience, String portfolio, String certificates, String gdprClause) {
}
