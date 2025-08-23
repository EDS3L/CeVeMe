package pl.ceveme.application.usecase.employmentInfo.certificate;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditCertificateUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditCertificateUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public CertificateResponse execute(CertificateRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Certificate certificate = info.getCertificateById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));

        certificate.update(request.name(), request.dateOfCertificate());

        return new CertificateResponse(certificate.getId(),request.name(), request.dateOfCertificate(), "Certificate updated successfully");
    }
}
