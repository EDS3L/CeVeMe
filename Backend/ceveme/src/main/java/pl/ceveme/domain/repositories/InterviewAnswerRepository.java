package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.ceveme.domain.model.entities.InterviewAnswer;

import java.util.Optional;

public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, Long> {

    Optional<InterviewAnswer> findByQuestionId(Long questionId);
}
