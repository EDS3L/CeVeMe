package pl.ceveme.application.dto.gemini;

import pl.ceveme.application.dto.gemini.cvStructure.*;

import java.util.List;

public record GeminiResponse(String summary, String headline, PersonalData personalData, List<Educations> educations, List<Skills> skills, List<Experience> experience, List<Portfolio> portfolio, List<Certificate> certificates, List<Language> languages, String gdprClause) {

}
