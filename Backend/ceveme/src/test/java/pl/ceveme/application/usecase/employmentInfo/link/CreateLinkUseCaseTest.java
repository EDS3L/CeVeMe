package pl.ceveme.application.usecase.employmentInfo.link;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.link.LinkRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.LinkRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateLinkUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private LinkRepository linkRepository;

    @InjectMocks
    private CreateLinkUseCase useCase;

    @Test
    void should_addLinkToEmploymentInfo_when_ValuesAreCorrect() {
        // given
        Long userId = 1L;
        String title = "GitHub";
        String linkUrl = "https://github.com/user";

        User user = mock(User.class);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        LinkRequest request = new LinkRequest(1L, title, linkUrl, userId);

        // when
        LinkResponse response = useCase.execute(request, userId);

        // then

        assertEquals(title, response.title());
        assertEquals(linkUrl, response.link());
        assertEquals("Addition of link successfully completed", response.message());
    }

    @Test
    void should_ThrowException_when_userNotFound() {
        // given
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        LinkRequest request = new LinkRequest(1L, "title", "https://example.com", userId);

        // when & then
        assertThrows(RuntimeException.class, () -> useCase.execute(request, userId));
        verify(linkRepository, never()).save(any());
    }
}
