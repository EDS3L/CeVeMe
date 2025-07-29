package pl.ceveme.application.usecase.jobOffer;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.services.jobOffer.JobOfferFilter;

import java.util.List;

@Service
public class FindJobOffersByValuesUseCase {

    private final JobOfferFilter jobOfferFilter;

    public FindJobOffersByValuesUseCase(JobOfferFilter jobOfferFilter) {
        this.jobOfferFilter = jobOfferFilter;
    }

    public Page<JobOffer> execute(String value, int page) {
        return jobOfferFilter.filterOffersPage(value, page);
    }
}
