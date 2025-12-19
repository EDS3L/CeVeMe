package pl.ceveme.application.usecase.employmentInfo.education;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.application.dto.entity.education.EducationRequest;
import pl.ceveme.application.dto.entity.education.EducationResponse;
import pl.ceveme.domain.model.entities.Education;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.EducationRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateEducationUseCase {

    private final UserRepository userRepository;
    private final EducationRepository educationRepository;

    public CreateEducationUseCase(UserRepository userRepository, EducationRepository educationRepository) {
        this.userRepository = userRepository;
        this.educationRepository = educationRepository;
    }

    @Transactional
    public EducationResponse execute(EducationRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Education education = new Education(
                request.schoolName(),
                request.degree(),
                request.fieldOfStudy(),
                request.startingDate(),
                request.endDate(),
                request.currently()
        );

        user.addEducation(education);

        educationRepository.save(education);

        return new EducationResponse(
                education.getId(),
                request.schoolName(),
                request.degree(),
                request.fieldOfStudy(),
                "Addition of education successfully completed"
        );
    }
}

