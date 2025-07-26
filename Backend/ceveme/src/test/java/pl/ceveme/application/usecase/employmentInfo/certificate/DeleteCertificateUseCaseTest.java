package pl.ceveme.application.usecase.employmentInfo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.application.usecase.employmentInfo.certificate.DeleteCertificateUseCase;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeleteCertificateUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private DeleteCertificateUseCase deleteCertificateUseCase;

    @Test
    void should_deleteCertificate_when_exists() {
        // given
        Long certId = 123L;
        Long infoId = 1L;
        Certificate certificate = createCertificateWithId(certId, "To delete", LocalDate.now().minusYears(1));

        EmploymentInfo info = new EmploymentInfo();
        info.addCertificate(certificate);

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when
        CertificateResponse response = deleteCertificateUseCase.execute(new DeleteEntityRequest(certId, infoId));

        // then
        assertThat(response.name()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("Certificate deleted successfully");
    }

    @Test
    void should_throwException_when_certificateNotFound() {
        // given
        Long certId = 999L;
        Long infoId = 1L;
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteCertificateUseCase.execute(new DeleteEntityRequest(certId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("Certificate not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long certId = 999L;
        Long infoId = 1L;
        when(employmentInfoRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteCertificateUseCase.execute(new DeleteEntityRequest(certId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }

    // helper for test
    private Certificate createCertificateWithId(Long id, String name, LocalDate date) {
        Certificate cert = new Certificate(name, date);
        try {
            java.lang.reflect.Field field = Certificate.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(cert, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return cert;
    }
}
