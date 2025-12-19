package pl.ceveme.application.usecase.employmentInfo.portfolio;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsRequest;
import pl.ceveme.application.dto.entity.portfolioItems.PortfolioItemsResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.PortfolioItem;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditPortfolioItemUseCase {

    private final UserRepository userRepository;

    public EditPortfolioItemUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public PortfolioItemsResponse execute(PortfolioItemsRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EmploymentInfo info = user.getEmploymentInfo();

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        PortfolioItem portfolioItem = info.getPortfolioItemById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("PortfolioItem not found"));

        portfolioItem.update(
                request.title(),
                request.description(),
                request.url()
        );

        return new PortfolioItemsResponse(
                portfolioItem.getId(),
                request.title(),
                request.description(),
                "PortfolioItem updated successfully"
        );
    }
}
