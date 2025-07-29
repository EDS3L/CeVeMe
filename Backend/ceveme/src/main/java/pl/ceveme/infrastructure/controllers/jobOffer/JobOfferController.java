package pl.ceveme.infrastructure.controllers.jobOffer;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.usecase.jobOffer.FindJobOffersByValuesUseCase;
import pl.ceveme.application.usecase.jobOffer.GetJobOffersPerPageUseCase;
import pl.ceveme.domain.model.entities.JobOffer;

import java.util.List;

@RestController
@RequestMapping("api/jobOffer")
public class JobOfferController {

    private final GetJobOffersPerPageUseCase getJobOffersPerPageUseCase;
    private final FindJobOffersByValuesUseCase findJobOffersByValuesUseCase;

    public JobOfferController(GetJobOffersPerPageUseCase getJobOffersPerPageUseCase, FindJobOffersByValuesUseCase findJobOffersByValuesUseCase) {
        this.getJobOffersPerPageUseCase = getJobOffersPerPageUseCase;
        this.findJobOffersByValuesUseCase = findJobOffersByValuesUseCase;
    }

    @GetMapping("/getJobs")
    public ResponseEntity<Page<JobOffer>> jobOffersList(@RequestParam int pageNumber) {
        return ResponseEntity.ok(getJobOffersPerPageUseCase.execute(pageNumber));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<JobOffer>> jobFilter(@RequestParam String value, @RequestParam int page) {
        return ResponseEntity.ok(findJobOffersByValuesUseCase.execute(value,page));
    }
}
