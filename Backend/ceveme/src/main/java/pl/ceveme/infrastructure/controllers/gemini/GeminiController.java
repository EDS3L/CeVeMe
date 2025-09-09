package pl.ceveme.infrastructure.controllers.gemini;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.aop.CheckAiEndpointUsage;
import pl.ceveme.application.dto.gemini.*;
import pl.ceveme.application.usecase.gemini.GeminiResponseByOfferUrlUseCase;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.infrastructure.external.gemini.TextRefinementService;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("api/ai")
public class GeminiController {

    private final GeminiResponseByOfferUrlUseCase geminiResponseByOfferUrlUseCase;
    private final TextRefinementService textRefinementService;

    public GeminiController(GeminiResponseByOfferUrlUseCase geminiResponseByOfferUrlUseCase, TextRefinementService textRefinementService) {
        this.geminiResponseByOfferUrlUseCase = geminiResponseByOfferUrlUseCase;
        this.textRefinementService = textRefinementService;
    }


    @PostMapping("/geminiByLink")
    @CheckAiEndpointUsage(EndpointType.CV)
    public GeminiResponse gemini(@RequestBody GeminiLinkRequest request) throws Exception {
        return geminiResponseByOfferUrlUseCase.execute(request);
    }

    @PostMapping("/refinementText")
    @CheckAiEndpointUsage(EndpointType.REFINEMENT)
    public TextRefinementResult refinementRequirements(@RequestBody TextRefinementRequest request, Authentication authentication) throws AccessDeniedException {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        return textRefinementService.refinementRequirements(request,userId);
    }

}
