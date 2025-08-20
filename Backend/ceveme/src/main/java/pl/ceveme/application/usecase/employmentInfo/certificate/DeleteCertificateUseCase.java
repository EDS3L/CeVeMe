package pl.ceveme.application.usecase.employmentInfo.certificate;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteCertificateUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeleteCertificateUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public CertificateResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Certificate certificate = info.getCertificateById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found"));

        info.removeCertificate(certificate);

        return new CertificateResponse(
                certificate.getName(),
                certificate.getDateOfCertificate(),
                "Certificate deleted successfully"
        );
    }
}
