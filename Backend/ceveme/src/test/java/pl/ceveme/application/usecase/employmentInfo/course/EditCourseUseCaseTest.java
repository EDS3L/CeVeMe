package pl.ceveme.application.usecase.employmentInfo.course;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditCourseUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EditCourseUseCase editCourseUseCase;

    @Test
    void should_editCourse_when_courseExists() throws AccessDeniedException {
        // given
        Long userId = 1L;
        Long courseId = 10L;
        Course course = new Course("Old Name", LocalDate.now().minusYears(1), "Old description");
        try {
            java.lang.reflect.Field field = Course.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(course, courseId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        CourseRequest request = new CourseRequest(courseId, "Updated Name", LocalDate.now(), "Updated description", userId);

        User user = new User();
        try {
            java.lang.reflect.Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        EmploymentInfo info = new EmploymentInfo();
        info.addCourse(course);
        user.setEmploymentInfo(info);
        info.setUser(user);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        CourseResponse response = editCourseUseCase.execute(request, userId);

        // then
        assertThat(response.courseName()).isEqualTo("Updated Name");
        assertThat(response.message()).isEqualTo("Course updated successfully");
    }

    @Test
    void should_throwException_when_courseNotFound() {
        // given
        Long userId = 1L;
        CourseRequest request = new CourseRequest(99L, "Name", LocalDate.now(), "Description", userId);

        User user = new User();
        try {
            java.lang.reflect.Field field = User.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        EmploymentInfo info = new EmploymentInfo();
        user.setEmploymentInfo(info);
        info.setUser(user);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editCourseUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("Course not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long userId = 999L;
        CourseRequest request = new CourseRequest(1L, "Any", LocalDate.now(), "Any", userId);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editCourseUseCase.execute(request, userId));

        assertThat(ex.getMessage()).isEqualTo("User not found");
    }
}
