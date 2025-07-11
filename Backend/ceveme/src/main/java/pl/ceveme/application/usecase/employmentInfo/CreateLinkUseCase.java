package pl.ceveme.application.usecase.employmentInfo;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.link.LinkRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.domain.model.entities.Link;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateLinkUseCase {

    private final UserRepository userRepository;

    public CreateLinkUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public LinkResponse execute(LinkRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.addLinks(new Link(request.title(), request.link()));

        userRepository.save(user);

        return new LinkResponse(request.title(), request.link(), "Addition of link successfully completed");

    }
}
