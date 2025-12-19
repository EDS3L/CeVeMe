package pl.ceveme.application.usecase.employmentInfo.skill;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.skill.SkillRequest;
import pl.ceveme.application.dto.entity.skill.SkillResponse;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.SkillRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateSkillUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private CreateSkillUseCase useCase;


    @Test
    void should_addSkillToUser_when_ValuesAreCorrect() {
        // given
        Long userId = 1L;
        String skillName = "Java";

        User user = new User();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        SkillRequest request = new SkillRequest(1L, skillName, Skill.Type.TECHNICAL, userId);

        // when

        SkillResponse response = useCase.execute(request, userId);

        // then

        verify(skillRepository).save(any());

        assertEquals(skillName, response.name());
        assertEquals("Addition of skill successfully completed", response.message());
    }

    @Test
    void should_ThrowException_when_userNotFound() {
        // given
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        SkillRequest request = new SkillRequest(1L, "java", Skill.Type.TECHNICAL, userId);

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            useCase.execute(request, userId);
        });

        assertEquals("User not found", exception.getMessage());
        verify(skillRepository, never()).save(any());
    }

}