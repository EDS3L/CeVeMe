package pl.ceveme.application.usecase.employmentInfo.certificate;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditCertificateUseCase {

    private final UserRepository userRepository;

    public EditCertificateUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public CertificateResponse execute(CertificateRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EmploymentInfo info = user.getEmploymentInfo();
        if (info.getUser()
                .getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Certificate certificate = info.getCertificateById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));

        certificate.update(request.name(), request.dateOfCertificate());

        return new CertificateResponse(certificate.getId(), request.name(), request.dateOfCertificate(), "Certificate updated successfully");
    }
}
