package pl.ceveme.application.usecase.employmentInfo.link;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Link;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteLinkUseCase {

    private final UserRepository userRepository;

    public DeleteLinkUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public LinkResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        EmploymentInfo info = user.getEmploymentInfo();

        if (info.getUser()
                .getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Link link = info.getLinkById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Link not found"));

        info.removeLink(link);

        return new LinkResponse(link.getId(),link.getTitle(), link.getLink(), "Link deleted successfully");
    }
}
