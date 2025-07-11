package pl.ceveme.application.usecase.scrap;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.infrastructure.external.scrap.pracujPl.PracujPlScrapper;

import java.io.IOException;

@Service
public class ScrapPracujPlUseCase {

    private final PracujPlScrapper pracujPlScrapper;

    public ScrapPracujPlUseCase(PracujPlScrapper pracujPlScrapper) {
        this.pracujPlScrapper = pracujPlScrapper;
    }

    public ScrapResponse execute() throws IOException {
        return new ScrapResponse(pracujPlScrapper.createJobs(), "Scrap successful!");
    }
}
