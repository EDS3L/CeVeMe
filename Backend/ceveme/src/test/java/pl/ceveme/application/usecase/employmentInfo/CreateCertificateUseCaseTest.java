package pl.ceveme.application.usecase.employmentInfo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.certificate.CertificateRequest;
import pl.ceveme.application.dto.entity.certificate.CertificateResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreateCertificateUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CreateCertificateUseCase createCertificateUseCase;


    @Test
    void should_createCertificate_when_valueIsCorrect() {
        // given
        Calendar calendar = Calendar.getInstance();
        calendar.set(2003,Calendar.JANUARY, 12);
        LocalDate date = LocalDate.now();
        Email email = new Email("test@wp.pl");

        EmploymentInfo employmentInfo = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(employmentInfo);
        CertificateRequest request = new CertificateRequest(email.email(), "java8", date);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // when

        CertificateResponse response = createCertificateUseCase.execute(request);

        // then

        assertThat(response).isNotNull();
        assertThat(response.name()).isNotNull();
        assertThat(response.message()).isEqualTo("Addition of certification successfully completed");

        verify(userRepository).save(user);

    }

    @Test
    void should_throwIllegalArgumentException_when_userIsNull() {
        // given
        Calendar calendar = Calendar.getInstance();
        calendar.set(2003,Calendar.JANUARY, 12);
        LocalDate date = LocalDate.now();
        Email email = new Email("test@wp.pl");

        EmploymentInfo employmentInfo = new EmploymentInfo();
        User user = new User();
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        user.setEmploymentInfo(employmentInfo);
        CertificateRequest request = new CertificateRequest(email.email(), "Java8", date);


        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> createCertificateUseCase.execute(request));
        assertThat(ex.getMessage()).isEqualTo("User not found");

    }



}