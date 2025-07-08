package pl.ceveme.application.dto.certificate;


import java.time.LocalDate;
import java.util.Date;

public record CertificateResponse(String name, LocalDate dateOfCertificate, String message) {
}
