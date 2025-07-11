package pl.ceveme.application.usecase.scrap;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.infrastructure.external.scrap.justJoinIt.JustJoinItScrapper;

@Service
public class ScrapJustJoinItUseCase {

    private final JustJoinItScrapper justJoinItScrapper;

    public ScrapJustJoinItUseCase(JustJoinItScrapper justJoinItScrapper) {
        this.justJoinItScrapper = justJoinItScrapper;
    }


    public ScrapResponse execute() {
        return new ScrapResponse(justJoinItScrapper.createJobs(), "Scrap successful!");
    }
}
