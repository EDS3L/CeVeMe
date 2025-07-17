package pl.ceveme.infrastructure.controllers.gemini;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.gemini.GeminiExistOfferRequest;
import pl.ceveme.application.dto.gemini.GeminiLinkRequest;
import pl.ceveme.application.usecase.gemini.GeminiResponseByOfferUrlUseCase;
import pl.ceveme.application.usecase.gemini.GeminiResponseExistOfferUseCase;

@RestController
@RequestMapping("api/ai")
public class GeminiController {

    private final GeminiResponseExistOfferUseCase geminiResponseExistOfferUseCase;
    private final GeminiResponseByOfferUrlUseCase geminiResponseByOfferUrlUseCase;

    public GeminiController(GeminiResponseExistOfferUseCase geminiResponseExistOfferUseCase, GeminiResponseByOfferUrlUseCase geminiResponseByOfferUrlUseCase) {
        this.geminiResponseExistOfferUseCase = geminiResponseExistOfferUseCase;
        this.geminiResponseByOfferUrlUseCase = geminiResponseByOfferUrlUseCase;
    }

    @PostMapping("/geminiExistOffer")
    public String gemini(@RequestBody GeminiExistOfferRequest request) throws JsonProcessingException {
        return geminiResponseExistOfferUseCase.execute(request);
    }

    @PostMapping("/geminiByLink")
    public String gemini(@RequestBody GeminiLinkRequest request) throws Exception {
        return geminiResponseByOfferUrlUseCase.execute(request);
    }
}
