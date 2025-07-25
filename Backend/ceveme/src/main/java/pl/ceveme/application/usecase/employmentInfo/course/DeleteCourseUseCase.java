package pl.ceveme.application.usecase.employmentInfo.course;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

@Service
public class DeleteCourseUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public DeleteCourseUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public CourseResponse execute(Long courseId, Long employmentInfoId) {
        EmploymentInfo info = employmentInfoRepository.findById(employmentInfoId)
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        Course course = info.getCourseById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        info.removeCourse(course);

        return new CourseResponse(
                course.getCourseName(),
                course.getDateOfCourse(),
                "Course deleted successfully"
        );
    }
}
