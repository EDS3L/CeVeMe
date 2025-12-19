package pl.ceveme.application.usecase.employmentInfo.link;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.link.LinkRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Link;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditLinkUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EditLinkUseCase editLinkUseCase;

    @Test
    void should_editLink_when_linkExists() throws AccessDeniedException {
        // given
        Long userId = 1L;
        Long linkId = 10L;
        Link link = new Link("Old Name", "Old Url");
        try {
            java.lang.reflect.Field field = Link.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(link, linkId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        LinkRequest request = new LinkRequest(linkId, "Updated Name", "Updated Url", userId);
        EmploymentInfo info = new EmploymentInfo();
        info.addLink(link);
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        LinkResponse response = editLinkUseCase.execute(request, userId);

        // then
        assertThat(response.title()).isEqualTo("Updated Name");
        assertThat(response.message()).isEqualTo("Link updated successfully");
    }

    @Test
    void should_throwException_when_linkNotFound() {
        // given
        Long userId = 1L;
        LinkRequest request = new LinkRequest(99L, "Name", "Url", userId);
        EmploymentInfo info = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editLinkUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("Link not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long userId = 999L;
        LinkRequest request = new LinkRequest(1L, "Any", "Any", userId);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editLinkUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("User not found");
    }

    private void setUserId(User user, Long id) {
        try {
            java.lang.reflect.Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
