package pl.ceveme.application.usecase.employmentInfo.education;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.education.EducationRequest;
import pl.ceveme.application.dto.entity.education.EducationResponse;
import pl.ceveme.domain.model.entities.Education;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

@Service
public class DeleteEducationUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeleteEducationUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public EducationResponse execute(DeleteEntityRequest request) {
        EmploymentInfo employmentInfo = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found!"));

        Education education = employmentInfo.getEducationById(request.itemId()).orElseThrow(() -> new IllegalArgumentException("Education not found!"));

        employmentInfo.removeEducation(education);

        return new EducationResponse(education.getSchoolName(), education.getDegree(),education.getFieldOfStudy(), "Course deleted successfully");
    }
}
