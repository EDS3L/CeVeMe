package pl.ceveme.infrastructure.controllers.jobOffer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.jobOffer.JobSearchCriteria;
import pl.ceveme.application.dto.jobOffer.SearchResponse;
import pl.ceveme.application.mapper.JobOfferMapper;
import pl.ceveme.application.usecase.jobOffer.SearchJobOffersUseCase;

@RestController
@RequestMapping("api/jobOffer")
public class JobOfferController {

    private final SearchJobOffersUseCase searchJobOffersUseCase;

    public JobOfferController(SearchJobOffersUseCase searchJobOffersUseCase) {
        this.searchJobOffersUseCase = searchJobOffersUseCase;
    }

    @GetMapping("/search")
    public ResponseEntity<SearchResponse> search(JobSearchCriteria criteria) {
        SearchResponse response = JobOfferMapper.toSearchResponse(searchJobOffersUseCase.search(criteria));
        return ResponseEntity.ok(response);
    }
}
