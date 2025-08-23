package pl.ceveme.application.usecase.employmentInfo.experience;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.experience.ExperienceRequest;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.domain.model.entities.Experience;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.ExperienceRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateExperienceUseCase {

    private final UserRepository userRepository;
    private final ExperienceRepository experienceRepository;

    public CreateExperienceUseCase(UserRepository userRepository, ExperienceRepository experienceRepository) {
        this.userRepository = userRepository;
        this.experienceRepository = experienceRepository;
    }

    @Transactional
    public ExperienceResponse execute(ExperienceRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Experience experience = new Experience(request.companyName(), request.startingDate(), request.endDate(), request.currently(), request.positionName(), request.jobDescription(), request.jobAchievements());

        user.addExperience(experience);

        experienceRepository.save(experience);

        return new ExperienceResponse(experience.getId(), request.companyName(), request.positionName(), "Addition of experience successfully completed");
    }
}