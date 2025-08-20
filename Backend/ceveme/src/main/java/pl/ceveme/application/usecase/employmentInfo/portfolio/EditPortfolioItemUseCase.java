package pl.ceveme.application.usecase.employmentInfo.portfolio;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditPortfolioItemUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditPortfolioItemUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public PortfolioItemsResponse execute(PortfolioItemsRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

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
