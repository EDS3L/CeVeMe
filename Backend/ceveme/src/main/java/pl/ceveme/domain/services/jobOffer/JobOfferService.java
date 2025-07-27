package pl.ceveme.domain.services.jobOffer;

import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;

import java.util.List;

@Service
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;

    public JobOfferService(JobOfferRepository jobOfferRepository) {
        this.jobOfferRepository = jobOfferRepository;
    }

    public List<JobOffer> getJobOfferListPerPage(int countLimit) {
        return jobOfferRepository.findAll().stream().limit(countLimit)
                .toList();
    }
}
