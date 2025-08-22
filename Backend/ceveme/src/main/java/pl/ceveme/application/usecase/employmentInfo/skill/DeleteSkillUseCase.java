package pl.ceveme.application.usecase.employmentInfo.skill;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteSkillUseCase {

    private final UserRepository userRepository;

    public DeleteSkillUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public SkillResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        EmploymentInfo info = user.getEmploymentInfo();
        if (info.getUser()
                .getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Skill skill = info.getSkillById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));

        info.removeSkill(skill);

        return new SkillResponse(skill.getId(), skill.getName(), skill.getType(), "Skill deleted successfully");
    }
}
