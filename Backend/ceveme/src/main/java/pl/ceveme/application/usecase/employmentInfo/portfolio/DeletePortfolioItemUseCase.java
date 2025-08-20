package pl.ceveme.application.usecase.employmentInfo.portfolio;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeletePortfolioItemUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeletePortfolioItemUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public PortfolioItemsResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

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
