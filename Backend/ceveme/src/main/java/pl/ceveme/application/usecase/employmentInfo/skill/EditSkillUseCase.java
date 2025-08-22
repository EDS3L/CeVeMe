package pl.ceveme.application.usecase.employmentInfo.skill;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.skill.SkillRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditSkillUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditSkillUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public SkillResponse execute(SkillRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

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
