package pl.ceveme.infrastructure.controllers.scrap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.application.usecase.scrap.ScrapBulldogJobUseCase;
import pl.ceveme.application.usecase.scrap.ScrapJustJoinItUseCase;
import pl.ceveme.application.usecase.scrap.ScrapPracujPlUseCase;
import pl.ceveme.application.usecase.scrap.ScrapTheProtocolIT;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.infrastructure.external.bulldogJob.BulldogJobScrapper;
import pl.ceveme.infrastructure.external.rocketJobs.RocketJobsScrapper;
import pl.ceveme.infrastructure.external.theProtocolIt.TheProtocolItScrapper;

import java.util.List;

@RestController
@RequestMapping("/api/scrap")
public class ScrapController {
    private final ScrapJustJoinItUseCase scrapJustJoinItUseCase;
    private final ScrapPracujPlUseCase scrapPracujPlUseCase;
    private final ScrapBulldogJobUseCase scrapBulldogJobUseCase;
    private final ScrapTheProtocolIT scrapProtocolItUseCase;
    private final RocketJobsScrapper rocketJobsScrapper;

    public ScrapController(ScrapJustJoinItUseCase scrapJustJoinItUseCase, ScrapPracujPlUseCase scrapPracujPlUseCase, ScrapBulldogJobUseCase scrapBulldogJobUseCase, ScrapTheProtocolIT scrapProtocolItUseCase, RocketJobsScrapper rocketJobsScrapper) {
        this.scrapJustJoinItUseCase = scrapJustJoinItUseCase;
        this.scrapPracujPlUseCase = scrapPracujPlUseCase;
        this.scrapBulldogJobUseCase = scrapBulldogJobUseCase;
        this.scrapProtocolItUseCase = scrapProtocolItUseCase;
        this.rocketJobsScrapper = rocketJobsScrapper;
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
    public ResponseEntity<List<JobOffer>> rocketJobs() {
        try {
            return ResponseEntity.ok(rocketJobsScrapper.createJobs());
        } catch (Exception e) {
//            return ResponseEntity.badRequest()
//                    .body(new ScrapResponse(null, "Scrap failed!"));
            return null;
        }
    }


}
