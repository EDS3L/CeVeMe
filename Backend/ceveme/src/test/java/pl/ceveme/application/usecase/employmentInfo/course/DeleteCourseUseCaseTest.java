package pl.ceveme.application.usecase.employmentInfo.course;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
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
class DeleteCourseUseCaseTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DeleteCourseUseCase deleteCourseUseCase;

    @Test
    void should_deleteCourse_when_exists() throws AccessDeniedException {
        // given
        Long courseId = 123L;
        Long userId = 1L;
        Course course = createCourseWithId(courseId, "To delete", "Organizer", LocalDate.now().minusYears(1));

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
        CourseResponse response = deleteCourseUseCase.execute(new DeleteEntityRequest(courseId), userId);

        // then
        assertThat(response.courseName()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("Course deleted successfully");
    }

    @Test
    void should_throwException_when_courseNotFound() {
        // given
        Long courseId = 999L;
        Long userId = 1L;

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
                () -> deleteCourseUseCase.execute(new DeleteEntityRequest(courseId), userId));

        assertThat(ex.getMessage()).isEqualTo("Course not found");
    }

    @Test
    void should_throwException_when_userNotFound() {
        // given
        Long courseId = 999L;
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteCourseUseCase.execute(new DeleteEntityRequest(courseId), userId));

        assertThat(ex.getMessage()).isEqualTo("User with id " + userId + " not found");
    }

    // helper for test
    private Course createCourseWithId(Long id, String name, String organizer, LocalDate date) {
        Course course = new Course(name, date, "Description");
        try {
            java.lang.reflect.Field field = Course.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(course, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return course;
    }
}
