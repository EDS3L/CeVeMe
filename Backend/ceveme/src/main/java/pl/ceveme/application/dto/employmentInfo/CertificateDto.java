package pl.ceveme.application.dto.employmentInfo;

import java.time.LocalDate;
import java.util.Date;

public record CertificateDto(
        String name,
        LocalDate dateOfCertificate
) {
}