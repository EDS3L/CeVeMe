package pl.ceveme.application.usecase.employmentInfo.course;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.DeleteEntityRequest;
import pl.ceveme.application.dto.entity.course.CourseResponse;
import pl.ceveme.domain.model.entities.Course;
import pl.ceveme.domain.model.entities.EmploymentInfo;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.repositories.EmploymentInfoRepository;
import pl.ceveme.domain.repositories.UserRepository;

import java.nio.file.AccessDeniedException;

@Service
public class DeleteCourseUseCase {

    private final UserRepository userRepository;

    public DeleteCourseUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public CourseResponse execute(DeleteEntityRequest request, Long userId) throws AccessDeniedException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        EmploymentInfo info = user.getEmploymentInfo();
        if(info.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied!");
        }

        Course course = info.getCourseById(request.itemId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        info.removeCourse(course);

        return new CourseResponse(
                course.getId(),
                course.getCourseName(),
                course.getDateOfCourse(),
                "Course deleted successfully"
        );
    }
}
