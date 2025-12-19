package pl.ceveme.application.usecase.employmentInfo.experience;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.experience.ExperienceRequest;
import pl.ceveme.application.dto.entity.experience.ExperienceResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.ExperienceRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateExperienceUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ExperienceRepository experienceRepository;

    @InjectMocks
    private CreateExperienceUseCase useCase;

    @Test
    void should_createExperience_when_valuesAreCorrect() {
        // given
        User user = new User();
        Long userId = 1L;

        ExperienceRequest request = new ExperienceRequest(
                1L,
                "Sweet gallery",
                LocalDate.of(2023,1,1),
                LocalDate.of(2024,1,1),
                false,
                "Java Developer",
                "backend",
                "30% crm",
                userId
        );

        // when
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        ExperienceResponse response = useCase.execute(request, userId);

        // then

        assertEquals("Sweet gallery", response.companyName());
        assertEquals("Java Developer", response.positionName());
        assertEquals("Addition of experience successfully completed", response.message());

        verify(experienceRepository).save(any());


    }


    @Test
    void should_throw_when_userNotFound() {
        // given
        Long userId = 1L;

        ExperienceRequest request = new ExperienceRequest(
                1L,
                "Sweet gallery",
                LocalDate.of(2023,1,1),
                LocalDate.of(2024,1,1),
                false,
                "Java Developer",
                "backend",
                "30% crm",
                userId
        );
        // when
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // then
        assertThrows(IllegalArgumentException.class, () -> useCase.execute(request, userId));
        verify(experienceRepository, never()).save(any());


    }

}