package pl.ceveme.application.mapper;

import org.mapstruct.*;
import pl.ceveme.application.dto.employmentInfo.*;
import pl.ceveme.domain.model.entities.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmploymentInfoMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "languages", source = "languages")
    @Mapping(target = "certificates", source = "certificates")
    @Mapping(target = "experiences", source = "experiences")
    @Mapping(target = "courses", source = "courses")
    @Mapping(target = "skills", source = "skills")
    EmploymentInfo toEntity(EmploymentInfoRequest dto);

    @Mapping(target = "languages", source = "languages")
    @Mapping(target = "certificates", source = "certificates")
    @Mapping(target = "experiences", source = "experiences")
    @Mapping(target = "courses", source = "courses")
    @Mapping(target = "skills", source = "skills")
    EmploymentInfoResponse toResponse(EmploymentInfo entity);

    @Mapping(target = "employmentInfo", ignore = true)
    Language toEntity(LanguageDto dto);

    @Mapping(target = "employmentInfo", ignore = true)
    Certificate toEntity(CertificateDto dto);

    @Mapping(target = "employmentInfo", ignore = true)
    Experience toEntity(ExperienceDto dto);

    @Mapping(target = "employmentInfo", ignore = true)
    Course toEntity(CourseDto dto);

    @Mapping(target = "employmentInfo", ignore = true)
    @Mapping(target = "type", source = "type", qualifiedByName = "stringToSkillType")
    Skill toEntity(SkillDto dto);

    LanguageDto toDto(Language entity);
    CertificateDto toDto(Certificate entity);
    ExperienceDto toDto(Experience entity);
    CourseDto toDto(Course entity);
    SkillDto toDto(Skill entity);

    List<Language> toLanguageEntityList(List<LanguageDto> dtoList);
    List<Certificate> toCertificateEntityList(List<CertificateDto> dtoList);
    List<Experience> toExperienceEntityList(List<ExperienceDto> dtoList);
    List<Course> toCourseEntityList(List<CourseDto> dtoList);
    List<Skill> toSkillEntityList(List<SkillDto> dtoList);

    List<LanguageDto> toLanguageDtoList(List<Language> entityList);
    List<CertificateDto> toCertificateDtoList(List<Certificate> entityList);
    List<ExperienceDto> toExperienceDtoList(List<Experience> entityList);
    List<CourseDto> toCourseDtoList(List<Course> entityList);
    List<SkillDto> toSkillDtoList(List<Skill> entityList);

    @Named("stringToSkillType")
    default Skill.Type stringToSkillType(Object type) {
        if (type == null) {
            return null;
        }
        return Skill.Type.valueOf(String.valueOf(type));
    }

    default EmploymentInfoResponse toResponse(EmploymentInfo entity, String message) {
        return toResponse(entity);
    }

    @AfterMapping
    default void setEmploymentInfoRelations(@MappingTarget EmploymentInfo employmentInfo) {
        if (employmentInfo.getLanguages() != null) {
            employmentInfo.getLanguages().forEach(lang -> lang.setEmploymentInfo(employmentInfo));
        }
        if (employmentInfo.getCertificates() != null) {
            employmentInfo.getCertificates().forEach(cert -> cert.setEmploymentInfo(employmentInfo));
        }
        if (employmentInfo.getExperiences() != null) {
            employmentInfo.getExperiences().forEach(exp -> exp.setEmploymentInfo(employmentInfo));
        }
        if (employmentInfo.getCourses() != null) {
            employmentInfo.getCourses().forEach(course -> course.setEmploymentInfo(employmentInfo));
        }
        if (employmentInfo.getSkills() != null) {
            employmentInfo.getSkills().forEach(skill -> skill.setEmploymentInfo(employmentInfo));
        }
    }
}