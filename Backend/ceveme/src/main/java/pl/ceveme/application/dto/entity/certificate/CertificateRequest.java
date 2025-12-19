package pl.ceveme.application.dto.entity.certificate;

import java.time.LocalDate;
import java.util.Date;

public record CertificateRequest(Long id,String name, LocalDate dateOfCertificate, Long userId) {

    public CertificateRequest {
        validate(name,dateOfCertificate);
    }

    private static void validate(String name, LocalDate dateOfCertificate) {
        if (name == null || name
                .isBlank()) throw new IllegalArgumentException("Name of certificate is null!");
        if (dateOfCertificate == null) throw new IllegalArgumentException("Date of certificate is null");
        if (dateOfCertificate
                .isAfter(LocalDate.now())) throw new IllegalArgumentException("Date cannot be after " + LocalDate.now());
    }
}
