package pl.ceveme.application.usecase.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import pl.ceveme.application.dto.auth.ActiveUserRequest;
import pl.ceveme.application.dto.auth.ActiveUserResponse;
import pl.ceveme.domain.model.entities.ActivationToken;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.ActivationTokenRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ActiveUserUseCaseTest {

    private ActivationTokenRepository activationTokenRepository;
    private UserRepository userRepository;
    private ActiveUserUseCase useCase;

    @BeforeEach
    void setUp() {
        activationTokenRepository = mock(ActivationTokenRepository.class);
        userRepository = mock(UserRepository.class);
        useCase = new ActiveUserUseCase(activationTokenRepository, userRepository);
    }

    @Test
    void shouldActivateUserWhenTokenExists() {
        String uuid = "test-uuid";
        Email email = new Email("test@example.com");
        User user = new User();
        ActivationToken token = new ActivationToken(LocalDate.now().plusWeeks(2));

        when(activationTokenRepository.findByUUID(UUID.randomUUID())).thenReturn(Optional.of(token));

        ActiveUserRequest request = new ActiveUserRequest(UUID.randomUUID());
        ActiveUserResponse response = useCase.execute(request);

        assertTrue(user.isActive());
        assertEquals("test@example.com", response.email());
        assertEquals("User activation successful", response.message());

        verify(userRepository).save(user);
    }

    @Test
    void shouldThrowExceptionWhenTokenNotFound() {
        String uuid = "invalid-uuid";

        when(activationTokenRepository.findByUUID(UUID.randomUUID())).thenReturn(Optional.empty());

        ActiveUserRequest request = new ActiveUserRequest(UUID.randomUUID());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            useCase.execute(request);
        });

        assertEquals("Activation Token not found", exception.getMessage());
    }
}
