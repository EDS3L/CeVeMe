package pl.ceveme.application.usecase.employmentInfo.language;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteLanguageUseCase {

    private final UserRepository userRepository;

    public DeleteLanguageUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public LanguageResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        EmploymentInfo info = user.getEmploymentInfo();
        if (info.getUser()
                .getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Language language = info.getLanguageById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Language not found"));

        info.removeLanguage(language);

        return new LanguageResponse(language.getId(),language.getName(), language.getLevel(), "Language deleted successfully");
    }
}
