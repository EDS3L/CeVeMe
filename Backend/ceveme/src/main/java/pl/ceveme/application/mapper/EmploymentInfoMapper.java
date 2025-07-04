package pl.ceveme.application.mapper;

import pl.ceveme.application.dto.employmentInfo.*;
import pl.ceveme.domain.model.entities.*;

import java.util.List;
import java.util.stream.Collectors;

public final class EmploymentInfoMapper {

    private EmploymentInfoMapper() {
    }

    public static EmploymentInfo toEntity(EmploymentInfoRequest dto) {

        EmploymentInfo info = new EmploymentInfo();

        if (dto.languages() != null) {
            List<Language> langs = dto.languages()
                    .stream()
                    .map(EmploymentInfoMapper::toEntity)
                    .peek(l -> l.setEmploymentInfo(info))
                    .collect(Collectors.toList());
            info.setLanguages(langs);
        }
        if (dto.certificates() != null) {
            List<Certificate> certs = dto.certificates()
                    .stream()
                    .map(EmploymentInfoMapper::toEntity)
                    .peek(c -> c.setEmploymentInfo(info))
                    .collect(Collectors.toList());
            info.setCertificates(certs);
        }
        if (dto.experiences() != null) {
            List<Experience> exps = dto.experiences()
                    .stream()
                    .map(EmploymentInfoMapper::toEntity)
                    .peek(e -> e.setEmploymentInfo(info))
                    .collect(Collectors.toList());
            info.setExperiences(exps);
        }
        if (dto.courses() != null) {
            List<Course> courses = dto.courses()
                    .stream()
                    .map(EmploymentInfoMapper::toEntity)
                    .peek(c -> c.setEmploymentInfo(info))
                    .collect(Collectors.toList());
            info.setCourses(courses);
        }
        if (dto.skills() != null) {
            List<Skill> skills = dto.skills()
                    .stream()
                    .map(EmploymentInfoMapper::toEntity)
                    .peek(s -> s.setEmploymentInfo(info))
                    .collect(Collectors.toList());
            info.setSkills(skills);
        }
        return info;
    }

    public static EmploymentInfoResponse toResponse(EmploymentInfo entity, String message) {
        return new EmploymentInfoResponse(
                entity.getLanguages() == null ? null :
                        entity.getLanguages().stream().map(EmploymentInfoMapper::toDto).toList(),

                entity.getCertificates() == null ? null :
                        entity.getCertificates().stream().map(EmploymentInfoMapper::toDto).toList(),

                entity.getExperiences() == null ? null :
                        entity.getExperiences().stream().map(EmploymentInfoMapper::toDto).toList(),

                entity.getCourses() == null ? null :
                        entity.getCourses().stream().map(EmploymentInfoMapper::toDto).toList(),

                entity.getSkills() == null ? null :
                        entity.getSkills().stream().map(EmploymentInfoMapper::toDto).toList(),

                message
        );
    }

    private static Language toEntity(LanguageDto d) {
        return new Language(d.name(), d.level());
    }

    private static LanguageDto toDto(Language l) {
        return new LanguageDto(l.getName(), l.getLevel());
    }

    private static Certificate toEntity(CertificateDto d) {
        return new Certificate(d.name(), d.dateOfCertificate());
    }

    private static CertificateDto toDto(Certificate c) {
        return new CertificateDto(c.getName(), c.getDateOfCertificate());
    }

    private static Experience toEntity(ExperienceDto d) {
        return new Experience(d.companyName(), d.startingDate(), d.endDate(), d.currently(), d.positionName(), d.jobDescription(), d.jobAchievements());
    }

    private static ExperienceDto toDto(Experience e) {
        return new ExperienceDto(e.getCompanyName(), e.getStartingDate(), e.getEndDate(), e.getCurrently(), e.getPositionName(), e.getJobDescription(), e.getJobAchievements());
    }

    private static Course toEntity(CourseDto d) {
        return new Course(d.courseName(), d.dateOfCourse(), d.courseDescription());
    }

    private static CourseDto toDto(Course c) {
        return new CourseDto(c.getCourseName(), c.getDateOfCourse(), c.getCourseDescription());
    }

    private static Skill toEntity(SkillDto d) {
        return new Skill(d.name(), Skill.Type.valueOf(d.type()));
    }

    private static SkillDto toDto(Skill s) {
        return new SkillDto(s.getName(), s.getType()
                .name());
    }
}
