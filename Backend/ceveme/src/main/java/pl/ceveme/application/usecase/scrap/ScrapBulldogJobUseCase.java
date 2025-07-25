package pl.ceveme.application.usecase.scrap;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.infrastructure.external.scrap.bulldogJob.BulldogJobScrapper;

import java.io.IOException;

@Service
public class ScrapBulldogJobUseCase {

    private final BulldogJobScrapper scrapper;

    public ScrapBulldogJobUseCase(BulldogJobScrapper scrapper) {
        this.scrapper = scrapper;
    }

    public ScrapResponse execute() throws IOException {
        return new ScrapResponse(scrapper.createJobs(), "Scrap successful!");
    }
}
