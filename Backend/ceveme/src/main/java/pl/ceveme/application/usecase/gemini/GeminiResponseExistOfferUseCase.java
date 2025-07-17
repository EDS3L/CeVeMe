package pl.ceveme.application.usecase.gemini;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.gemini.GeminiExistOfferRequest;
import pl.ceveme.application.dto.gemini.GeminiResponse;
import pl.ceveme.infrastructure.external.gemini.GeminiService;

@Service
public class GeminiResponseExistOfferUseCase {

    private final GeminiService geminiService;

    public GeminiResponseExistOfferUseCase(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public GeminiResponse execute(GeminiExistOfferRequest request) throws JsonProcessingException {
        return geminiService.responseByExistOffer(request);
    }
}
