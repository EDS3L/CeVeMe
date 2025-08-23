package pl.ceveme.application.usecase.employmentInfo.link;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.link.LinkRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.domain.model.entities.Link;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.LinkRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateLinkUseCase {

    private final UserRepository userRepository;
    private final LinkRepository linkRepository;


    public CreateLinkUseCase(UserRepository userRepository, LinkRepository linkRepository) {
        this.userRepository = userRepository;
        this.linkRepository = linkRepository;
    }

    @Transactional
    public LinkResponse execute(LinkRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Link link = new Link(request.title(), request.link());

        user.addLinks(link);

        linkRepository.save(link);

        return new LinkResponse(link.getId(), request.title(), request.link(), "Addition of link successfully completed");
    }
}