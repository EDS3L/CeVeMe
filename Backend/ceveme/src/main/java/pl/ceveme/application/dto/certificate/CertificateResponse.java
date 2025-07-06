package pl.ceveme.application.dto.certificate;


import java.util.Date;

public record CertificateResponse(String name, Date dateOfCertificate, String message) {
}
