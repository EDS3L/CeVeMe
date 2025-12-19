package pl.ceveme.application.usecase.employmentInfo.portfolio;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.PortfolioItemRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreatePortfolioItemUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PortfolioItemRepository portfolioItemRepository;

    @InjectMocks
    private CreatePortfolioItemUseCase useCase;

    @Test
    void should_addPortfolioItemToEmploymentInfo_when_ValuesAreCorrect() {
        // given
        Long userId = 1L;
        String title = "My Project";
        String description = "Project Description";
        String url = "https://example.com";

        User user = mock(User.class);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        PortfolioItemsRequest request = new PortfolioItemsRequest(1L, title, description, url, userId);

        // when
        PortfolioItemsResponse response = useCase.execute(request, userId);

        // then

        assertEquals(title, response.title());
        assertEquals(description, response.description());
        assertEquals("Addition of portfolio item successfully completed", response.message());
    }

    @Test
    void should_ThrowException_when_userNotFound() {
        // given
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        PortfolioItemsRequest request = new PortfolioItemsRequest(1L, "title", "desc", "https://example.com", userId);

        // when & then
        assertThrows(RuntimeException.class, () -> useCase.execute(request, userId));
        verify(portfolioItemRepository, never()).save(any());
    }
}
