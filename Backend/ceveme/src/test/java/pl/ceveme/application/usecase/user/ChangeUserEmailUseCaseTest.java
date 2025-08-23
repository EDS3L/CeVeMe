package pl.ceveme.application.usecase.user;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChangeUserEmailUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ChangeUserEmailUseCase changeUserEmailUseCase;

    @Test
    void shouldChangeEmail_whenEmailIsAvailable() {
        // GIVEN
        long userId = 1L;
        String newEmail = "nowy.email@example.com";
        User user = mock(User.class);

        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.empty()); // Email jest wolny
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // WHEN
        changeUserEmailUseCase.execute(userId, newEmail);

        // THEN
        ArgumentCaptor<Email> emailCaptor = ArgumentCaptor.forClass(Email.class);
        verify(user).changeEmail(emailCaptor.capture());
        assertThat(emailCaptor.getValue().email()).isEqualTo(newEmail);
    }

    @Test
    void shouldThrowException_whenEmailIsTakenByAnotherUser() {
        // GIVEN
        long currentUserId = 1L;
        long otherUserId = 2L;
        String newEmail = "zajety.email@example.com";
        User otherUser = mock(User.class);

        when(otherUser.getId()).thenReturn(otherUserId);
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(otherUser));

        // WHEN & THEN
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            changeUserEmailUseCase.execute(currentUserId, newEmail);
        });

        assertThat(exception.getMessage()).isEqualTo("Email " + newEmail + " is already taken.");
    }

    @Test
    void shouldNotThrowException_whenEmailBelongsToSameUser() {
        // GIVEN
        long userId = 1L;
        String newEmail = "stary.email@example.com";
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);

        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(user));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // WHEN
        changeUserEmailUseCase.execute(userId, newEmail);

        // THEN
        verify(user).changeEmail(any(Email.class));
    }
}