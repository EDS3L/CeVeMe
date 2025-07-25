package pl.ceveme.application.usecase.employmentInfo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreatePortfolioItemUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private CreatePortfolioItemUseCase useCase;

    @Test
    void should_addPortfolioItemToEmploymentInfo_when_ValuesAreCorrect() {
        // given
        String email = "test@example.com";
        String title = "My Project";
        String description = "Project Description";

        User user = mock(User.class);

        when(userRepository.findByEmail(new Email(email))).thenReturn(Optional.of(user));

        PortfolioItemsRequest request = new PortfolioItemsRequest(1L,email, title, description);

        // when
        PortfolioItemsResponse response = useCase.execute(request);

        // then

        assertEquals(title, response.title());
        assertEquals(description, response.description());
        assertEquals("Addition of portfolio successfully completed", response.message());
    }

    @Test
    void should_ThrowException_when_userNotFound() {
        // given
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(new Email(email))).thenReturn(Optional.empty());

        PortfolioItemsRequest request = new PortfolioItemsRequest(1L,email, "title", "desc");

        // when & then
        assertThrows(RuntimeException.class, () -> useCase.execute(request));
        verify(employmentInfoRepository, never()).save(any());
    }
}
