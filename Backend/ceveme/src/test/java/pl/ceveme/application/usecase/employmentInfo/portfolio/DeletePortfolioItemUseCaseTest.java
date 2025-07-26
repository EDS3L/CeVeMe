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
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeletePortfolioItemUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private DeletePortfolioItemUseCase deletePortfolioItemUseCase;

    @Test
    void should_deletePortfolioItem_when_exists() {
        // given
        Long portfolioItemId = 123L;
        Long infoId = 1L;
        PortfolioItem portfolioItem = createPortfolioItemWithId(portfolioItemId,"To delete", "Description" );

        EmploymentInfo info = new EmploymentInfo();
        info.addPortfolioItem(portfolioItem);

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when
        PortfolioItemsResponse response = deletePortfolioItemUseCase.execute(new DeleteEntityRequest(portfolioItemId, infoId));

        // then
        assertThat(response.title()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("PortfolioItem deleted successfully");
    }

    @Test
    void should_throwException_when_portfolioItemNotFound() {
        // given
        Long portfolioItemId = 999L;
        Long infoId = 1L;
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deletePortfolioItemUseCase.execute(new DeleteEntityRequest(portfolioItemId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("PortfolioItem not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long portfolioItemId = 999L;
        Long infoId = 1L;
        when(employmentInfoRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deletePortfolioItemUseCase.execute(new DeleteEntityRequest(portfolioItemId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }

    // helper for test
    private PortfolioItem createPortfolioItemWithId(Long id, String title, String description) {
        PortfolioItem portfolioItem = new PortfolioItem(title, description);
        try {
            java.lang.reflect.Field field = PortfolioItem.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(portfolioItem, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return portfolioItem;
    }
}
