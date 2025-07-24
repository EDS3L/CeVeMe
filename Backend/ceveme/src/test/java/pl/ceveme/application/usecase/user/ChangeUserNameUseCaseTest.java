package pl.ceveme.application.usecase.user;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.user.UpdateUserResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Name;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChangeUserNameUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ChangeUserNameUseCase changeUserNameUseCase;

    @Test
    void shouldChangeUserName_whenUserExists() {
        // GIVEN
        long userId = 1L;
        String newName = "Jan";
        User user = mock(User.class);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // WHEN
        UpdateUserResponse response = changeUserNameUseCase.execute(userId, newName);

        // THEN
        ArgumentCaptor<Name> nameCaptor = ArgumentCaptor.forClass(Name.class);
        verify(user).changeName(nameCaptor.capture());

        assertThat(nameCaptor.getValue().name()).isEqualTo(newName);
        assertThat(response.message()).isEqualTo("User name changed successfully");
        assertThat(response.data()).isEqualTo(newName);
    }

    @Test
    void shouldThrowException_whenUserNotFound() {
        // GIVEN
        long userId = 99L;
        String newName = "Jan";
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // WHEN & THEN
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            changeUserNameUseCase.execute(userId, newName);
        });

        assertThat(exception.getMessage()).isEqualTo("User with id " + userId + " not found");
        verify(userRepository, never()).save(any());
    }
}