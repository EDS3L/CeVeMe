package pl.ceveme.application.usecase.employmentInfo.skill;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.skill.SkillRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateSkillUseCase {

    private final UserRepository userRepository;

    public CreateSkillUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public SkillResponse execute(SkillRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.addSkill(new Skill(request.name(), request.type()));

        userRepository.save(user);

        return new SkillResponse(request.name(), request.type(), "Addition of skill successfully completed");
    }
}
