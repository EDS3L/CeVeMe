package pl.ceveme.application.usecase.employmentInfo.language;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.language.LanguageRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.LanguageRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateLanguageUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private LanguageRepository languageRepository;

    @InjectMocks
    private CreateLanguageUseCase useCase;


    @Test
    void should_addLanguageToUser_when_ValuesAreCorrect() {
        // given
        Long userId = 1L;
        String languageName = "English";
        String lvl = "C1";

        User user = new User();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        LanguageRequest request = new LanguageRequest(1L, languageName, lvl, userId);

        // when

        LanguageResponse response = useCase.execute(request, userId);

        // then

        verify(languageRepository).save(any());

        assertEquals(languageName, response.name());
        assertEquals(lvl, response.level());
        assertEquals("Addition of language successfully completed", response.message());
    }
    @Test
    void should_ThrowException_when_userNotFound() {
        // given
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        LanguageRequest request = new LanguageRequest(1L, "German", "B2", userId);

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            useCase.execute(request, userId);
        });

        assertEquals("User not found", exception.getMessage());
        verify(languageRepository, never()).save(any());
    }


}