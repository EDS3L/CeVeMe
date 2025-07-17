package pl.ceveme.application.usecase.gemini;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.gemini.GeminiExistOfferRequest;
import pl.ceveme.application.dto.gemini.GeminiLinkRequest;
import pl.ceveme.infrastructure.external.gemini.GeminiService;

@Service
public class GeminiResponseByOfferUrlUseCase {

    private final GeminiService geminiService;

    public GeminiResponseByOfferUrlUseCase(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String execute(GeminiLinkRequest request) throws Exception {
        return geminiService.responseByLink(request);
    }
}
