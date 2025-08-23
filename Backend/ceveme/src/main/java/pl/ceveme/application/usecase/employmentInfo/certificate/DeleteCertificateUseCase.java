package pl.ceveme.application.usecase.employmentInfo.certificate;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteCertificateUseCase {

    private final UserRepository userRepository;

    public DeleteCertificateUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public CertificateResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        EmploymentInfo info = user.getEmploymentInfo();

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Certificate certificate = info.getCertificateById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));

        info.removeCertificate(certificate);

        return new CertificateResponse(
                certificate.getId(),
                certificate.getName(),
                certificate.getDateOfCertificate(),
                "Certificate deleted successfully"
        );
    }
}
