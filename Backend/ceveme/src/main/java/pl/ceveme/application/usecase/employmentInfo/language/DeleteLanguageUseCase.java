package pl.ceveme.application.usecase.employmentInfo.language;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

@Service
public class DeleteLanguageUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeleteLanguageUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public LanguageResponse execute(DeleteEntityRequest request) {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

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
