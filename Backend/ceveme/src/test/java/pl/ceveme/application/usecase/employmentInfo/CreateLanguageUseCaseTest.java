package pl.ceveme.application.usecase.employmentInfo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.language.LanguageRequest;
import pl.ceveme.application.dto.entity.language.LanguageResponse;
import pl.ceveme.application.usecase.employmentInfo.language.CreateLanguageUseCase;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateLanguageUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CreateLanguageUseCase useCase;


    @Test
    void should_addLanguageToUser_when_ValuesAreCorrect() {
        // given
        String email = "test@wp.pl";
        String languageName = "English";
        String lvl = "C1";

        User user = new User();
        when(userRepository.findByEmail(new Email(email))).thenReturn(Optional.of(user));

        LanguageRequest request = new LanguageRequest(1L,email,languageName,lvl);

        // when

        LanguageResponse response = useCase.execute(request);

        // then

        verify(userRepository).save(user);

        assertEquals(languageName, response.name());
        assertEquals(lvl, response.level());
        assertEquals("Addition of language successfully completed", response.message());
    }
    @Test
    void should_ThrowException_when_userNotFound() {
        // given
        String email = "test@wp.pl";
        when(userRepository.findByEmail(new Email(email))).thenReturn(Optional.empty());

        LanguageRequest request = new LanguageRequest(1L,email, "German", "B2");

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            useCase.execute(request);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, never()).save(any());
    }


}