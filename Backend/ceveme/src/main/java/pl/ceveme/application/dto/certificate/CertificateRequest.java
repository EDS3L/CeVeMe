package pl.ceveme.application.dto.certificate;

import java.util.Date;

public record CertificateRequest(String email,String name, Date dateOfCertificate) {
}
