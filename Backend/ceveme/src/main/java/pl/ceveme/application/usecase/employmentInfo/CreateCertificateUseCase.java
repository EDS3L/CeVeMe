package pl.ceveme.application.usecase.employmentInfo;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.certificate.CertificateRequest;
import pl.ceveme.application.dto.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

import java.util.Date;

@Service
public class CreateCertificateUseCase {

    private final UserRepository userRepository;

    public CreateCertificateUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public CertificateResponse execute(CertificateRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.addCertificate(new Certificate(request.name(), request.dateOfCertificate()));

        userRepository.save(user);

        return new CertificateResponse(request.name(), request.dateOfCertificate(), "Addition of certification successfully completed");

    }
}
