package pl.ceveme.application.usecase.scrap;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.infrastructure.external.scrap.nofluffjobs.NoFluffJobsScrapper;

import java.io.IOException;

@Service
public class ScrapNoFluffJobsUseCase {

    private final NoFluffJobsScrapper scrapper;

    public ScrapNoFluffJobsUseCase(NoFluffJobsScrapper scrapper) {
        this.scrapper = scrapper;
    }

    public ScrapResponse execute() throws IOException {
        return new ScrapResponse(scrapper.createJobs(),"Scrap successful!");
    }
}
