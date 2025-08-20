package pl.ceveme.application.usecase.employmentInfo.language;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteLanguageUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeleteLanguageUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public LanguageResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Language language = info.getLanguageById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Language not found"));

        info.removeLanguage(language);

        return new LanguageResponse(
                language.getName(),
                language.getLevel(),
                "Language deleted successfully"
        );
    }
}
