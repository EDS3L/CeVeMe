package pl.ceveme.application.usecase.employmentInfo.experience;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.experience.ExperienceRequest;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.domain.model.entities.Experience;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateExperienceUseCase {

    private final UserRepository userRepository;

    public CreateExperienceUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public ExperienceResponse execute(ExperienceRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.addExperience(new Experience(request.companyName(), request.startingDate(), request.endDate(), request.currently(), request.positionName(), request.jobDescription(), request.jobAchievements()));

        userRepository.save(user);

        return new ExperienceResponse(
                request.companyName(),
                request.positionName(),
                "Addition of experience successfully completed"
        );
    }
}