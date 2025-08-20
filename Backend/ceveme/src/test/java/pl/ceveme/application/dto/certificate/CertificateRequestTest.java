package pl.ceveme.application.dto.certificate;

import org.junit.jupiter.api.Test;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.domain.model.vo.Email;

import java.time.LocalDate;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CertificateRequestTest {

    @Test
    void should_throwIllegalArgumentException_when_certificateIsNull() {
        // given
        LocalDate date = LocalDate.of(2003, 1, 12);
        Email email = new Email("test@wp.pl");

        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new CertificateRequest(1L,email.email(), "", date,1L));
        assertThat(ex.getMessage()).isEqualTo("Name of certificate is null!");

    }

    @Test
    void should_throwIllegalArgumentException_when_dateIsNull() {
        // given
        Email email = new Email("test@wp.pl");

        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new CertificateRequest(1L,email.email(), "java8", null,1L));
        assertThat(ex.getMessage()).isEqualTo("Date of certificate is null");

    }

    @Test
    void should_throwIllegalArgumentException_when_dateIsAfterCurretDate() {
        // given
        Email email = new Email("test@wp.pl");
        LocalDate date = LocalDate.of(2103, 1, 12);

        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new CertificateRequest(1L,email.email(), "java8", date,1L));
        assertThat(ex.getMessage()).isEqualTo("Date cannot be after " + LocalDate.now());

    }

}