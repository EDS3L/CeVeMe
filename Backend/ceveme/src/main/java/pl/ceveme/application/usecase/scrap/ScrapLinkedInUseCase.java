package pl.ceveme.application.usecase.scrap;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.infrastructure.external.scrap.linkedin.LinkedInScrapper;

import java.io.IOException;

@Service
public class ScrapLinkedInUseCase {

    private final LinkedInScrapper linkedInScrapper;

    public ScrapLinkedInUseCase(LinkedInScrapper linkedInScrapper) {
        this.linkedInScrapper = linkedInScrapper;
    }

    public ScrapResponse execute() throws IOException {
        return new ScrapResponse(linkedInScrapper.createJobs(), "Scrap successful!");
    }
}
