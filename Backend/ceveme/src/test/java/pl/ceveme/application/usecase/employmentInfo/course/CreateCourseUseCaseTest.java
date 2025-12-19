package pl.ceveme.application.usecase.employmentInfo.course;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.CourseRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateCourseUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CreateCourseUseCase createCourseUseCase;

    @Test
    void should_createCourse_when_valueIsCorrect() {
        // given
        Long userId = 1L;
        String courseName = "Java";
        LocalDate dateOfCourse = LocalDate.of(2003,12,12);
        String courseDescription = "java course";
        User user = new User();

        CourseRequest request = new CourseRequest(1L, courseName, dateOfCourse, courseDescription, userId);

        // when
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        CourseResponse courseResponse = createCourseUseCase.execute(request, userId);

        // then
        assertThat(courseResponse).isNotNull();
        assertThat(courseResponse.courseName()).isEqualTo(courseName);
        assertThat(courseResponse.dateOfCourse()).isEqualTo(dateOfCourse);
        assertThat(courseResponse.message()).isEqualTo("Addition of course successfully completed");

        verify(courseRepository).save(any());
    }

}