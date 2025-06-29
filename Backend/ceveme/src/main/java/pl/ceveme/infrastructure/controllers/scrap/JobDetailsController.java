package pl.ceveme.infrastructure.controllers.scrap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.scrap.JobOfferDTO;
import pl.ceveme.infrastructure.external.bulldogJob.BulldogJobScrapper;
import pl.ceveme.infrastructure.external.justJoinIt.JustJoinItScrapper;
import pl.ceveme.infrastructure.external.nofluffjobs.NoFluffJobsScrapper;
import pl.ceveme.infrastructure.external.pracujPl.PracujPlScrapper;
import pl.ceveme.infrastructure.external.rocketJobs.RocketJobsScrapper;
import pl.ceveme.infrastructure.external.solidJobs.SolidJobsScrapper;
import pl.ceveme.infrastructure.external.theProtocolIt.TheProtocolItScrapper;

@RestController
@RequestMapping("/jobDetails")
public class JobDetailsController {

    private final JustJoinItScrapper justJoinItScrapper;
    private final BulldogJobScrapper bulldogJobScrapper;
    private final NoFluffJobsScrapper noFluffJobsScrapper;
    private final PracujPlScrapper pracujPlScrapper;
    private final RocketJobsScrapper rocketJobsScrapper;
    private final SolidJobsScrapper solidJobsScrapper;
    private final TheProtocolItScrapper theProtocolItScrapper;


    public JobDetailsController(JustJoinItScrapper justJoinItScrapper, BulldogJobScrapper bulldogJobScrapper, NoFluffJobsScrapper noFluffJobsScrapper, PracujPlScrapper pracujPlScrapper, RocketJobsScrapper rocketJobsScrapper, SolidJobsScrapper solidJobsScrapper, TheProtocolItScrapper theProtocolItScrapper) {
        this.justJoinItScrapper = justJoinItScrapper;
        this.bulldogJobScrapper = bulldogJobScrapper;
        this.noFluffJobsScrapper = noFluffJobsScrapper;
        this.pracujPlScrapper = pracujPlScrapper;
        this.rocketJobsScrapper = rocketJobsScrapper;
        this.solidJobsScrapper = solidJobsScrapper;
        this.theProtocolItScrapper = theProtocolItScrapper;
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

    @GetMapping("/bullDogJob")
    public JobOfferDTO bullDogJob(@RequestParam String url) {
        try {
            return ResponseEntity.ok(bulldogJobScrapper.getJobDetails(url))
                    .getBody();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new JobOfferDTO(null,null,null,null,null,null,"Failed to get job details"))
                    .getBody();
        }
    }
    @GetMapping("/noFluffJobs")
    public JobOfferDTO noFluffJobs(@RequestParam String url) {
        try {
            return ResponseEntity.ok(noFluffJobsScrapper.getJobDetails(url))
                    .getBody();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new JobOfferDTO(null,null,null,null,null,null,"Failed to get job details"))
                    .getBody();
        }
    }
    @GetMapping("/pracujPl")
    public JobOfferDTO pracujPl(@RequestParam String url) {
        try {
            return ResponseEntity.ok(pracujPlScrapper.getJobDetails(url))
                    .getBody();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new JobOfferDTO(null,null,null,null,null,null,"Failed to get job details"))
                    .getBody();
        }
    }
    @GetMapping("/rocketJobs")
    public JobOfferDTO rocketJobs(@RequestParam String url) {
        try {
            return ResponseEntity.ok(rocketJobsScrapper.getJobDetails(url))
                    .getBody();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new JobOfferDTO(null,null,null,null,null,null,"Failed to get job details"))
                    .getBody();
        }
    }
    @GetMapping("/solidJobs")
    public JobOfferDTO solidJobs(@RequestParam String url) {
        try {
            return ResponseEntity.ok(solidJobsScrapper.getJobDetails(url))
                    .getBody();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new JobOfferDTO(null,null,null,null,null,null,"Failed to get job details"))
                    .getBody();
        }
    }

    @GetMapping("/theProtocolIt")
    public JobOfferDTO theProtocolIt(@RequestParam String url) {
        try {
            return ResponseEntity.ok(theProtocolItScrapper.getJobDetails(url))
                    .getBody();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new JobOfferDTO(null,null,null,null,null,null,"Failed to get job details"))
                    .getBody();
        }
    }


}
