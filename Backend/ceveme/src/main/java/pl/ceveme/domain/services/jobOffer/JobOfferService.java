package pl.ceveme.domain.services.jobOffer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;

@Service
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private static final int MAX_PAGE_SIZE = 50;
    private static final int MAX_PAGE_NUMBER = 49;
    private static final int DEFAULT_PAGE_SIZE = 50;

    public JobOfferService(JobOfferRepository jobOfferRepository) {
        this.jobOfferRepository = jobOfferRepository;
    }

    public Page<JobOffer> getJobOffersPage(int pageNumber, int pageSize) {
        validatePageParameters(pageNumber, pageSize);

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
        return jobOfferRepository.findAll(pageable);
    }

    public Page<JobOffer> getJobOffersPage(int pageNumber) {
        return getJobOffersPage(pageNumber, DEFAULT_PAGE_SIZE);
    }

    public long getTotalOffers() {
        return jobOfferRepository.count();
    }

    public int getTotalPages(int pageSize) {
        if (pageSize <= 0) {
            throw new IllegalArgumentException("Page size must be positive");
        }

        long totalOffers = getTotalOffers();
        return (int) Math.ceil((double) totalOffers / pageSize);
    }

    private void validatePageParameters(int pageNumber, int pageSize) {
        if (pageNumber < 0) {
            throw new IllegalArgumentException("Page number cannot be negative. Provided: " + pageNumber);
        }

        if (pageNumber > MAX_PAGE_NUMBER) {
            throw new IllegalArgumentException(
                    String.format("Page number cannot exceed %d. Provided: %d", MAX_PAGE_NUMBER, pageNumber)
            );
        }

        if (pageSize <= 0) {
            throw new IllegalArgumentException("Page size must be positive. Provided: " + pageSize);
        }

        if (pageSize > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("Page size cannot exceed %d. Provided: %d", MAX_PAGE_SIZE, pageSize)
            );
        }
        int actualTotalPages = getTotalPages(pageSize);
        if (pageNumber >= actualTotalPages && actualTotalPages > 0) {
            throw new IllegalArgumentException(
                    String.format("Page number %d does not exist. Total pages available: %d",
                            pageNumber, actualTotalPages)
            );
        }
    }
}