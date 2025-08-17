package pl.ceveme.infrastructure.controllers.employmentInfo;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.application.dto.entity.education.EducationRequest;
import pl.ceveme.application.dto.entity.education.EducationResponse;
import pl.ceveme.application.dto.entity.experience.ExperienceRequest;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.application.dto.entity.language.LanguageRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.application.dto.entity.link.LinkRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.application.dto.entity.skill.SkillRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.application.usecase.employmentInfo.certificate.EditCertificateUseCase;
import pl.ceveme.application.usecase.employmentInfo.course.EditCourseUseCase;
import pl.ceveme.application.usecase.employmentInfo.education.EditEducationUseCase;
import pl.ceveme.application.usecase.employmentInfo.experience.EditExperienceUseCase;
import pl.ceveme.application.usecase.employmentInfo.language.EditLanguageUseCase;
import pl.ceveme.application.usecase.employmentInfo.link.EditLinkUseCase;
import pl.ceveme.application.usecase.employmentInfo.portfolio.EditPortfolioItemUseCase;
import pl.ceveme.application.usecase.employmentInfo.skill.EditSkillUseCase;

@RestController
@RequestMapping("/api/employmentInfo/delete")
public class EditEmploymentInfoController {

    private final EditCertificateUseCase editCertificateUseCase;
    private final EditCourseUseCase editCourseUseCase;
    private final EditEducationUseCase editEducationUseCase;
    private final EditExperienceUseCase editExperienceUseCase;
    private final EditLanguageUseCase editLanguageUseCase;
    private final EditLinkUseCase editLinkUseCase;
    private final EditPortfolioItemUseCase editPortfolioItemUseCase;
    private final EditSkillUseCase editSkillUseCase;

    public EditEmploymentInfoController(EditCertificateUseCase editCertificateUseCase, EditCourseUseCase editCourseUseCase, EditEducationUseCase editEducationUseCase, EditExperienceUseCase editExperienceUseCase, EditLanguageUseCase editLanguageUseCase, EditLinkUseCase editLinkUseCase, EditPortfolioItemUseCase editPortfolioItemUseCase, EditSkillUseCase editSkillUseCase) {
        this.editCertificateUseCase = editCertificateUseCase;
        this.editCourseUseCase = editCourseUseCase;
        this.editEducationUseCase = editEducationUseCase;
        this.editExperienceUseCase = editExperienceUseCase;
        this.editLanguageUseCase = editLanguageUseCase;
        this.editLinkUseCase = editLinkUseCase;
        this.editPortfolioItemUseCase = editPortfolioItemUseCase;
        this.editSkillUseCase = editSkillUseCase;
    }

    @PatchMapping("/certificate")
    public ResponseEntity<CertificateResponse> createCertificate(@Valid @RequestBody CertificateRequest request, Long id) {
        CertificateResponse response = editCertificateUseCase.execute(request, id);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(response);
    }

    @PatchMapping("/course")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request, Long id) {
        CourseResponse response = editCourseUseCase.execute(request, id);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(response);
    }

    @PatchMapping("/experience")
    public ResponseEntity<ExperienceResponse> createExperience(@Valid @RequestBody ExperienceRequest request, Long id) {
        ExperienceResponse response = editExperienceUseCase.execute(request, id);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(response);
    }

    @PatchMapping("/language")
    public ResponseEntity<LanguageResponse> createLanguage(@Valid @RequestBody LanguageRequest request, Long id) {
        LanguageResponse response = editLanguageUseCase.execute(request, id);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(response);
    }

    @PatchMapping("/skill")
    public ResponseEntity<SkillResponse> createSkill(@Valid @RequestBody SkillRequest request, Long id) {
        SkillResponse response = editSkillUseCase.execute(request, id);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(response);
    }

    @PatchMapping("/portfolioItem")
    public ResponseEntity<PortfolioItemsResponse> createPortfolioItem(@Valid @RequestBody PortfolioItemsRequest request, Long id) {
        PortfolioItemsResponse response = editPortfolioItemUseCase.execute(request, id);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(response);
    }

    @PatchMapping("/link")
    public ResponseEntity<LinkResponse> createLink(@Valid @RequestBody LinkRequest request, Long id) {
        LinkResponse response = editLinkUseCase.execute(request, id);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(response);
    }

    @PatchMapping("/education")
    public ResponseEntity<EducationResponse> createEducation(@Valid @RequestBody EducationRequest request, Long id) {
        EducationResponse response = editEducationUseCase.execute(request, id);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(response);
    }
}
