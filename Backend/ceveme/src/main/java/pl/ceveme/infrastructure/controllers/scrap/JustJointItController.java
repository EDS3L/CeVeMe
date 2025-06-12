package pl.ceveme.infrastructure.controllers.scrap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.infrastructure.external.justJoinIt.JustJoinItScrapper;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/scrap")
public class JustJointItController {

    private final JustJoinItScrapper justJoinItScrapper;

    public JustJointItController(JustJoinItScrapper justJoinItScrapper) {
        this.justJoinItScrapper = justJoinItScrapper;
    }

    @GetMapping("/justJointIt")
    public ResponseEntity<List<String>> getUrls(@RequestParam String baseUrl) {
        try {
            return ResponseEntity.ok(justJoinItScrapper.extractUrlsFromPage(baseUrl));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonList(e.getMessage()));
        }
    }
}
