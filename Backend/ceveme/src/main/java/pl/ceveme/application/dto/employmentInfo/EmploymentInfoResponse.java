package pl.ceveme.application.dto.employmentInfo;

import java.util.List;
import java.util.List;

public record EmploymentInfoResponse(
        List<LanguageDto> languages,
        List<CertificateDto> certificates,
        List<ExperienceDto> experiences,
        List<CourseDto> courses,
        List<SkillDto> skills,
        List<PortfolioItemsDto> portfolioItems,
        List<EducationDto> educations,
        List<LinkDto> links
) {
}
