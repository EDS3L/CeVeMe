package pl.ceveme.application.usecase.employmentInfo.course;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class EditCourseUseCase {

    private final UserRepository userRepository;

    public EditCourseUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public CourseResponse execute(CourseRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EmploymentInfo info = user.getEmploymentInfo();

        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Course course = info.getCourseById(request.id())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        course.update(request.courseName(), request.dateOfCourse(), request.courseDescription());

        return new CourseResponse(course.getId(),request.courseName(), request.dateOfCourse(), "Course updated successfully");
    }
}
