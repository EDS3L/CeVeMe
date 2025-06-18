package pl.ceveme.infrastructure.controllers.scrap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.application.usecase.scrap.*;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.infrastructure.external.nofluffjobs.NoFluffJobsScrapper;

import java.util.List;

@RestController
@RequestMapping("/api/scrap")
public class ScrapController {
    private final ScrapJustJoinItUseCase scrapJustJoinItUseCase;
    private final ScrapPracujPlUseCase scrapPracujPlUseCase;
    private final ScrapBulldogJobUseCase scrapBulldogJobUseCase;
    private final ScrapTheProtocolIT scrapProtocolItUseCase;
    private final ScrapRocketJobs scrapRocketJobs;
    private final NoFluffJobsScrapper scrapper;


    public ScrapController(ScrapJustJoinItUseCase scrapJustJoinItUseCase, ScrapPracujPlUseCase scrapPracujPlUseCase, ScrapBulldogJobUseCase scrapBulldogJobUseCase, ScrapTheProtocolIT scrapProtocolItUseCase, ScrapRocketJobs scrapRocketJobs, NoFluffJobsScrapper scrapper) {
        this.scrapJustJoinItUseCase = scrapJustJoinItUseCase;
        this.scrapPracujPlUseCase = scrapPracujPlUseCase;
        this.scrapBulldogJobUseCase = scrapBulldogJobUseCase;
        this.scrapProtocolItUseCase = scrapProtocolItUseCase;
        this.scrapRocketJobs = scrapRocketJobs;
        this.scrapper = scrapper;
    }

    @GetMapping("/justJointIt")
    public ResponseEntity<ScrapResponse> justJoinIt() {
        try {
            return ResponseEntity.ok(scrapJustJoinItUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ScrapResponse(null, "Scrap failed!"));
        }
    }

    @GetMapping("/pracujPl")
    public ResponseEntity<ScrapResponse> pracujPl() {
        try {
            return ResponseEntity.ok(scrapPracujPlUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ScrapResponse(null, "Scrap failed!"));
        }
    }

    @GetMapping("/bulldogJob")
    public ResponseEntity<ScrapResponse> bulldogJob() {
        try {
            return ResponseEntity.ok(scrapBulldogJobUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ScrapResponse(null, "Scrap failed!"));
        }
    }

    @GetMapping("/theProtocolIt")
    public ResponseEntity<ScrapResponse> thrProtocolIt() {
        try {
            return ResponseEntity.ok(scrapProtocolItUseCase.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ScrapResponse(null, "Scrap failed!"));
        }
    }

    @GetMapping("/rocketJobs")
    public ResponseEntity<ScrapResponse> rocketJobs() {
        try {
            return ResponseEntity.ok(scrapRocketJobs.execute());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ScrapResponse(null, "Scrap failed!"));

        }
    }

    @GetMapping("/nofluffjobs")
    public ResponseEntity<List<JobOffer>> noFluffJobs() {
        try {
            return ResponseEntity.ok(scrapper.createJobs());
        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(new ScrapResponse(null, "Scrap failed!"));
            return null;
        }
    }


}
