package pl.ceveme.application.usecase.employmentInfo.link;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.link.LinkRequest;
import pl.ceveme.application.dto.entity.link.LinkResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.Link;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditLinkUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditLinkUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public LinkResponse execute(LinkRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }


        Link link = info.getLinkById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Link not found"));

        link.update(
                request.title(),
                request.link()
        );

        return new LinkResponse(
                link.getId(),
                request.title(),
                request.link(),
                "Link updated successfully"
        );
    }
}
