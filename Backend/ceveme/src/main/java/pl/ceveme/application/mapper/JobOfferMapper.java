package pl.ceveme.application.mapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import pl.ceveme.application.dto.jobOffer.JobOfferResponse;
import pl.ceveme.application.dto.jobOffer.SearchResponse;
import pl.ceveme.domain.model.entities.JobOffer;

import java.util.List;
import java.util.stream.Collectors;

public class JobOfferMapper {

    private JobOfferMapper() {
    }

    public static JobOfferResponse toResponse(JobOffer entity) {
        if (entity == null) {
            return null;
        }

        return new JobOfferResponse(entity.getId(),
                entity.getTitle(),
                entity.getCompany(),
                entity.getLocation() != null ? entity.getLocation().getCity() : null,
                entity.getLocation() != null ? entity.getLocation().getStreet() : null,
                entity.getLocation() != null ? entity.getLocation().getLatitude() : null,
                entity.getLocation() != null ? entity.getLocation().getLongitude() : null,
                entity.getSalary(),
                entity.getSalaryMin(),
                entity.getSalaryMax(),
                entity.getSalaryCurrency(),
                entity.getSalaryType() != null ? entity.getSalaryType().name() : null,
                entity.getExperienceLevel(),
                entity.getEmploymentType(),
                entity.getDateAdded(),
                entity.getDateEnding(),
                entity.getLink(),
                entity.getRequirements(),
                entity.getResponsibilities(),
                entity.getBenefits(),
                entity.getNiceToHave());
    }

    public static List<JobOfferResponse> toResponseList(List<JobOffer> entities) {
        return entities.stream().map(JobOfferMapper::toResponse).collect(Collectors.toList());
    }

    public static SearchResponse toSearchResponse(Page<JobOffer> page) {
        List<JobOfferResponse> content = toResponseList(page.getContent());

        return new SearchResponse(content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
    }

    public static Page<JobOfferResponse> toResponsePage(Page<JobOffer> page) {
        List<JobOfferResponse> content = toResponseList(page.getContent());
        return new PageImpl<>(content, page.getPageable(), page.getTotalElements());
    }
}
