package pl.ceveme.application.usecase.employmentInfo.certificate;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

@Service
public class DeleteCertificateUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeleteCertificateUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public CertificateResponse execute(Long certificateId, Long employmentInfoId) {
        EmploymentInfo info = employmentInfoRepository.findById(employmentInfoId)
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        Certificate certificate = info.getCertificateById(certificateId)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));

        info.removeCertificate(certificate);

        return new CertificateResponse(
                certificate.getName(),
                certificate.getDateOfCertificate(),
                "Certificate deleted successfully"
        );
    }
}
