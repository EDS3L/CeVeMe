package pl.ceveme.application.usecase.employmentInfo.experience;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.experience.ExperienceRequest;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Experience;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditExperienceUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditExperienceUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public ExperienceResponse execute(ExperienceRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Experience experience = info.getExperienceById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Experience not found"));

        experience.update(
                request.companyName(),
                request.startingDate(),
                request.endDate(),
                request.currently(),
                request.positionName(),
                request.jobDescription(),
                request.jobAchievements()
        );

        return new ExperienceResponse(
                experience.getId(),
                request.companyName(),
                request.positionName(),
                "Experience updated successfully"
        );
    }
}
