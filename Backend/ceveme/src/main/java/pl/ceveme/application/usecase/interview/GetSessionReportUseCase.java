package pl.ceveme.application.usecase.interview;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.interview.*;
import pl.ceveme.application.mapper.InterviewMapper;
import pl.ceveme.domain.model.entities.InterviewQuestion;
import pl.ceveme.domain.model.entities.InterviewSession;
import pl.ceveme.domain.model.entities.User;
import pl.ceveme.domain.model.enums.QuestionCategory;
import pl.ceveme.domain.repositories.InterviewSessionRepository;
import pl.ceveme.infrastructure.external.interview.InterviewAIService;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GetSessionReportUseCase {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewAIService aiService;
    private final InterviewMapper mapper;

    public GetSessionReportUseCase(InterviewSessionRepository sessionRepository,
                                   InterviewAIService aiService,
                                   InterviewMapper mapper) {
        this.sessionRepository = sessionRepository;
        this.aiService = aiService;
        this.mapper = mapper;
    }

    @Transactional
    public SessionReportResponse execute(Long sessionId, User user) {
        InterviewSession session = sessionRepository.findByIdWithQuestionsAndAnswers(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        if (session.getRecommendations() == null && session.isCompleted()) {
            generateAndSaveSummary(session);
        }

        Map<String, Integer> categoryScores = calculateCategoryScores(session);
        Map<String, Integer> skillScores = calculateSkillScores(session);

        List<QuestionDetailResponse> questionDetails = session.getQuestions().stream()
                .filter(InterviewQuestion::isAnswered)
                .map(mapper::toQuestionDetailResponse)
                .toList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        return new SessionReportResponse(
                session.getId(),
                session.getJobOffer() != null ? session.getJobOffer().getTitle() : "Nieznane stanowisko",
                session.getJobOffer() != null ? session.getJobOffer().getCompany() : "Nieznana firma",
                session.getMode().name(),
                session.getStatus().name(),
                session.getStartedAt() != null ? session.getStartedAt().format(formatter) : null,
                session.getCompletedAt() != null ? session.getCompletedAt().format(formatter) : null,
                session.getTotalQuestions(),
                session.getAnsweredQuestions(),
                session.getOverallScore(),
                session.getRecommendations(),
                session.getStrengthsSummary(),
                session.getWeaknessesSummary(),
                categoryScores,
                skillScores,
                questionDetails
        );
    }

    private void generateAndSaveSummary(InterviewSession session) {
        StringBuilder sessionData = new StringBuilder();
        sessionData.append("Stanowisko: ").append(session.getJobOffer().getTitle()).append("\n");
        sessionData.append("Firma: ").append(session.getJobOffer().getCompany()).append("\n");
        sessionData.append("Tryb: ").append(session.getMode()).append("\n");
        sessionData.append("Ogólny wynik: ").append(session.getOverallScore()).append("/100\n\n");

        for (InterviewQuestion question : session.getQuestions()) {
            if (question.isAnswered()) {
                sessionData.append("Pytanie: ").append(question.getQuestionText()).append("\n");
                sessionData.append("Kategoria: ").append(question.getCategory()).append("\n");
                sessionData.append("Wynik: ").append(question.getAnswer().getFeedback().getOverallScore()).append("\n\n");
            }
        }

        Map<String, String> summary = aiService.generateSessionSummary(sessionData.toString());

        session.setAnalysisResults(
                summary.get("recommendations"),
                summary.get("strengthsSummary"),
                summary.get("weaknessesSummary")
        );

        sessionRepository.save(session);
    }

    private Map<String, Integer> calculateCategoryScores(InterviewSession session) {
        Map<String, Integer> scores = new HashMap<>();
        Map<String, Integer> counts = new HashMap<>();

        for (InterviewQuestion question : session.getQuestions()) {
            if (question.isAnswered() && question.getAnswer().getFeedback() != null) {
                String category = question.getCategory().name();
                int score = question.getAnswer().getFeedback().getOverallScore();
                scores.merge(category, score, Integer::sum);
                counts.merge(category, 1, Integer::sum);
            }
        }

        Map<String, Integer> averages = new HashMap<>();
        for (String category : scores.keySet()) {
            averages.put(category, scores.get(category) / counts.get(category));
        }

        return averages;
    }

    private Map<String, Integer> calculateSkillScores(InterviewSession session) {
        Map<String, Integer> totals = new HashMap<>();
        int count = 0;

        for (InterviewQuestion question : session.getQuestions()) {
            if (question.isAnswered() && question.getAnswer().getFeedback() != null) {
                var feedback = question.getAnswer().getFeedback();
                totals.merge("clarity", feedback.getClarityScore() != null ? feedback.getClarityScore() : 0, Integer::sum);
                totals.merge("relevance", feedback.getRelevanceScore() != null ? feedback.getRelevanceScore() : 0, Integer::sum);
                totals.merge("depth", feedback.getDepthScore() != null ? feedback.getDepthScore() : 0, Integer::sum);
                totals.merge("confidence", feedback.getConfidenceScore() != null ? feedback.getConfidenceScore() : 0, Integer::sum);
                count++;
            }
        }

        Map<String, Integer> averages = new HashMap<>();
        if (count > 0) {
            averages.put("clarity", totals.get("clarity") / count);
            averages.put("relevance", totals.get("relevance") / count);
            averages.put("depth", totals.get("depth") / count);
            averages.put("confidence", totals.get("confidence") / count);
        }

        return averages;
    }
}
