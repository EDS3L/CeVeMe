package pl.ceveme.application.dto.gemini.cvStructure;

import java.util.List;

public record Experience(String period, String title, String company, String location, List<Achievement> achievements) {
}
