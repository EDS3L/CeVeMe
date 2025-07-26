package pl.ceveme.application.usecase.employmentInfo.skill;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

@Service
public class DeleteSkillUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeleteSkillUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public SkillResponse execute(DeleteEntityRequest request) {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        Skill skill = info.getSkillById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Skill not found"));

        info.removeSkill(skill);

        return new SkillResponse(
                skill.getName(),
                skill.getType(),
                "Skill deleted successfully"
        );
    }
}
