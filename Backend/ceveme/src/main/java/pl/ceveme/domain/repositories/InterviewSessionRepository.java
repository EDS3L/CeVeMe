package pl.ceveme.domain.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.ceveme.domain.model.entities.InterviewSession;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.SessionStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {

    @Query("""
            SELECT s FROM InterviewSession s
            LEFT JOIN FETCH s.jobOffer
            WHERE s.user = :user
            ORDER BY s.startedAt DESC
            """)
    Page<InterviewSession> findByUserWithJobOfferOrderByStartedAtDesc(@Param("user") User user, Pageable pageable);

    Page<InterviewSession> findByUserOrderByStartedAtDesc(User user, Pageable pageable);

    List<InterviewSession> findByUserAndStatusOrderByStartedAtDesc(User user, SessionStatus status);

    @Query("""
            SELECT s FROM InterviewSession s
            LEFT JOIN FETCH s.jobOffer
            LEFT JOIN FETCH s.questions q
            LEFT JOIN FETCH q.answer a
            LEFT JOIN FETCH a.feedback
            WHERE s.id = :id
            ORDER BY q.orderIndex
            """)
    Optional<InterviewSession> findByIdWithQuestionsAndAnswers(@Param("id") Long id);

    @Query("""
            SELECT s FROM InterviewSession s
            WHERE s.user = :user
            AND s.status = 'COMPLETED'
            ORDER BY s.completedAt DESC
            """)
    List<InterviewSession> findCompletedSessionsByUser(@Param("user") User user);

    @Query("""
            SELECT COUNT(s) FROM InterviewSession s
            WHERE s.user = :user AND s.status = 'COMPLETED'
            """)
    Long countCompletedByUser(@Param("user") User user);

    @Query("""
            SELECT AVG(s.overallScore) FROM InterviewSession s
            WHERE s.user = :user AND s.status = 'COMPLETED' AND s.overallScore IS NOT NULL
            """)
    Double getAverageScoreByUser(@Param("user") User user);

    @Query("""
            SELECT s FROM InterviewSession s
            WHERE s.user = :user
            AND s.startedAt >= :fromDate
            AND s.status = 'COMPLETED'
            ORDER BY s.startedAt ASC
            """)
    List<InterviewSession> findCompletedSessionsByUserAfterDate(@Param("user") User user, @Param("fromDate") LocalDateTime fromDate);

    @Query("""
            SELECT s.mode, COUNT(s) FROM InterviewSession s
            WHERE s.user = :user AND s.status = 'COMPLETED'
            GROUP BY s.mode
            """)
    List<Object[]> countSessionsByModeForUser(@Param("user") User user);

    @Query("""
            SELECT s FROM InterviewSession s
            WHERE s.user.id = :userId
            AND s.jobOffer.id = :jobOfferId
            AND s.status = 'COMPLETED'
            ORDER BY s.overallScore DESC
            """)
    List<InterviewSession> findBestSessionForJobOffer(@Param("userId") Long userId, @Param("jobOfferId") Long jobOfferId, Pageable pageable);
}
