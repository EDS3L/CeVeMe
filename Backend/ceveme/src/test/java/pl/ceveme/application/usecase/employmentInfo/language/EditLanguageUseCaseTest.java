package pl.ceveme.application.usecase.employmentInfo.language;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.language.LanguageRequest;
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
class EditLanguageUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EditLanguageUseCase editLanguageUseCase;

    @Test
    void should_editLanguage_when_languageExists() throws AccessDeniedException {
        // given
        Long userId = 1L;
        Long languageId = 10L;
        Language language = new Language("Old Language", "C1");
        try {
            java.lang.reflect.Field field = Language.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(language, languageId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        LanguageRequest request = new LanguageRequest(languageId, "Updated Language", "B2", userId);
        EmploymentInfo info = new EmploymentInfo();
        info.addLanguage(language);
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        LanguageResponse response = editLanguageUseCase.execute(request, userId);

        // then
        assertThat(response.name()).isEqualTo("Updated Language");
        assertThat(response.message()).isEqualTo("Language updated successfully");
    }

    @Test
    void should_throwException_when_languageNotFound() {
        // given
        Long userId = 1L;
        LanguageRequest request = new LanguageRequest(99L, "Language", "C1", userId);
        EmploymentInfo info = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editLanguageUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("Language not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long userId = 999L;
        LanguageRequest request = new LanguageRequest(1L, "Any", "C1", userId);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editLanguageUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("User not found");
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
