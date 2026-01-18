package pl.ceveme.application.usecase.jobOffer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.jobOffer.JobSearchCriteria;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;
import pl.ceveme.domain.specification.JobOfferSpecification;
import pl.ceveme.infrastructure.external.location.OpenStreetMapImpl;

@Service
public class SearchJobOffersUseCase {

    private static final int MIN_PAGE_SIZE = 1;
    private static final int MAX_PAGE_SIZE = 200;
    private static final int DEFAULT_PAGE_SIZE = 50;

    private final JobOfferRepository jobOfferRepository;
    private final OpenStreetMapImpl openStreetMap;

    public SearchJobOffersUseCase(JobOfferRepository jobOfferRepository, OpenStreetMapImpl openStreetMap) {
        this.jobOfferRepository = jobOfferRepository;
        this.openStreetMap = openStreetMap;
    }

    public Page<JobOffer> search(JobSearchCriteria criteria) {
        validateCriteria(criteria);

        Pageable pageable = buildPageable(criteria);
        return jobOfferRepository.findAll(JobOfferSpecification.buildSpecification(criteria,openStreetMap), pageable);
    }

    private void validateCriteria(JobSearchCriteria criteria) {
        if (criteria == null) {
            throw new IllegalArgumentException("Search criteria cannot be null");
        }

        if (criteria.getPageNumber() == null || criteria.getPageNumber() < 0) {
            criteria.setPageNumber(0);
        }

        if (criteria.getSize() == null) {
            criteria.setSize(DEFAULT_PAGE_SIZE);
        }

        criteria.setSize(normalizeSize(criteria.getSize()));

        if (criteria.getSort() == null || criteria.getSort().isEmpty()) {
            criteria.setSort("newest");
        }
    }

    private Pageable buildPageable(JobSearchCriteria criteria) {
        int pageNumber = criteria.getPageNumber();
        int pageSize = criteria.getSize();
        Sort sort = buildSort(criteria.getSort());

        return PageRequest.of(pageNumber, pageSize, sort);
    }

    private Sort buildSort(String sortKey) {
        return switch (sortKey) {
            case "newest" -> Sort.by(Sort.Order.desc("dateAdded"), Sort.Order.desc("id"));
            case "oldest" -> Sort.by(Sort.Order.asc("dateAdded"), Sort.Order.desc("id"));
            case "endingSoon" -> Sort.by(Sort.Order.asc("dateEnding"), Sort.Order.desc("id"));
            case "companyAsc" -> Sort.by(Sort.Order.asc("company").ignoreCase(), Sort.Order.desc("id"));
            case "companyDesc" -> Sort.by(Sort.Order.desc("company").ignoreCase(), Sort.Order.desc("id"));
            case "titleAsc" -> Sort.by(Sort.Order.asc("title").ignoreCase(), Sort.Order.desc("id"));
            case "titleDesc" -> Sort.by(Sort.Order.desc("title").ignoreCase(), Sort.Order.desc("id"));
            case "cityAsc" -> Sort.by(Sort.Order.asc("location.city").ignoreCase(), Sort.Order.desc("id"));
            case "cityDesc" -> Sort.by(Sort.Order.desc("location.city").ignoreCase(), Sort.Order.desc("id"));
            default -> Sort.by(Sort.Order.desc("dateAdded"), Sort.Order.desc("id"));
        };
    }

    private int normalizeSize(int size) {
        if (size < MIN_PAGE_SIZE) {
            return DEFAULT_PAGE_SIZE;
        }
        if (size > MAX_PAGE_SIZE) {
            return MAX_PAGE_SIZE;
        }
        return size;
    }
}
