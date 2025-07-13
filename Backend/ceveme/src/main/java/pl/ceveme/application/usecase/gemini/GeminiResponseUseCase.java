package pl.ceveme.application.usecase.gemini;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.gemini.GeminiRequest;
import pl.ceveme.infrastructure.external.gemini.GeminiService;

@Service
public class GeminiResponseUseCase {

    private final GeminiService geminiService;

    public GeminiResponseUseCase(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String execute(GeminiRequest request) {
        return geminiService.response(request);
    }
}
