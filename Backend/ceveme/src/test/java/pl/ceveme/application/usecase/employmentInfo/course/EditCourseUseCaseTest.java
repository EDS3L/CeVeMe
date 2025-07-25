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
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EditCourseUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private EditCourseUseCase editCourseUseCase;

    @Test
    void should_editCourse_when_courseExists() {
        // given
        Long employmentInfoId = 1L;
        Long courseId = 10L;
        Course course = new Course("Old Name", LocalDate.now().minusYears(1), "Old description");
        try {
            java.lang.reflect.Field field = Course.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(course, courseId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        CourseRequest request = new CourseRequest(courseId, "test@wp.pl", "Updated Name", LocalDate.now(), "Updated description");
        EmploymentInfo info = new EmploymentInfo();
        info.addCourse(course);

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when
        CourseResponse response = editCourseUseCase.execute(request, employmentInfoId);

        // then
        assertThat(response.courseName()).isEqualTo("Updated Name");
        assertThat(response.message()).isEqualTo("Course updated successfully");
    }

    @Test
    void should_throwException_when_courseNotFound() {
        // given
        Long employmentInfoId = 1L;
        CourseRequest request = new CourseRequest(99L, "test@wp.pl", "Name", LocalDate.now(), "Description");
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editCourseUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("Course not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long employmentInfoId = 999L;
        CourseRequest request = new CourseRequest(1L, "test@wp.pl", "Any", LocalDate.now(), "Any");

        when(employmentInfoRepository.findById(employmentInfoId)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> editCourseUseCase.execute(request, employmentInfoId));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
    }
}
