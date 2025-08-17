package pl.ceveme.infrastructure.controllers.employmentInfo;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.application.dto.entity.education.EducationResponse;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.application.usecase.employmentInfo.certificate.DeleteCertificateUseCase;
import pl.ceveme.application.usecase.employmentInfo.course.DeleteCourseUseCase;
import pl.ceveme.application.usecase.employmentInfo.education.DeleteEducationUseCase;
import pl.ceveme.application.usecase.employmentInfo.experience.DeleteExperienceUseCase;
import pl.ceveme.application.usecase.employmentInfo.language.DeleteLanguageUseCase;
import pl.ceveme.application.usecase.employmentInfo.link.DeleteLinkUseCase;
import pl.ceveme.application.usecase.employmentInfo.portfolio.DeletePortfolioItemUseCase;
import pl.ceveme.application.usecase.employmentInfo.skill.DeleteSkillUseCase;

@RestController
@RequestMapping("/api/employmentInfo/delete")
public class DeleteEmploymentInfoController {

    private final DeleteCertificateUseCase deleteCertificateUseCase;
    private final DeleteCourseUseCase deleteCourseUseCase;
    private final DeleteEducationUseCase deleteEducationUseCase;
    private final DeleteExperienceUseCase deleteExperienceUseCase;
    private final DeleteLanguageUseCase deleteLanguageUseCase;
    private final DeleteLinkUseCase deleteLinkUseCase;
    private final DeletePortfolioItemUseCase deletePortfolioItemUseCase;
    private final DeleteSkillUseCase deleteSkillUseCase;


    public DeleteEmploymentInfoController(DeleteCertificateUseCase deleteCertificateUseCase, DeleteCourseUseCase deleteCourseUseCase, DeleteEducationUseCase deleteEducationUseCase, DeleteExperienceUseCase deleteExperienceUseCase, DeleteLanguageUseCase deleteLanguageUseCase, DeleteLinkUseCase deleteLinkUseCase, DeletePortfolioItemUseCase deletePortfolioItemUseCase, DeleteSkillUseCase deleteSkillUseCase) {
        this.deleteCertificateUseCase = deleteCertificateUseCase;
        this.deleteCourseUseCase = deleteCourseUseCase;
        this.deleteEducationUseCase = deleteEducationUseCase;
        this.deleteExperienceUseCase = deleteExperienceUseCase;
        this.deleteLanguageUseCase = deleteLanguageUseCase;
        this.deleteLinkUseCase = deleteLinkUseCase;
        this.deletePortfolioItemUseCase = deletePortfolioItemUseCase;
        this.deleteSkillUseCase = deleteSkillUseCase;
    }

    @DeleteMapping("/certificate")
    public ResponseEntity<CertificateResponse> createCertificate(@Valid @RequestBody DeleteEntityRequest request) {
        CertificateResponse response = deleteCertificateUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.GONE)
                .body(response);
    }

    @DeleteMapping("/course")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody DeleteEntityRequest request) {
        CourseResponse response = deleteCourseUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.GONE)
                .body(response);
    }

    @DeleteMapping("/experience")
    public ResponseEntity<ExperienceResponse> createExperience(@Valid @RequestBody DeleteEntityRequest request) {
        ExperienceResponse response = deleteExperienceUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.GONE)
                .body(response);
    }

    @DeleteMapping("/language")
    public ResponseEntity<LanguageResponse> createLanguage(@Valid @RequestBody DeleteEntityRequest request) {
        LanguageResponse response = deleteLanguageUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.GONE)
                .body(response);
    }

    @DeleteMapping("/skill")
    public ResponseEntity<SkillResponse> createSkill(@Valid @RequestBody DeleteEntityRequest request) {
        SkillResponse response = deleteSkillUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.GONE)
                .body(response);
    }

    @DeleteMapping("/portfolioItem")
    public ResponseEntity<PortfolioItemsResponse> createPortfolioItem(@Valid @RequestBody DeleteEntityRequest request) {
        PortfolioItemsResponse response = deletePortfolioItemUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.GONE)
                .body(response);
    }

    @DeleteMapping("/link")
    public ResponseEntity<LinkResponse> createLink(@Valid @RequestBody DeleteEntityRequest request) {
        LinkResponse response = deleteLinkUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.GONE)
                .body(response);
    }

    @DeleteMapping("/education")
    public ResponseEntity<EducationResponse> createEducation(@Valid @RequestBody DeleteEntityRequest request) {
        EducationResponse response = deleteEducationUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.GONE)
                .body(response);
    }
}
