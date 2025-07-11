package pl.ceveme.application.usecase.scrap;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.infrastructure.external.scrap.theProtocolIt.TheProtocolItScrapper;

import java.io.IOException;

@Service
public class ScrapTheProtocolITUseCase {

    private final TheProtocolItScrapper scrapper;

    public ScrapTheProtocolITUseCase(TheProtocolItScrapper scrapper) {
        this.scrapper = scrapper;
    }

    public ScrapResponse execute() throws IOException {
        return new ScrapResponse(scrapper.createJobs(), "Scrap successful!");
    }
}
