package pl.ceveme.application.usecase.employmentInfo;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.language.LanguageRequest;
import pl.ceveme.application.dto.language.LanguageResponse;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

@Service

public class CreateLanguageUseCase {

    private final UserRepository userRepository;

    public CreateLanguageUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public LanguageResponse execute(LanguageRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.addLanguage(new Language(request.name(), request.level()));

        userRepository.save(user);

        return new LanguageResponse(request.name(), request.level(), "Addition of language successfully completed");
    }
}
