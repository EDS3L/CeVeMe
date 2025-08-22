package pl.ceveme.application.usecase.employmentInfo.language;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.language.LanguageRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.LanguageRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateLanguageUseCase {

    private final UserRepository userRepository;
    private final LanguageRepository languageRepository;

    public CreateLanguageUseCase(UserRepository userRepository, LanguageRepository languageRepository) {
        this.userRepository = userRepository;
        this.languageRepository = languageRepository;
    }

    @Transactional
    public LanguageResponse execute(LanguageRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Language language = new Language(request.name(), request.level());

        user.addLanguage(language);

        languageRepository.save(language);

        return new LanguageResponse(language.getId(), request.name(), request.level(), "Addition of language successfully completed");
    }
}