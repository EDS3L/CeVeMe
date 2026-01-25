package pl.ceveme.infrastructure.controllers.jobOffer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.jobOffer.JobOfferResponse;
import pl.ceveme.application.mapper.JobOfferMapper;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;

@RestController
@RequestMapping("/api/job-offers")
public class JobOfferByIdController {

    private final JobOfferRepository jobOfferRepository;

    public JobOfferByIdController(JobOfferRepository jobOfferRepository) {
        this.jobOfferRepository = jobOfferRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobOfferResponse> getJobOfferById(@PathVariable Long id) {
        return jobOfferRepository.findById(id)
                .map(JobOfferMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
