package pl.ceveme.application.dto.entity.certificate;


import java.time.LocalDate;
import java.util.Date;

public record CertificateResponse(Long itemId, String name, LocalDate dateOfCertificate, String message) {
}
