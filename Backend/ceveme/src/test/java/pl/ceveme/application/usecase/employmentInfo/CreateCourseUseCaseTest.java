package pl.ceveme.application.usecase.employmentInfo;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.course.CourseRequest;
import pl.ceveme.application.dto.course.CourseResponse;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreateCourseUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CreateCourseUseCase createCourseUseCase;

    @Test
    void should_createCourse_when_valueIsCorrect() {
        // given
        String email = "test@wp.pl";
        String courseName = "Java";
        Email email1 = new Email(email);
        LocalDate dateOfCourse = LocalDate.of(2003,12,12);
        String courseDescription = "java course";
        EmploymentInfo employmentInfo = new EmploymentInfo();
        User user = new User();
        user.setEmploymentInfo(employmentInfo);

        CourseRequest request = new CourseRequest(email1.email(),courseName,dateOfCourse,courseDescription);

        // when
        when(userRepository.findByEmail(email1)).thenReturn(Optional.of(user));
        CourseResponse courseResponse = createCourseUseCase.execute(request);

        // then
        assertThat(courseResponse).isNotNull();
        assertThat(courseResponse.courseName()).isEqualTo(courseName);
        assertThat(courseResponse.dateOfCourse()).isEqualTo(dateOfCourse);
        assertThat(courseResponse.message()).isEqualTo("Addition of course successfully completed");

        verify(userRepository).save(user);
    }

}