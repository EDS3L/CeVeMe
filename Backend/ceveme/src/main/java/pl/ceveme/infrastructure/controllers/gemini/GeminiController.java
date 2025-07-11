package pl.ceveme.infrastructure.controllers.gemini;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.gemini.GeminiRequest;
import pl.ceveme.application.usecase.gemini.GeminiResponseUseCase;

@RestController
@RequestMapping("api/ai")
public class GeminiController {

    private final GeminiResponseUseCase geminiResponseUseCase;

    public GeminiController(GeminiResponseUseCase geminiResponseUseCase) {
        this.geminiResponseUseCase = geminiResponseUseCase;
    }

    @PostMapping("/gemini")
    public String gemini(@RequestBody GeminiRequest request) {
        return geminiResponseUseCase.execute(request);
    }
}
