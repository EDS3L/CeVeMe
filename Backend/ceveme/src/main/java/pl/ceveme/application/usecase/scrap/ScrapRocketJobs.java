package pl.ceveme.application.usecase.scrap;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.infrastructure.external.rocketJobs.RocketJobsScrapper;

import java.io.IOException;

@Service
public class ScrapRocketJobs {

    private final RocketJobsScrapper scrapper;

    public ScrapRocketJobs(RocketJobsScrapper scrapper) {
        this.scrapper = scrapper;
    }

    public ScrapResponse execute() throws IOException {
        return new ScrapResponse(scrapper.createJobs(), "Scrap successful!");
    }
}
