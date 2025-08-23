package pl.ceveme.application.dto.employmentInfo;

import java.time.LocalDate;
import java.util.Date;

public record CertificateDto(
        Long id,
        String name,
        LocalDate dateOfCertificate
) {
}