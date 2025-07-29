package pl.ceveme.domain.services.jobOffer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobOfferFilter {

    private static final Logger log = LoggerFactory.getLogger(JobOfferFilter.class);
    private final JobOfferRepository jobOfferRepository;
    private static final int MAX_PAGE_SIZE = 50;
    private static final int MAX_PAGE_NUMBER = 49;
    private static final int DEFAULT_PAGE_SIZE = 50;

    public JobOfferFilter(JobOfferRepository jobOfferRepository) {
        this.jobOfferRepository = jobOfferRepository;
    }

    public List<JobOffer> filterOffers(String searchValue) {
        if (searchValue == null || searchValue.trim().isEmpty()) {
            return jobOfferRepository.findAll();
        }

        String[] keywords = searchValue.trim().split("[\\s,]+");
        log.info("Searching with keywords: {}", Arrays.toString(keywords));

        return jobOfferRepository.findAll().stream()
                .filter(jobOffer -> matchesAnyKeyword(jobOffer, keywords))
                .collect(Collectors.toList());
    }

    public Page<JobOffer> filterOffersPage(String searchValue, int pageNumber, int pageSize) {
        validatePageParameters(pageNumber, pageSize, searchValue);

        List<JobOffer> filteredOffers = filterOffers(searchValue);

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredOffers.size());

        List<JobOffer> pageContent = start >= filteredOffers.size() ?
                List.of() : filteredOffers.subList(start, end);

        return new PageImpl<>(pageContent, pageable, filteredOffers.size());
    }

    public Page<JobOffer> filterOffersPage(String searchValue, int pageNumber) {
        return filterOffersPage(searchValue, pageNumber, DEFAULT_PAGE_SIZE);
    }

    public long getTotalFilteredOffers(String searchValue) {
        return filterOffers(searchValue).size();
    }

    public int getTotalFilteredPages(String searchValue, int pageSize) {
        if (pageSize <= 0) {
            throw new IllegalArgumentException("Page size must be positive");
        }

        long totalOffers = getTotalFilteredOffers(searchValue);
        return (int) Math.ceil((double) totalOffers / pageSize);
    }

    private void validatePageParameters(int pageNumber, int pageSize, String searchValue) {
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

        int actualTotalPages = getTotalFilteredPages(searchValue, pageSize);
        if (pageNumber >= actualTotalPages && actualTotalPages > 0) {
            throw new IllegalArgumentException(
                    String.format("Page number %d does not exist. Total pages available: %d",
                            pageNumber, actualTotalPages)
            );
        }
    }

    private boolean matchesAnyKeyword(JobOffer jobOffer, String[] keywords) {
        return Arrays.stream(keywords)
                .allMatch(keyword -> matchesJobOffer(jobOffer, keyword));
    }

    private boolean matchesJobOffer(JobOffer jobOffer, String keyword) {
        if (containsIgnoreCase(jobOffer.getTitle(), keyword)) {
            return true;
        }

        if (containsIgnoreCase(jobOffer.getRequirements(), keyword)) {
            return true;
        }

        if (containsIgnoreCase(jobOffer.getNiceToHave(), keyword)) {
            return true;
        }

        if (containsIgnoreCase(jobOffer.getResponsibilities(), keyword)) {
            return true;
        }

        if (containsIgnoreCase(jobOffer.getExperienceLevel(), keyword)) {
            return true;
        }

        if (containsIgnoreCase(jobOffer.getEmploymentType(), keyword)) {
            return true;
        }

        if (jobOffer.getLocation() != null &&
                containsIgnoreCase(jobOffer.getLocation().toString(), keyword)) {
            return true;
        }

        return false;
    }

    private boolean containsIgnoreCase(String text, String keyword) {
        return text != null && text.toLowerCase().contains(keyword.toLowerCase());
    }
}