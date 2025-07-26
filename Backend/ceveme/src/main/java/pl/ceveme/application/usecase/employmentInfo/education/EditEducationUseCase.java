package pl.ceveme.application.usecase.employmentInfo.education;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.application.dto.entity.education.EducationRequest;
import pl.ceveme.application.dto.entity.education.EducationResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.Education;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

@Service
public class EditEducationUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditEducationUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public EducationResponse execute(EducationRequest request, Long employmentInfoId) {
        EmploymentInfo info = employmentInfoRepository.findById(employmentInfoId)
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        Education education = info.getEducationById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Education not found"));

        education.update(request.schoolName(), request.degree(), request.fieldOfStudy(),request.startingDate(),request.endDate(),request.currently());

        return new EducationResponse(request.schoolName(), request.degree(),request.fieldOfStudy(), "Course updated successfully");
    }
}
