package pl.ceveme.application.usecase.jobOffer;

import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.services.jobOffer.JobOfferService;

import java.util.List;

@Service
public class GetJobOffersPerPageUseCase {

    private final JobOfferService jobOfferService;

    public GetJobOffersPerPageUseCase(JobOfferService jobOfferService) {
        this.jobOfferService = jobOfferService;
    }

    public List<JobOffer> execute(int countLimit) {
        return jobOfferService.getJobOfferListPerPage(countLimit);
    }
}
