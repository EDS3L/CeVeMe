package pl.ceveme.application.usecase.employmentInfo.portfolio;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
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
class EditPortfolioItemUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EditPortfolioItemUseCase editPortfolioItemUseCase;

    @Test
    void should_editPortfolioItem_when_portfolioItemExists() throws AccessDeniedException {
        // given
        Long userId = 1L;
        Long portfolioItemId = 10L;
        PortfolioItem portfolioItem = new PortfolioItem("Old Title", "Old Description", "https://old.com");
        try {
            java.lang.reflect.Field field = PortfolioItem.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(portfolioItem, portfolioItemId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        PortfolioItemsRequest request = new PortfolioItemsRequest(portfolioItemId, "Updated Title", "Updated Description", "https://updated.com", userId);
        EmploymentInfo info = new EmploymentInfo();
        info.addPortfolioItem(portfolioItem);
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        PortfolioItemsResponse response = editPortfolioItemUseCase.execute(request, userId);

        // then
        assertThat(response.title()).isEqualTo("Updated Title");
        assertThat(response.message()).isEqualTo("PortfolioItem updated successfully");
    }

    @Test
    void should_throwException_when_portfolioItemNotFound() {
        // given
        Long userId = 1L;
        PortfolioItemsRequest request = new PortfolioItemsRequest(99L, "Title", "Description", "https://example.com", userId);
        EmploymentInfo info = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editPortfolioItemUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("PortfolioItem not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long userId = 999L;
        PortfolioItemsRequest request = new PortfolioItemsRequest(1L, "Any", "Any", "https://example.com", userId);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editPortfolioItemUseCase.execute(request, userId));

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
