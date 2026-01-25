package pl.ceveme.domain.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.ceveme.domain.model.entities.InterviewQuestion;
import pl.ceveme.domain.model.enums.QuestionCategory;

import java.util.List;
import java.util.Optional;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {

    List<InterviewQuestion> findBySessionIdOrderByOrderIndexAsc(Long sessionId);

    @Query("""
            SELECT q FROM InterviewQuestion q
            LEFT JOIN FETCH q.answer a
            LEFT JOIN FETCH a.feedback
            WHERE q.id = :id
            """)
    Optional<InterviewQuestion> findByIdWithAnswerAndFeedback(@Param("id") Long id);

    @Query("""
            SELECT q.category, AVG(f.overallScore) FROM InterviewQuestion q
            JOIN q.answer a
            JOIN a.feedback f
            WHERE q.session.user.id = :userId
            GROUP BY q.category
            """)
    List<Object[]> getAverageScoreByCategory(@Param("userId") Long userId);

    @Query("""
            SELECT q.category, COUNT(q) FROM InterviewQuestion q
            JOIN q.answer a
            WHERE q.session.user.id = :userId
            GROUP BY q.category
            """)
    List<Object[]> countAnsweredQuestionsByCategory(@Param("userId") Long userId);
}
