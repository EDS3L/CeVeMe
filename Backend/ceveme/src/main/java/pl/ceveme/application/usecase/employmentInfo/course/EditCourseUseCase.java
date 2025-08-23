package pl.ceveme.application.usecase.employmentInfo.course;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditCourseUseCase {

    private final EmploymentInfoRepository employmentInfoRepository;

    public EditCourseUseCase(EmploymentInfoRepository employmentInfoRepository) {
        this.employmentInfoRepository = employmentInfoRepository;
    }

    @Transactional
    public CourseResponse execute(CourseRequest request, Long userId) throws AccessDeniedException {
        EmploymentInfo info = employmentInfoRepository.findById(request.employmentInfoId())
                .orElseThrow(() -> new IllegalArgumentException("EmploymentInfo not found"));

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Course course = info.getCourseById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        course.update(request.courseName(), request.dateOfCourse(), request.courseDescription());

        return new CourseResponse(course.getId(),request.courseName(), request.dateOfCourse(), "Course updated successfully");
    }
}
