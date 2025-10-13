package pl.ceveme.application.usecase.employmentInfo.course;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.CourseRepository;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateCourseUseCase {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public CreateCourseUseCase(UserRepository userRepository, CourseRepository courseRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public CourseResponse execute(CourseRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Course course = new Course(request.courseName(), request.dateOfCourse(), request.courseDescription());

        user.addCourse(course);

        courseRepository.save(course);

        return new CourseResponse(course.getId(), request.courseName(), request.dateOfCourse(), "Addition of course successfully completed");
    }
}
