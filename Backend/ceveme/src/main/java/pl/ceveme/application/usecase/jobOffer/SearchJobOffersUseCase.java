package pl.ceveme.application.usecase.jobOffer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import pl.ceveme.domain.model.entities.JobOffer;
import pl.ceveme.domain.repositories.JobOfferRepository;

import java.time.LocalDate;

@Service
public class SearchJobOffersUseCase {

    private final JobOfferRepository jobOfferRepository;

    public SearchJobOffersUseCase(JobOfferRepository jobOfferRepository) {
        this.jobOfferRepository = jobOfferRepository;
    }

    public Page<JobOffer> search(String q, int pageNumber, int size, String sort) {
        Pageable pageable = PageRequest.of(Math.max(0, pageNumber - 1), normalizeSize(size), mapSort(sort));
        return jobOfferRepository.findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocation_CityContainingIgnoreCaseOrRequirementsContainingIgnoreCaseOrExperienceLevelContainingIgnoreCaseOrEmploymentTypeContainingIgnoreCase(q, q, q, q, q, q, pageable);
    }

    public Page<JobOffer> searchBy(String company, String city, String experienceLevel, String employmentType, String title, LocalDate dateAddedFrom, LocalDate dateAddedTo, int pageNumber, int size, String sort) {
        Pageable pageable = PageRequest.of(Math.max(0, pageNumber - 1), normalizeSize(size), mapSort(sort));

        LocalDate from = (dateAddedFrom != null) ? dateAddedFrom : LocalDate.of(1970, 1, 1);
        LocalDate to = (dateAddedTo != null) ? dateAddedTo : LocalDate.of(2100, 12, 31);

        return jobOfferRepository.findByDateAddedBetweenAndCompanyContainingIgnoreCaseAndLocation_CityContainingIgnoreCaseAndExperienceLevelContainingIgnoreCaseAndEmploymentTypeContainingIgnoreCaseAndTitleContainingIgnoreCase(from, to, def(company), def(city), def(experienceLevel), def(employmentType), def(title), pageable);
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
