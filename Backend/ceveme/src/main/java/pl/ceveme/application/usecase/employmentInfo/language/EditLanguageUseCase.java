package pl.ceveme.application.usecase.employmentInfo.language;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.language.LanguageRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditLanguageUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditLanguageUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public LanguageResponse execute(LanguageRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Language language = info.getLanguageById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Language not found"));

        language.update(
                request.name(),
                request.level()
        );

        return new LanguageResponse(
                request.name(),
                request.level(),
                "Language updated successfully"
        );
    }
}
