package pl.ceveme.infrastructure.controllers.scrap;

import com.fasterxml.jackson.databind.JsonNode;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.scrap.JobOfferRequest;
import pl.ceveme.application.dto.scrap.ScrapResponse;
import pl.ceveme.application.usecase.scrap.*;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.infrastructure.external.scrap.linkedin.LinkedInScrapper;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/scrap")
public class ScrapController {
    private final ScrapJustJoinItUseCase scrapJustJoinItUseCase;
    private final ScrapPracujPlUseCase scrapPracujPlUseCase;
    private final ScrapBulldogJobUseCase scrapBulldogJobUseCase;
    private final ScrapTheProtocolITUseCase scrapProtocolItUseCase;
    private final ScrapRocketJobsUseCase scrapRocketJobsUseCase;
    private final ScrapNoFluffJobsUseCase scrapNoFluffJobsUseCase;
    private final ScrapSolidJobsUseCase scrapSolidJobsUseCase;
    private final ScrapLinkedInUseCase scrapLinkedInUseCase;

    public ScrapController(ScrapJustJoinItUseCase scrapJustJoinItUseCase, ScrapPracujPlUseCase scrapPracujPlUseCase, ScrapBulldogJobUseCase scrapBulldogJobUseCase, ScrapTheProtocolITUseCase scrapProtocolItUseCase, ScrapRocketJobsUseCase scrapRocketJobsUseCase, ScrapNoFluffJobsUseCase scrapNoFluffJobsUseCase, ScrapSolidJobsUseCase scrapSolidJobsUseCase, ScrapLinkedInUseCase scrapLinkedInUseCase) {
        this.scrapJustJoinItUseCase = scrapJustJoinItUseCase;
        this.scrapPracujPlUseCase = scrapPracujPlUseCase;
        this.scrapBulldogJobUseCase = scrapBulldogJobUseCase;
        this.scrapProtocolItUseCase = scrapProtocolItUseCase;
        this.scrapRocketJobsUseCase = scrapRocketJobsUseCase;
        this.scrapNoFluffJobsUseCase = scrapNoFluffJobsUseCase;
        this.scrapSolidJobsUseCase = scrapSolidJobsUseCase;
        this.scrapLinkedInUseCase = scrapLinkedInUseCase;
    }

    @GetMapping("/justJointIt")
    public ResponseEntity<ScrapResponse> justJoinIt() {

        return ResponseEntity.ok(scrapJustJoinItUseCase.execute());

    }

    @GetMapping("/pracujPl")
    public ResponseEntity<ScrapResponse> pracujPl() throws IOException {

        return ResponseEntity.ok(scrapPracujPlUseCase.execute());

    }

    @GetMapping("/bulldogJob")
    public ResponseEntity<ScrapResponse> bulldogJob() throws IOException {
        return ResponseEntity.ok(scrapBulldogJobUseCase.execute());

    }

    @GetMapping("/theProtocolIt")
    public ResponseEntity<ScrapResponse> thrProtocolIt() throws IOException {

        return ResponseEntity.ok(scrapProtocolItUseCase.execute());

    }

    @GetMapping("/rocketJobs")
    public ResponseEntity<ScrapResponse> rocketJobs() throws IOException {

        return ResponseEntity.ok(scrapRocketJobsUseCase.execute());

    }

    @GetMapping("/nofluffjobs")
    public ResponseEntity<ScrapResponse> noFluffJobs() throws IOException {

        return ResponseEntity.ok(scrapNoFluffJobsUseCase.execute());

    }


    @GetMapping("/solidJobs")
    public ResponseEntity<ScrapResponse> SolidJobs() throws Exception {

        return ResponseEntity.ok(scrapSolidJobsUseCase.execute());

    }

    @GetMapping("/linkedIn")
    public ResponseEntity<ScrapResponse> linkedIn() throws Exception {
        return ResponseEntity.ok(scrapLinkedInUseCase.execute());
    }



}
