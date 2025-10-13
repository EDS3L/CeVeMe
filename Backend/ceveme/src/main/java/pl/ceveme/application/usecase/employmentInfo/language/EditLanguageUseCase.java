package pl.ceveme.application.usecase.employmentInfo.language;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.language.LanguageRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditLanguageUseCase {

    private final UserRepository userRepository;

    public EditLanguageUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public LanguageResponse execute(LanguageRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EmploymentInfo info = user.getEmploymentInfo();
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
                language.getId(),
                request.name(),
                request.level(),
                "Language updated successfully"
        );
    }
}
