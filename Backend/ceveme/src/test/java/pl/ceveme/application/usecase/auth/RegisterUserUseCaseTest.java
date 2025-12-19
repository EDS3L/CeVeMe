package pl.ceveme.application.usecase.auth;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.auth.RegisterUserRequest;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;
import pl.ceveme.infrastructure.adapter.security.BCryptPasswordEncoderAdapter;
import pl.ceveme.infrastructure.external.email.ConfirmationRegisterEmail;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegisterUserUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoderAdapter cryptPasswordEncoderAdapter;

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @Mock
    private ConfirmationRegisterEmail confirmationRegisterEmail;

    @InjectMocks
    private RegisterUserUseCase userUseCase;


    @Test
    void should_returnResponseWithNameSurnameEmail_when_credentialsAreValid() {
        // given
        var request = new RegisterUserRequest("Mateusz", "Kowalski", "+48696123432", "mateusz@wp.pl", "Start1234!", "Warsaw");

        // when
        var response = userUseCase.register(request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.name()).isEqualTo("Mateusz");
        assertThat(response.surname()).isEqualTo("Kowalski");
        assertThat(response.email()).isEqualTo("mateusz@wp.pl");
        assertThat(response.message()).isEqualTo("Register successful!");

    }

    @Test
    void should_throwIllegalArgumentException_when_emailIsAlreadyExists() {
        // given
        var request = new RegisterUserRequest("Mateusz", "Kowalski", "+48696123432", "mateusz@wp.pl", "Start1234!", "Warsaw");

        // when
        when(userRepository.existsByEmail(new Email(request.email()))).thenReturn(true);

        // then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> userUseCase.register(request));
        assertThat(ex.getMessage()).isEqualTo("Email already exists!");

    }

}