package pl.ceveme.application.dto.gemini.cvStructure;

import java.util.List;

public record Portfolio(String name, List<Technologies> technologies, List<Achievement> achievements, String url) {
}
