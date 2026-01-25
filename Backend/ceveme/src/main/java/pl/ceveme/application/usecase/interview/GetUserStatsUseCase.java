package pl.ceveme.application.usecase.interview;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.interview.ProgressDataPoint;
import pl.ceveme.application.dto.interview.UserStatsResponse;
import pl.ceveme.domain.model.entities.InterviewSession;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.QuestionCategory;
import pl.ceveme.domain.model.enums.SessionMode;
import pl.ceveme.domain.repositories.InterviewQuestionRepository;
import pl.ceveme.domain.repositories.InterviewSessionRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GetUserStatsUseCase {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewQuestionRepository questionRepository;

    public GetUserStatsUseCase(InterviewSessionRepository sessionRepository,
                               InterviewQuestionRepository questionRepository) {
        this.sessionRepository = sessionRepository;
        this.questionRepository = questionRepository;
    }

    public UserStatsResponse execute(User user) {
        Long totalSessions = sessionRepository.count();
        Long completedSessions = sessionRepository.countCompletedByUser(user);
        Double averageScore = sessionRepository.getAverageScoreByUser(user);

        List<InterviewSession> completedList = sessionRepository.findCompletedSessionsByUser(user);
        Integer bestScore = completedList.stream()
                .map(InterviewSession::getOverallScore)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(0);

        Map<String, Long> sessionsByMode = new HashMap<>();
        List<Object[]> modeStats = sessionRepository.countSessionsByModeForUser(user);
        for (Object[] row : modeStats) {
            SessionMode mode = (SessionMode) row[0];
            Long count = (Long) row[1];
            sessionsByMode.put(mode.name(), count);
        }

        Map<String, Double> averageScoreByCategory = new HashMap<>();
        List<Object[]> categoryStats = questionRepository.getAverageScoreByCategory(user.getId());
        for (Object[] row : categoryStats) {
            QuestionCategory category = (QuestionCategory) row[0];
            Double avgScore = (Double) row[1];
            averageScoreByCategory.put(category.name(), avgScore);
        }

        List<ProgressDataPoint> progressHistory = buildProgressHistory(user);
        List<String> earnedBadges = calculateBadges(completedSessions, bestScore, averageScore);

        return new UserStatsResponse(
                totalSessions,
                completedSessions,
                averageScore != null ? averageScore : 0.0,
                bestScore,
                sessionsByMode,
                averageScoreByCategory,
                progressHistory,
                earnedBadges
        );
    }

    private List<ProgressDataPoint> buildProgressHistory(User user) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<InterviewSession> recentSessions = sessionRepository.findCompletedSessionsByUserAfterDate(user, thirtyDaysAgo);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return recentSessions.stream()
                .filter(s -> s.getOverallScore() != null)
                .map(s -> new ProgressDataPoint(
                        s.getStartedAt().format(formatter),
                        s.getOverallScore(),
                        s.getMode().name()
                ))
                .collect(Collectors.toList());
    }

    private List<String> calculateBadges(Long completedSessions, Integer bestScore, Double averageScore) {
        List<String> badges = new ArrayList<>();

        if (completedSessions >= 1) badges.add("FIRST_INTERVIEW");
        if (completedSessions >= 5) badges.add("FIVE_SESSIONS");
        if (completedSessions >= 10) badges.add("TEN_SESSIONS");
        if (completedSessions >= 25) badges.add("TWENTY_FIVE_SESSIONS");
        if (completedSessions >= 50) badges.add("FIFTY_SESSIONS");

        if (bestScore >= 90) badges.add("STAR_PERFORMER");
        if (bestScore >= 95) badges.add("EXCELLENCE");
        if (bestScore == 100) badges.add("PERFECT_SCORE");

        if (averageScore != null && averageScore >= 80) badges.add("CONSISTENT_PERFORMER");
        if (averageScore != null && averageScore >= 90) badges.add("TOP_PERFORMER");

        return badges;
    }
}
