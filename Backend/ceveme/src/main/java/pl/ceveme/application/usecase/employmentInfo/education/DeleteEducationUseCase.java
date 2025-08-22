package pl.ceveme.application.usecase.employmentInfo.education;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.education.EducationResponse;
import pl.ceveme.domain.model.entities.Education;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteEducationUseCase {


    private final UserRepository userRepository;

    public DeleteEducationUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public EducationResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        EmploymentInfo info = user.getEmploymentInfo();

        if (info.getUser()
                .getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Education education = info.getEducationById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Education not found!"));

        info.removeEducation(education);

        return new EducationResponse(education.getId(),education.getSchoolName(), education.getDegree(), education.getFieldOfStudy(), "Course deleted successfully");
    }
}
