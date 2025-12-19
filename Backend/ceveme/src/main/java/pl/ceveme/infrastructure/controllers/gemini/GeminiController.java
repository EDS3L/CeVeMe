package pl.ceveme.infrastructure.controllers.gemini;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.annotations.CheckAiEndpointUsage;
import pl.ceveme.application.dto.gemini.*;
import pl.ceveme.application.usecase.gemini.GeminiResponseByOfferUrlUseCase;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.EndpointType;
import pl.ceveme.domain.services.limits.CheckTimeout;
import pl.ceveme.infrastructure.external.gemini.TextRefinementService;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("api/ai")
public class GeminiController {

    private final GeminiResponseByOfferUrlUseCase geminiResponseByOfferUrlUseCase;
    private final TextRefinementService textRefinementService;
    private final CheckTimeout checkTimeout;

    public GeminiController(GeminiResponseByOfferUrlUseCase geminiResponseByOfferUrlUseCase, TextRefinementService textRefinementService, CheckTimeout checkTimeout) {
        this.geminiResponseByOfferUrlUseCase = geminiResponseByOfferUrlUseCase;
        this.textRefinementService = textRefinementService;
        this.checkTimeout = checkTimeout;
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

    @PostMapping("/timeout")
    public TimeoutResponse checkTimeout(@RequestParam EndpointType endpointType, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        return checkTimeout.checkTimeoutRemainingTime(userId,endpointType);
    }

}
