package pl.ceveme.application.usecase.employmentInfo.language;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Language;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeleteLanguageUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DeleteLanguageUseCase deleteLanguageUseCase;

    @Test
    void should_deleteLanguage_when_exists() throws AccessDeniedException {
        // given
        Long languageId = 123L;
        Long userId = 1L;
        Language language = createLanguageWithId(languageId, "To delete", "Level");

        EmploymentInfo info = new EmploymentInfo();
        info.addLanguage(language);
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        LanguageResponse response = deleteLanguageUseCase.execute(new DeleteEntityRequest(languageId), userId);

        // then
        assertThat(response.name()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("Language deleted successfully");
    }

    @Test
    void should_throwException_when_languageNotFound() {
        // given
        Long languageId = 999L;
        Long userId = 1L;
        EmploymentInfo info = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteLanguageUseCase.execute(new DeleteEntityRequest(languageId), userId));

        assertThat(ex.getMessage()).isEqualTo("Language not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long languageId = 999L;
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteLanguageUseCase.execute(new DeleteEntityRequest(languageId), userId));

        assertThat(ex.getMessage()).isEqualTo("User with id " + userId + " not found");
    }

    // helper for test
    private Language createLanguageWithId(Long id, String languageName, String level) {
        Language language = new Language(languageName, level);
        try {
            java.lang.reflect.Field field = Language.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(language, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return language;
    }

    private void setUserId(User user, Long id) {
        try {
            java.lang.reflect.Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
