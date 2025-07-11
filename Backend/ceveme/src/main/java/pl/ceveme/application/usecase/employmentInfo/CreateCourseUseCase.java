package pl.ceveme.application.usecase.employmentInfo;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.course.CourseRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.vo.Email;
import pl.ceveme.domain.repositories.UserRepository;

@Service
public class CreateCourseUseCase {

    private final UserRepository userRepository;

    public CreateCourseUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public CourseResponse execute(CourseRequest request) {
        User user = userRepository.findByEmail(new Email(request.email()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.addCourse(new Course(request.courseName(), request.dateOfCourse(), request.courseDescription()));

        userRepository.save(user);

        return new CourseResponse(request.courseName(), request.dateOfCourse(), "Addition of course successfully completed");
    }
}
