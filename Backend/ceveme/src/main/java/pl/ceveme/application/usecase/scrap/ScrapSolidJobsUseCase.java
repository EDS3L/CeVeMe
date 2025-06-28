package pl.ceveme.application.usecase.scrap;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.infrastructure.external.solidJobs.SolidJobsScrapper;

@Service
public class ScrapSolidJobsUseCase {

    private final SolidJobsScrapper scrapper;

    public ScrapSolidJobsUseCase(SolidJobsScrapper scrapper) {
        this.scrapper = scrapper;
    }

    public ScrapResponse execute() throws Exception {
        return new ScrapResponse(scrapper.createJobs(),"Scrap successful!");
    }
}
