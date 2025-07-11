package pl.ceveme.application.usecase.employmentInfo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.link.LinkRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Link;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateLinkUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private CreateLinkUseCase useCase;

    @Test
    void should_addLinkToEmploymentInfo_when_ValuesAreCorrect() {
        // given
        String email = "test@example.com";
        String title = "GitHub";
        String linkUrl = "https://github.com/user";

        User user = mock(User.class);

        when(userRepository.findByEmail(new Email(email))).thenReturn(Optional.of(user));

        LinkRequest request = new LinkRequest(email, title, linkUrl);

        // when
        LinkResponse response = useCase.execute(request);

        // then

        assertEquals(title, response.title());
        assertEquals(linkUrl, response.link());
        assertEquals("Addition of link successfully completed", response.message());
    }

    @Test
    void should_ThrowException_when_userNotFound() {
        // given
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(new Email(email))).thenReturn(Optional.empty());

        LinkRequest request = new LinkRequest(email, "title", "https://example.com");

        // when & then
        assertThrows(RuntimeException.class, () -> useCase.execute(request));
        verify(employmentInfoRepository, never()).save(any());
    }
}
