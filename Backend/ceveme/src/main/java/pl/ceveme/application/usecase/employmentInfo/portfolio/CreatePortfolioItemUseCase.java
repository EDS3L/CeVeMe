package pl.ceveme.application.usecase.employmentInfo.portfolio;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreatePortfolioItemUseCase {

    private final UserRepository userRepository;

    public CreatePortfolioItemUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public PortfolioItemsResponse execute(PortfolioItemsRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.addPortfolioItems(new PortfolioItem(request.title(),request.description()));

        userRepository.save(user);

        return new PortfolioItemsResponse(request.title(), request.description(), "Addition of portfolio successfully completed");
    }
}
