package pl.ceveme.infrastructure.controllers.employmentInfo;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoRequest;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
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
import pl.ceveme.application.usecase.employmentInfo.*;
import pl.ceveme.application.usecase.employmentInfo.certificate.CreateCertificateUseCase;
import pl.ceveme.application.usecase.employmentInfo.course.CreateCourseUseCase;
import pl.ceveme.application.usecase.employmentInfo.education.CreateEducationUseCase;
import pl.ceveme.application.usecase.employmentInfo.experience.CreateExperienceUseCase;
import pl.ceveme.application.usecase.employmentInfo.language.CreateLanguageUseCase;
import pl.ceveme.application.usecase.employmentInfo.link.CreateLinkUseCase;
import pl.ceveme.application.usecase.employmentInfo.portfolio.CreatePortfolioItemUseCase;
import pl.ceveme.application.usecase.employmentInfo.skill.CreateSkillUseCase;
import pl.ceveme.domain.model.entities.User;

@RestController
@RequestMapping("/api/employmentInfo/create")
public class CreateEmploymentInfoController {

    private final CreateEmploymentInfoUseCase employmentInfoUseCase;
    private final CreateCertificateUseCase createCertificateUseCase;
    private final CreateCourseUseCase createCourseUseCase;
    private final CreateExperienceUseCase createExperienceUseCase;
    private final CreateLanguageUseCase createLanguageUseCase;
    private final CreateSkillUseCase createSkillUseCase;
    private final CreatePortfolioItemUseCase createPortfolioItemUseCase;
    private final CreateLinkUseCase createLinkUseCase;
    private final CreateEducationUseCase createEducationUseCase;


    public CreateEmploymentInfoController(CreateEmploymentInfoUseCase employmentInfoUseCase, CreateCertificateUseCase createCertificateUseCase, CreateCourseUseCase createCourseUseCase, CreateExperienceUseCase createExperienceUseCase, CreateLanguageUseCase createLanguageUseCase, CreateSkillUseCase createSkillUseCase, CreatePortfolioItemUseCase createPortfolioItemUseCase, CreateLinkUseCase createLinkUseCase, CreateEducationUseCase createEducationUseCase) {
        this.employmentInfoUseCase = employmentInfoUseCase;
        this.createCertificateUseCase = createCertificateUseCase;
        this.createCourseUseCase = createCourseUseCase;
        this.createExperienceUseCase = createExperienceUseCase;
        this.createLanguageUseCase = createLanguageUseCase;
        this.createSkillUseCase = createSkillUseCase;
        this.createPortfolioItemUseCase = createPortfolioItemUseCase;
        this.createLinkUseCase = createLinkUseCase;
        this.createEducationUseCase = createEducationUseCase;
    }

    @PostMapping("/create")
    public ResponseEntity<EmploymentInfoResponse> createEmploymentInfo(@Valid @RequestBody EmploymentInfoRequest request) {
        EmploymentInfoResponse response = employmentInfoUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/certificate")
    public ResponseEntity<CertificateResponse> createCertificate(@Valid @RequestBody CertificateRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        CertificateResponse response = createCertificateUseCase.execute(request,userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/course")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        CourseResponse response = createCourseUseCase.execute(request,userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/experience")
    public ResponseEntity<ExperienceResponse> createExperience(@Valid @RequestBody ExperienceRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        ExperienceResponse response = createExperienceUseCase.execute(request,userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/language")
    public ResponseEntity<LanguageResponse> createLanguage(@Valid @RequestBody LanguageRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        LanguageResponse response = createLanguageUseCase.execute(request,userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/skill")
    public ResponseEntity<SkillResponse> createSkill(@Valid @RequestBody SkillRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        SkillResponse response = createSkillUseCase.execute(request,userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/portfolioItem")
    public ResponseEntity<PortfolioItemsResponse> createPortfolioItem(@Valid @RequestBody PortfolioItemsRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        PortfolioItemsResponse response = createPortfolioItemUseCase.execute(request,userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/link")
    public ResponseEntity<LinkResponse> createLink(@Valid @RequestBody LinkRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        LinkResponse response = createLinkUseCase.execute(request,userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/education")
    public ResponseEntity<EducationResponse> createEducation(@Valid @RequestBody EducationRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        EducationResponse response = createEducationUseCase.execute(request,userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
