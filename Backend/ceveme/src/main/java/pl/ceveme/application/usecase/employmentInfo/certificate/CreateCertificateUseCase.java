package pl.ceveme.application.usecase.employmentInfo.certificate;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.CertificateRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateCertificateUseCase {

    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;

    public CreateCertificateUseCase(UserRepository userRepository, CertificateRepository certificateRepository) {
        this.userRepository = userRepository;
        this.certificateRepository = certificateRepository;
    }

    @Transactional
    public CertificateResponse execute(CertificateRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Certificate certificate = new Certificate(request.name(), request.dateOfCertificate());

        user.addCertificate(certificate);

        certificateRepository.save(certificate);

        return new CertificateResponse(certificate.getId(),request.name(), request.dateOfCertificate(), "Addition of certification successfully completed");

    }
}
