package pl.ceveme.application.usecase.employmentInfo;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.ceveme.application.dto.entity.education.EducationRequest;
import pl.ceveme.application.dto.entity.education.EducationResponse;
import pl.ceveme.domain.model.entities.Education;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateEducationUseCase {

    private final UserRepository userRepository;

    public CreateEducationUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public EducationResponse execute(EducationRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.addEducation(new Education(
                request.schoolName(),
                request.degree(),
                request.fieldOfStudy(),
                request.startingDate(),
                request.endDate(),
                request.currently()
        ));

        userRepository.save(user);

        return new EducationResponse(
                request.schoolName(),
                request.degree(),
                request.fieldOfStudy(),
                "Addition of education successfully completed"
        );
    }
}

