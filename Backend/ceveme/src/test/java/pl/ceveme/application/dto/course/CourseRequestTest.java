package pl.ceveme.application.dto.course;

import org.junit.jupiter.api.Test;
import pl.ceveme.application.dto.entity.course.CourseRequest;

import java.time.LocalDate;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CourseRequestTest {

    @Test
    void should_createCourse_when_valuesAreCorrect() {
        // given
        String courseName = "java";
        LocalDate dateOfCourse = LocalDate.of(2021, 12, 12);
        String courseDescription = "course about java!";

        // when
        CourseRequest courseRequest = new CourseRequest(1L, courseName, dateOfCourse, courseDescription, 1L);

        // then
        assertThat(courseRequest).isNotNull();
        assertThat(courseRequest.courseName()).isEqualTo(courseName);
        assertThat(courseRequest.dateOfCourse()).isEqualTo(dateOfCourse);

    }

    @Test
    void should_throwIllegalArgumentException_when_nameOfTheCourseIsNull() {
        // given
        String courseName = "";
        LocalDate dateOfCourse = LocalDate.of(2021, 12, 12);
        String courseDescription = "course about java!";

        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new CourseRequest(1L, courseName, dateOfCourse, courseDescription, 1L));
        assertThat(ex.getMessage()).isEqualTo("Name of certificate is null!");

    }

    @Test
    void should_throwIllegalArgumentException_when_dateIsNull() {
        // given
        String courseName = "java8";
        LocalDate dateOfCourse = null;
        String courseDescription = "course about java!";

        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new CourseRequest(1L, courseName, dateOfCourse, courseDescription, 1L));
        assertThat(ex.getMessage()).isEqualTo("Date of certificate is null");
    }

    @Test
    void should_throwIllegalArgumentException_when_dateIsAfterCurretDate() {
        // given
        String courseName = "java";
        LocalDate dateOfCourse = LocalDate.of(2100, 12, 12);
        String courseDescription = "course about java!";

        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new CourseRequest(1L, courseName, dateOfCourse, courseDescription, 1L));
        assertThat(ex.getMessage()).isEqualTo("Date cannot be after " + LocalDate.now());
    }

    @Test
    void should_throwIllegalArgumentException_when_courseDescriptionIsNull() {
        // given
        String courseName = "java";
        LocalDate dateOfCourse = LocalDate.of(2021, 12, 12);
        String courseDescription = "";

        // when & then

        final IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> new CourseRequest(1L, courseName, dateOfCourse, courseDescription, 1L));
        assertThat(ex.getMessage()).isEqualTo("Course description is null!");
    }


}