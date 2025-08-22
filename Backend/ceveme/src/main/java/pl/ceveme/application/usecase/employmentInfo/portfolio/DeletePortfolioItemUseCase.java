package pl.ceveme.application.usecase.employmentInfo.portfolio;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeletePortfolioItemUseCase {

    private final UserRepository userRepository;

    public DeletePortfolioItemUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public PortfolioItemsResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        EmploymentInfo info = user.getEmploymentInfo();

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        PortfolioItem portfolioItem = info.getPortfolioItemById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("PortfolioItem not found"));

        info.removePortfolioItem(portfolioItem);

        return new PortfolioItemsResponse(
                portfolioItem.getId(),
                portfolioItem.getTitle(),
                portfolioItem.getDescription(),
                "PortfolioItem deleted successfully"
        );
    }
}
