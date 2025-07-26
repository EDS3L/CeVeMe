package pl.ceveme.application.usecase.employmentInfo.portfolio;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

@Service
public class DeletePortfolioItemUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeletePortfolioItemUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public PortfolioItemsResponse execute(DeleteEntityRequest request) {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        PortfolioItem portfolioItem = info.getPortfolioItemById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("PortfolioItem not found"));

        info.removePortfolioItem(portfolioItem);

        return new PortfolioItemsResponse(
                portfolioItem.getTitle(),
                portfolioItem.getDescription(),
                "PortfolioItem deleted successfully"
        );
    }
}
