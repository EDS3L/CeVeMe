package pl.ceveme.application.dto.certificate;

import java.util.Date;

public record CertificateRequest(String email,String name, Date dateOfCertificate) {

    public CertificateRequest {
        validate(name,dateOfCertificate);
    }

    private static void validate(String name, Date dateOfCertificate) {
        if (name == null || name
                .isBlank()) throw new IllegalArgumentException("Name of certificate is null!");
        if (dateOfCertificate == null) throw new IllegalArgumentException("Date of certificate is null");
        if (dateOfCertificate
                .after(new Date())) throw new IllegalArgumentException("Date cannot be after " + new Date());
    }
}
