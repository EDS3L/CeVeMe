package pl.ceveme.application.usecase.employmentInfo.experience;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Experience;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteExperienceUseCase {

    private final UserRepository userRepository;

    public DeleteExperienceUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public ExperienceResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        EmploymentInfo info = user.getEmploymentInfo();

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Experience experience = info.getExperienceById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Experience not found"));

        info.removeExperience(experience);

        return new ExperienceResponse(
                experience.getId(),
                experience.getCompanyName(),
                experience.getPositionName(),
                "Experience deleted successfully"
        );
    }
}
