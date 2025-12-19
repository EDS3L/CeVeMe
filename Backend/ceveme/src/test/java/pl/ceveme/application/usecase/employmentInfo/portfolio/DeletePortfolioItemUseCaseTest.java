package pl.ceveme.application.usecase.employmentInfo.portfolio;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;

import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeletePortfolioItemUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DeletePortfolioItemUseCase deletePortfolioItemUseCase;

    @Test
    void should_deletePortfolioItem_when_exists() throws AccessDeniedException {
        // given
        Long portfolioItemId = 123L;
        Long userId = 1L;
        PortfolioItem portfolioItem = createPortfolioItemWithId(portfolioItemId,"To delete", "Description" );

        EmploymentInfo info = new EmploymentInfo();
        info.addPortfolioItem(portfolioItem);
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        PortfolioItemsResponse response = deletePortfolioItemUseCase.execute(new DeleteEntityRequest(portfolioItemId), userId);

        // then
        assertThat(response.title()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("PortfolioItem deleted successfully");
    }

    @Test
    void should_throwException_when_portfolioItemNotFound() {
        // given
        Long portfolioItemId = 999L;
        Long userId = 1L;
        EmploymentInfo info = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deletePortfolioItemUseCase.execute(new DeleteEntityRequest(portfolioItemId), userId));

        assertThat(ex.getMessage()).isEqualTo("PortfolioItem not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long portfolioItemId = 999L;
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deletePortfolioItemUseCase.execute(new DeleteEntityRequest(portfolioItemId), userId));

        assertThat(ex.getMessage()).isEqualTo("User with id " + userId + " not found");
    }

    // helper for test
    private PortfolioItem createPortfolioItemWithId(Long id, String title, String description) {
        PortfolioItem portfolioItem = new PortfolioItem(title, description, null);
        try {
            java.lang.reflect.Field field = PortfolioItem.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(portfolioItem, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return portfolioItem;
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
