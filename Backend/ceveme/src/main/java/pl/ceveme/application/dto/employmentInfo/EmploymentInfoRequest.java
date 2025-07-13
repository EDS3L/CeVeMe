package pl.ceveme.application.dto.employmentInfo;

import pl.ceveme.domain.model.entities.*;

import java.util.List;
public record EmploymentInfoRequest(
        List<LanguageDto> languages,
        List<CertificateDto> certificates,
        List<ExperienceDto> experiences,
        List<CourseDto> courses,
        List<SkillDto> skills,
        List<PortfolioItemsDto> portfolioItems,
        List<LinkDto> links,
        List<EducationDto> educations,
        String email
        ) {
    }