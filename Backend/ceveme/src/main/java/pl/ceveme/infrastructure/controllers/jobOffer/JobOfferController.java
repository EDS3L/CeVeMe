package pl.ceveme.infrastructure.controllers.jobOffer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.usecase.jobOffer.FindJobOffersByValuesUseCase;
import pl.ceveme.application.usecase.jobOffer.GetJobOffersPerPageUseCase;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;

import java.time.LocalDate;

@RestController
@RequestMapping("api/jobOffer")
public class JobOfferController {

    private final GetJobOffersPerPageUseCase getJobOffersPerPageUseCase;
    private final FindJobOffersByValuesUseCase findJobOffersByValuesUseCase;
    private final JobOfferRepository jobOfferRepository;

    public JobOfferController(GetJobOffersPerPageUseCase getJobOffersPerPageUseCase, FindJobOffersByValuesUseCase findJobOffersByValuesUseCase, JobOfferRepository jobOfferRepository) {
        this.getJobOffersPerPageUseCase = getJobOffersPerPageUseCase;
        this.findJobOffersByValuesUseCase = findJobOffersByValuesUseCase;
        this.jobOfferRepository = jobOfferRepository;
    }

    @GetMapping("/getJobs")
    public ResponseEntity<Page<JobOffer>> jobOffersList(@RequestParam int pageNumber) {
        return ResponseEntity.ok(getJobOffersPerPageUseCase.execute(pageNumber));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<JobOffer>> search(@RequestParam(required = false, defaultValue = "") String q, @RequestParam(defaultValue = "1") int pageNumber, @RequestParam(defaultValue = "50") int size, @RequestParam(defaultValue = "newest") String sort) {
        Pageable pageable = PageRequest.of(Math.max(0, pageNumber - 1), normalizeSize(size), mapSort(sort));
        Page<JobOffer> page = jobOfferRepository.findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocation_CityContainingIgnoreCaseOrRequirementsContainingIgnoreCaseOrExperienceLevelContainingIgnoreCaseOrEmploymentTypeContainingIgnoreCase(q, q, q, q, q, q, pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/searchBy")
    public ResponseEntity<Page<JobOffer>> searchBy(@RequestParam(required = false) String company, @RequestParam(required = false) String city, @RequestParam(required = false) String experienceLevel, @RequestParam(required = false) String employmentType, @RequestParam(required = false) String title, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAddedFrom, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAddedTo, @RequestParam(defaultValue = "1") int pageNumber, @RequestParam(defaultValue = "50") int size, @RequestParam(defaultValue = "newest") String sort) {
        Pageable pageable = PageRequest.of(Math.max(0, pageNumber - 1), normalizeSize(size), mapSort(sort));

        LocalDate from = (dateAddedFrom != null) ? dateAddedFrom : LocalDate.of(1970, 1, 1);
        LocalDate to = (dateAddedTo != null) ? dateAddedTo : LocalDate.of(2100, 12, 31);

        Page<JobOffer> page = jobOfferRepository.findByDateAddedBetweenAndCompanyContainingIgnoreCaseAndLocation_CityContainingIgnoreCaseAndExperienceLevelContainingIgnoreCaseAndEmploymentTypeContainingIgnoreCaseAndTitleContainingIgnoreCase(from, to, def(company), def(city), def(experienceLevel), def(employmentType), def(title), pageable);
        return ResponseEntity.ok(page);
    }


    private int normalizeSize(int size) {
        if (size < 1) return 50;
        if (size > 200) return 200;
        return size;
    }

    private Sort mapSort(String key) {
        if (key == null) key = "newest";
        return switch (key) {
            case "newest" -> Sort.by(Sort.Order.desc("dateAdded"), Sort.Order.desc("id"));
            case "endingSoon" -> Sort.by(Sort.Order.asc("dateEnding"), Sort.Order.desc("id"));
            case "companyAsc" -> Sort.by(Sort.Order.asc("company")
                    .ignoreCase(), Sort.Order.desc("id"));
            case "titleAsc" -> Sort.by(Sort.Order.asc("title")
                    .ignoreCase(), Sort.Order.desc("id"));
            case "cityAsc" -> Sort.by(Sort.Order.asc("location.city")
                    .ignoreCase(), Sort.Order.desc("id"));
            default -> Sort.by(Sort.Order.desc("dateAdded"), Sort.Order.desc("id"));
        };
    }

    private String def(String s) {
        return (s == null) ? "" : s;
    }
}
