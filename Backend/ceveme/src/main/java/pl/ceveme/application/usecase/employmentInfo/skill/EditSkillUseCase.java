package pl.ceveme.application.usecase.employmentInfo.skill;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.skill.SkillRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditSkillUseCase {

    private final UserRepository userRepository;

    public EditSkillUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public SkillResponse execute(SkillRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EmploymentInfo info = user.getEmploymentInfo();

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Skill skill = info.getSkillById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));

        skill.update(
                request.name(),
                request.type()
        );

        return new SkillResponse(
                skill.getId(),
                request.name(),
                request.type(),
                "Skill updated successfully"
        );
    }
}
