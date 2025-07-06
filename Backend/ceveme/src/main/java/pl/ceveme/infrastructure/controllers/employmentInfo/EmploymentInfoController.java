package pl.ceveme.infrastructure.controllers.employmentInfo;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.certificate.CertificateRequest;
import pl.ceveme.application.dto.certificate.CertificateResponse;
import pl.ceveme.application.dto.course.CourseRequest;
import pl.ceveme.application.dto.course.CourseResponse;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoRequest;
import pl.ceveme.application.dto.employmentInfo.EmploymentInfoResponse;
import pl.ceveme.application.dto.experience.ExperienceRequest;
import pl.ceveme.application.dto.experience.ExperienceResponse;
import pl.ceveme.application.dto.language.LanguageRequest;
import pl.ceveme.application.dto.language.LanguageResponse;
import pl.ceveme.application.dto.skill.SkillRequest;
import pl.ceveme.application.dto.skill.SkillResponse;
import pl.ceveme.application.usecase.employmentInfo.*;

@RestController
@RequestMapping("/api/employmentInfo")
public class EmploymentInfoController {

    private final CreateEmploymentInfoUseCase employmentInfoUseCase;
    private final CreateCertificateUseCase createCertificateUseCase;
    private final CreateCourseUseCase createCourseUseCase;
    private final CreateExperienceUseCase createExperienceUseCase;
    private final CreateLanguageUseCase createLanguageUseCase;
    private final CreateSkillUseCase createSkillUseCase;
    private final GetEmploymentInfoUseCase getEmploymentInfoUseCase;

    public EmploymentInfoController(CreateEmploymentInfoUseCase employmentInfoUseCase, CreateCertificateUseCase createCertificateUseCase, CreateCourseUseCase createCourseUseCase, CreateExperienceUseCase createExperienceUseCase, CreateLanguageUseCase createLanguageUseCase, CreateSkillUseCase createSkillUseCase, GetEmploymentInfoUseCase getEmploymentInfoUseCase) {
        this.employmentInfoUseCase = employmentInfoUseCase;
        this.createCertificateUseCase = createCertificateUseCase;
        this.createCourseUseCase = createCourseUseCase;
        this.createExperienceUseCase = createExperienceUseCase;
        this.createLanguageUseCase = createLanguageUseCase;
        this.createSkillUseCase = createSkillUseCase;
        this.getEmploymentInfoUseCase = getEmploymentInfoUseCase;
    }

    @PostMapping("/create")
    public ResponseEntity<EmploymentInfoResponse> createEmploymentInfo(@Valid @RequestBody EmploymentInfoRequest request) {
        EmploymentInfoResponse response = employmentInfoUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/certificate")
    public ResponseEntity<CertificateResponse> createCertificate(@Valid @RequestBody CertificateRequest request) {
        CertificateResponse response = createCertificateUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/course")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request) {
        CourseResponse response = createCourseUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/experience")
    public ResponseEntity<ExperienceResponse> createExperience(@Valid @RequestBody ExperienceRequest request) {
        ExperienceResponse response = createExperienceUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/language")
    public ResponseEntity<LanguageResponse> createLanguage(@Valid @RequestBody LanguageRequest request) {
        LanguageResponse response = createLanguageUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/skill")
    public ResponseEntity<SkillResponse> createSkill(@Valid @RequestBody SkillRequest request) {
        SkillResponse response = createSkillUseCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{email}")
    public ResponseEntity<EmploymentInfoResponse> geEmploymentInfo(@PathVariable String email) {
        EmploymentInfoResponse response = getEmploymentInfoUseCase.execute(email);
        return ResponseEntity.ok(response);
    }
}
