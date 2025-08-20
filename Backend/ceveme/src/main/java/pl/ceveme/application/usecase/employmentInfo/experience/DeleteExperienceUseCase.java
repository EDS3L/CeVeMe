package pl.ceveme.application.usecase.employmentInfo.experience;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Experience;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteExperienceUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeleteExperienceUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public ExperienceResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Experience experience = info.getExperienceById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Experience not found"));

        info.removeExperience(experience);

        return new ExperienceResponse(
                experience.getCompanyName(),
                experience.getPositionName(),
                "Experience deleted successfully"
        );
    }
}
