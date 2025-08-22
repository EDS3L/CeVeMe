package pl.ceveme.application.usecase.employmentInfo.skill;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.skill.SkillRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.SkillRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateSkillUseCase {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public CreateSkillUseCase(UserRepository userRepository, SkillRepository skillRepository) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional
    public SkillResponse execute(SkillRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Skill skill = new Skill(request.name(), request.type());

        user.addSkill(skill);

        skillRepository.save(skill);

        return new SkillResponse(
                skill.getId(),
                request.name(),
                request.type(),
                "Addition of skill successfully completed"
        );
    }
}