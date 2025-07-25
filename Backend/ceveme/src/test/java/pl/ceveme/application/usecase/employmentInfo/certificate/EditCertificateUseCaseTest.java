package pl.ceveme.application.usecase.employmentInfo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.application.usecase.employmentInfo.certificate.EditCertificateUseCase;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EditCertificateUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private EditCertificateUseCase editCertificateUseCase;

    @Test
    void should_editCertificate_when_certificateExists() {
        // given
        Long employmentInfoId = 1L;
        Long certId = 10L;
        Certificate certificate = new Certificate("Old Name", LocalDate.now().minusYears(1));
        certificate.setId(certId);

        CertificateRequest request = new CertificateRequest(certId,"test@wp.pl", "Updated Name", LocalDate.now());
        EmploymentInfo info = new EmploymentInfo();
        info.addCertificate(certificate);

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when
        CertificateResponse response = editCertificateUseCase.execute(request, employmentInfoId);

        // then
        assertThat(response.name()).isEqualTo("Updated Name");
        assertThat(response.message()).isEqualTo("Certificate updated successfully");
    }

    @Test
    void should_throwException_when_certificateNotFound() {
        // given
        Long employmentInfoId = 1L;
        CertificateRequest request = new CertificateRequest(99L, "test@wp.pl","Name", LocalDate.now());
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editCertificateUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("Certificate not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long employmentInfoId = 999L;
        CertificateRequest request = new CertificateRequest(1L, "test@wp.pl","Any", LocalDate.now());

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editCertificateUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }
}
