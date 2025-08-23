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
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeleteCourseUseCaseTest {

    @Mock
    private EmploymentInfoRepository employmentInfoRepository;

    @InjectMocks
    private DeleteCourseUseCase deleteCourseUseCase;

    @Test
    void should_deleteCourse_when_exists() {
        // given
        Long courseId = 123L;
        Long infoId = 1L;
        Course course = createCourseWithId(courseId, "To delete", "Organizer", LocalDate.now().minusYears(1));

        EmploymentInfo info = new EmploymentInfo();
        info.addCourse(course);

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when
        CourseResponse response = deleteCourseUseCase.execute(new DeleteEntityRequest(courseId, infoId));

        // then
        assertThat(response.courseName()).isEqualTo("To delete");
        assertThat(response.message()).isEqualTo("Course deleted successfully");
    }

    @Test
    void should_throwException_when_courseNotFound() {
        // given
        Long courseId = 999L;
        Long infoId = 1L;
        EmploymentInfo info = new EmploymentInfo();

        when(employmentInfoRepository.findById(infoId)).thenReturn(Optional.of(info));

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteCourseUseCase.execute(new DeleteEntityRequest(courseId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("Course not found");
    }

    @Test
    void should_throwException_when_employmentInfoNotFound() {
        // given
        Long courseId = 999L;
        Long infoId = 1L;
        when(employmentInfoRepository.findById(1L)).thenReturn(Optional.empty());

        // when & then
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> deleteCourseUseCase.execute(new DeleteEntityRequest(courseId, infoId)));

        assertThat(ex.getMessage()).isEqualTo("EmploymentInfo not found");
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
