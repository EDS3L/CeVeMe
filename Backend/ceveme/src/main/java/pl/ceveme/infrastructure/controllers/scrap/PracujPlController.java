package pl.ceveme.infrastructure.controllers.scrap;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.infrastructure.external.pracujPl.PracujPlScrapper;

import java.util.List;

@RestController
@RequestMapping("/api/scrap")
public class PracujPlController {

    private final PracujPlScrapper pracujPlScrapper;

    public PracujPlController(PracujPlScrapper pracujPlScrapper) {
        this.pracujPlScrapper = pracujPlScrapper;
    }

    @GetMapping("/pracujpl")
    public ResponseEntity<List<JobOffer>> getUrls(@RequestParam String link) {
        try {
            return ResponseEntity.ok(pracujPlScrapper.createJobs(link));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
