package pl.ceveme.application.usecase.employmentInfo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.language.LanguageRequest;
import pl.ceveme.application.dto.language.LanguageResponse;
import pl.ceveme.application.dto.skill.SkillRequest;
import pl.ceveme.application.dto.skill.SkillResponse;
import pl.ceveme.domain.model.entities.Skill;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateSkillUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CreateSkillUseCase useCase;


    @Test
    void should_addSkillToUser_when_ValuesAreCorrect() {
        // given
        String email = "test@wp.pl";
        String skillName = "Java";

        User user = new User();
        when(userRepository.findByEmail(new Email(email))).thenReturn(Optional.of(user));

        SkillRequest request = new SkillRequest(email,skillName, Skill.Type.TECHNICAL);

        // when

        SkillResponse response = useCase.execute(request);

        // then

        verify(userRepository).save(user);

        assertEquals(skillName, response.name());
        assertEquals("Addition of skill successfully completed", response.message());
    }

    @Test
    void should_ThrowException_when_userNotFound() {
        // given
        String email = "test@wp.pl";
        when(userRepository.findByEmail(new Email(email))).thenReturn(Optional.empty());

        SkillRequest request = new SkillRequest(email,"java", Skill.Type.TECHNICAL);

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            useCase.execute(request);
        });

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

}