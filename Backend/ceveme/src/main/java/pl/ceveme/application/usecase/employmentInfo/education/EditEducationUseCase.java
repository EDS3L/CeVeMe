package pl.ceveme.application.usecase.employmentInfo.education;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.application.dto.entity.education.EducationRequest;
import pl.ceveme.application.dto.entity.education.EducationResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.Education;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditEducationUseCase {

    private final UserRepository userRepository;

    public EditEducationUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public EducationResponse execute(EducationRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EmploymentInfo info = user.getEmploymentInfo();

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Education education = info.getEducationById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Education not found"));

        education.update(request.schoolName(), request.degree(), request.fieldOfStudy(),request.startingDate(),request.endDate(),request.currently());

        return new EducationResponse(education.getId(),request.schoolName(), request.degree(),request.fieldOfStudy(), "Course updated successfully");
    }
}
