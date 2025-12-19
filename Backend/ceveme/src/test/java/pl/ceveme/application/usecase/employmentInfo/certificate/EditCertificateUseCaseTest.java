package pl.ceveme.application.usecase.employmentInfo.certificate;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.Certificate;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EditCertificateUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EditCertificateUseCase editCertificateUseCase;

    @Test
    void should_editCertificate_when_certificateExists() throws AccessDeniedException {
        // given
        Long userId = 1L;
        Long certId = 10L;
        Certificate certificate = new Certificate("Old Name", LocalDate.now().minusYears(1));
        certificate.setId(certId);

        CertificateRequest request = new CertificateRequest(certId, "Updated Name", LocalDate.now(), userId);
        EmploymentInfo info = new EmploymentInfo();
        info.addCertificate(certificate);
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        CertificateResponse response = editCertificateUseCase.execute(request, userId);

        // then
        assertThat(response.name()).isEqualTo("Updated Name");
        assertThat(response.message()).isEqualTo("Certificate updated successfully");
    }

    @Test
    void should_throwException_when_certificateNotFound() {
        // given
        Long userId = 1L;
        CertificateRequest request = new CertificateRequest(99L, "Name", LocalDate.now(), userId);
        EmploymentInfo info = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(info);
        info.setUser(user);
        setUserId(user, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editCertificateUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("Certificate not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long userId = 999L;
        CertificateRequest request = new CertificateRequest(1L, "Any", LocalDate.now(), userId);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editCertificateUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("User not found");
    }

    private void setUserId(User user, Long id) {
        try {
            java.lang.reflect.Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
