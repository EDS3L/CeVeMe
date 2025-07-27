package pl.ceveme.infrastructure.controllers.jobOffer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.usecase.jobOffer.GetJobOffersPerPageUseCase;
import pl.ceveme.domain.model.entities.JobOffer;

import java.util.List;

@RestController
@RequestMapping("api/jobOffer")
public class JobOfferController {

    private final GetJobOffersPerPageUseCase getJobOffersPerPageUseCase;

    public JobOfferController(GetJobOffersPerPageUseCase getJobOffersPerPageUseCase) {
        this.getJobOffersPerPageUseCase = getJobOffersPerPageUseCase;
    }

    @GetMapping("/getJobs")
    public ResponseEntity<List<JobOffer>> jobOffersList(@RequestParam int countLimit) {
        return ResponseEntity.ok(getJobOffersPerPageUseCase.execute(countLimit));
    }
}
