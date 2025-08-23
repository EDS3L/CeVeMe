package pl.ceveme.application.usecase.employmentInfo.portfolio;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.PortfolioItemRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreatePortfolioItemUseCase {

    private final UserRepository userRepository;
    private final PortfolioItemRepository portfolioItemRepository;

    public CreatePortfolioItemUseCase(UserRepository userRepository, PortfolioItemRepository portfolioItemRepository) {
        this.userRepository = userRepository;
        this.portfolioItemRepository = portfolioItemRepository;
    }

    @Transactional
    public PortfolioItemsResponse execute(PortfolioItemsRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        PortfolioItem portfolioItem = new PortfolioItem(request.title(), request.description());

        user.addPortfolioItems(portfolioItem);

        portfolioItemRepository.save(portfolioItem);

        return new PortfolioItemsResponse(portfolioItem.getId(), request.title(), request.description(), "Addition of portfolio item successfully completed");
    }
}