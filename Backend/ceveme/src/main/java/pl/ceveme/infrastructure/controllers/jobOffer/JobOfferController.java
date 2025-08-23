package pl.ceveme.infrastructure.controllers.jobOffer;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.usecase.jobOffer.GetJobOffersPerPageUseCase;
import pl.ceveme.application.usecase.jobOffer.SearchJobOffersUseCase;
import pl.ceveme.domain.model.entities.JobOffer;

import java.time.LocalDate;

@RestController
@RequestMapping("api/jobOffer")
public class JobOfferController {

    private final GetJobOffersPerPageUseCase getJobOffersPerPageUseCase;
    private final SearchJobOffersUseCase searchJobOffersUseCase;

    public JobOfferController(GetJobOffersPerPageUseCase getJobOffersPerPageUseCase, SearchJobOffersUseCase searchJobOffersUseCase) {
        this.getJobOffersPerPageUseCase = getJobOffersPerPageUseCase;
        this.searchJobOffersUseCase = searchJobOffersUseCase;
    }

    @GetMapping("/getJobs")
    public ResponseEntity<Page<JobOffer>> jobOffersList(@RequestParam int pageNumber) {
        return ResponseEntity.ok(getJobOffersPerPageUseCase.execute(pageNumber));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<JobOffer>> search(@RequestParam(required = false, defaultValue = "") String q, @RequestParam(defaultValue = "1") int pageNumber, @RequestParam(defaultValue = "50") int size, @RequestParam(defaultValue = "newest") String sort) {
        Page<JobOffer> page = searchJobOffersUseCase.search(q, pageNumber, size, sort);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/searchBy")
    public ResponseEntity<Page<JobOffer>> searchBy(@RequestParam(required = false) String company, @RequestParam(required = false) String city, @RequestParam(required = false) String experienceLevel, @RequestParam(required = false) String employmentType, @RequestParam(required = false) String title, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAddedFrom, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAddedTo, @RequestParam(defaultValue = "1") int pageNumber, @RequestParam(defaultValue = "50") int size, @RequestParam(defaultValue = "newest") String sort) {
        Page<JobOffer> page = searchJobOffersUseCase.searchBy(company, city, experienceLevel, employmentType, title, dateAddedFrom, dateAddedTo, pageNumber, size, sort);
        return ResponseEntity.ok(page);
    }

}
