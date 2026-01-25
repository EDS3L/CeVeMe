package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.ceveme.domain.model.entities.AnswerFeedback;

import java.util.Optional;

public interface AnswerFeedbackRepository extends JpaRepository<AnswerFeedback, Long> {

    Optional<AnswerFeedback> findByAnswerId(Long answerId);
}
