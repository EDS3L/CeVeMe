package pl.ceveme.application.usecase.gemini;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.gemini.GeminiRequest;
import pl.ceveme.infrastructure.external.gemini.GeminiAi;

@Service
public class GeminiResponseUseCase {

    private final GeminiAi geminiAi;

    public GeminiResponseUseCase(GeminiAi geminiAi) {
        this.geminiAi = geminiAi;
    }

    public String execute(GeminiRequest request) {
        return geminiAi.response(request);
    }
}
