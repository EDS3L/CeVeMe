package pl.ceveme.application.usecase.employmentInfo.certificate;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.CertificateRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class CreateCertificateUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CertificateRepository certificateRepository;

    @InjectMocks
    private CreateCertificateUseCase createCertificateUseCase;


    @Test
    void should_createCertificate_when_valueIsCorrect() {
        // given
        Calendar calendar = Calendar.getInstance();
        calendar.set(2003,Calendar.JANUARY, 12);
        LocalDate date = LocalDate.now();
        Long userId = 1L;

        EmploymentInfo employmentInfo = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(employmentInfo);
        CertificateRequest request = new CertificateRequest(1L, "java8", date, userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when

        CertificateResponse response = createCertificateUseCase.execute(request, userId);

        // then

        assertThat(response).isNotNull();
        assertThat(response.name()).isNotNull();
        assertThat(response.message()).isEqualTo("Addition of certification successfully completed");

        verify(certificateRepository).save(any());

    }

    @Test
    void should_throwIllegalArgumentException_when_userIsNull() {
        // given
        Calendar calendar = Calendar.getInstance();
        calendar.set(2003,Calendar.JANUARY, 12);
        LocalDate date = LocalDate.now();
        Long userId = 1L;

        EmploymentInfo employmentInfo = new EmploymentInfo();
        User user = new User();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        user.setEmploymentInfo(employmentInfo);
        CertificateRequest request = new CertificateRequest(1L, "Java8", date, userId);


        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> createCertificateUseCase.execute(request, userId));
        assertThat(ex.getMessage()).isEqualTo("User not found");

    }



}