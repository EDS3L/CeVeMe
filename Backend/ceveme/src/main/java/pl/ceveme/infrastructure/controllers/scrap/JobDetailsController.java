package pl.ceveme.infrastructure.controllers.scrap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.scrap.JobOfferRequest;
import pl.ceveme.infrastructure.external.bulldogJob.BulldogJobScrapper;
import pl.ceveme.infrastructure.external.justJoinIt.JustJoinItScrapper;
import pl.ceveme.infrastructure.external.nofluffjobs.NoFluffJobsScrapper;
import pl.ceveme.infrastructure.external.pracujPl.PracujPlScrapper;
import pl.ceveme.infrastructure.external.rocketJobs.RocketJobsScrapper;
import pl.ceveme.infrastructure.external.solidJobs.SolidJobsScrapper;
import pl.ceveme.infrastructure.external.theProtocolIt.TheProtocolItScrapper;

@RestController
@RequestMapping("/api/jobDetails")
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
    public JobOfferRequest justJoinIt(@RequestParam String url) {
        return ResponseEntity.ok(justJoinItScrapper.getJobDetails(url))
                .getBody();

    }

    @GetMapping("/bullDogJob")
    public JobOfferRequest bullDogJob(@RequestParam String url) throws Exception {

        return ResponseEntity.ok(bulldogJobScrapper.getJobDetails(url))
                .getBody();

    }

    @GetMapping("/noFluffJobs")
    public JobOfferRequest noFluffJobs(@RequestParam String url) {

        return ResponseEntity.ok(noFluffJobsScrapper.getJobDetails(url))
                .getBody();

    }

    @GetMapping("/pracujPl")
    public JobOfferRequest pracujPl(@RequestParam String url) throws Exception {

        return ResponseEntity.ok(pracujPlScrapper.getJobDetails(url))
                .getBody();

    }

    @GetMapping("/rocketJobs")
    public JobOfferRequest rocketJobs(@RequestParam String url) throws Exception {

        return ResponseEntity.ok(rocketJobsScrapper.getJobDetails(url))
                .getBody();

    }

    @GetMapping("/solidJobs")
    public JobOfferRequest solidJobs(@RequestParam String url) throws Exception {

        return ResponseEntity.ok(solidJobsScrapper.getJobDetails(url))
                .getBody();

    }

    @GetMapping("/theProtocolIt")
    public JobOfferRequest theProtocolIt(@RequestParam String url) throws Exception {

        return ResponseEntity.ok(theProtocolItScrapper.getJobDetails(url))
                .getBody();

    }


}
