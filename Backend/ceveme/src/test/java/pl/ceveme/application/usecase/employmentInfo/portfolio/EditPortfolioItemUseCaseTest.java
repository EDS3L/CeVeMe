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
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditPortfolioItemUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private EditPortfolioItemUseCase editPortfolioItemUseCase;

    @Test
    void should_editPortfolioItem_when_portfolioItemExists() {
        // given
        Long employmentInfoId = 1L;
        Long portfolioItemId = 10L;
        PortfolioItem portfolioItem = new PortfolioItem("Old Title", "Old Description");
        try {
            java.lang.reflect.Field field = PortfolioItem.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(portfolioItem, portfolioItemId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        PortfolioItemsRequest request = new PortfolioItemsRequest(portfolioItemId, "test@wp.pl", "Updated Title", "Updated Description");
        EmploymentInfo info = new EmploymentInfo();
        info.addPortfolioItem(portfolioItem);

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when
        PortfolioItemsResponse response = editPortfolioItemUseCase.execute(request, employmentInfoId);

        // then
        assertThat(response.title()).isEqualTo("Updated Title");
        assertThat(response.message()).isEqualTo("PortfolioItem updated successfully");
    }

    @Test
    void should_throwException_when_portfolioItemNotFound() {
        // given
        Long employmentInfoId = 1L;
        PortfolioItemsRequest request = new PortfolioItemsRequest(99L, "test@wp.pl", "Title", "Description");
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editPortfolioItemUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("PortfolioItem not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long employmentInfoId = 999L;
        PortfolioItemsRequest request = new PortfolioItemsRequest(1L, "test@wp.pl", "Any", "Any");

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editPortfolioItemUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }
}
