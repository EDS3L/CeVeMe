package pl.ceveme.application.usecase.employmentInfo.portfolio;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

@Service
public class EditPortfolioItemUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditPortfolioItemUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public PortfolioItemsResponse execute(PortfolioItemsRequest request, Long employmentInfoId) {
        EmploymentInfo info = employmentInfoRepository.findById(employmentInfoId)
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        PortfolioItem portfolioItem = info.getPortfolioItemById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("PortfolioItem not found"));

        portfolioItem.update(
                request.title(),
                request.description()
        );

        return new PortfolioItemsResponse(
                request.title(),
                request.description(),
                "PortfolioItem updated successfully"
        );
    }
}
