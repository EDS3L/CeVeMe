package pl.ceveme.infrastructure.controllers.scrap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.scrap.JobOfferDTO;
import pl.ceveme.infrastructure.external.justJoinIt.JustJoinItScrapper;

@RestController
@RequestMapping("/jobDetails")
public class JobDetailsController {

    private final JustJoinItScrapper justJoinItScrapper;

    public JobDetailsController(JustJoinItScrapper justJoinItScrapper) {
        this.justJoinItScrapper = justJoinItScrapper;
    }

    @GetMapping("/justJoinIt")
    public JobOfferDTO justJoinIt(@RequestParam String url) {
        try {
            return ResponseEntity.ok(justJoinItScrapper.getJobDetails(url))
                    .getBody();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new JobOfferDTO(null,null,null,null,null,null,"Failed to get job details"))
                    .getBody();
        }
    }

}
