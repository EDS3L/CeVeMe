package pl.ceveme.application.usecase.employmentInfo.course;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

@Service
public class EditCourseUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditCourseUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public CourseResponse execute(CourseRequest request, Long employmentInfoId) {
        EmploymentInfo info = employmentInfoRepository.findById(employmentInfoId)
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        Course course = info.getCourseById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        course.update(request.courseName(), request.dateOfCourse(), request.courseDescription());

        return new CourseResponse(request.courseName(), request.dateOfCourse(), "Course updated successfully");
    }
}
