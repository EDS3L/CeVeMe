package pl.ceveme.application.usecase.employmentInfo.link;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
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
class DeleteLinkUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DeleteLinkUseCase deleteLinkUseCase;

    @Test
    void should_deleteLink_when_exists() throws AccessDeniedException {
        // given
        Long linkId = 123L;
        Long userId = 1L;
        Link link = createLinkWithId(linkId, "To delete", "Url");

        EmploymentInfo info = new EmploymentInfo();
        info.addLink(link);
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        LinkResponse response = deleteLinkUseCase.execute(new DeleteEntityRequest(linkId), userId);

        // then
        assertThat(response.title()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("Link deleted successfully");
    }

    @Test
    void should_throwException_when_linkNotFound() {
        // given
        Long linkId = 999L;
        Long userId = 1L;
        EmploymentInfo info = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteLinkUseCase.execute(new DeleteEntityRequest(linkId), userId));

        assertThat(ex.getMessage()).isEqualTo("Link not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long linkId = 999L;
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteLinkUseCase.execute(new DeleteEntityRequest(linkId), userId));

        assertThat(ex.getMessage()).isEqualTo("User with id " + userId + " not found");
    }

    // helper for test
    private Link createLinkWithId(Long id, String name, String url) {
        Link link = new Link(name, url);
        try {
            java.lang.reflect.Field field = Link.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(link, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return link;
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
