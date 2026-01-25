package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;
import pl.ceveme.domain.model.enums.SessionMode;
import pl.ceveme.domain.model.enums.SessionStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_offer_id")
    private JobOffer jobOffer;

    @Enumerated(EnumType.STRING)
    private SessionMode mode;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    private Integer totalQuestions;

    private Integer answeredQuestions;

    private Integer overallScore;

    @Column(columnDefinition = "TEXT")
    private String jobOfferAnalysis;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(columnDefinition = "TEXT")
    private String strengthsSummary;

    @Column(columnDefinition = "TEXT")
    private String weaknessesSummary;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderIndex ASC")
    private List<InterviewQuestion> questions = new ArrayList<>();

    public InterviewSession() {
    }

    public InterviewSession(User user, JobOffer jobOffer, SessionMode mode, Integer totalQuestions) {
        this.user = user;
        this.jobOffer = jobOffer;
        this.mode = mode;
        this.status = SessionStatus.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
        this.totalQuestions = totalQuestions;
        this.answeredQuestions = 0;
    }

    public static InterviewSession create(User user, JobOffer jobOffer, SessionMode mode, Integer totalQuestions) {
        return new InterviewSession(user, jobOffer, mode, totalQuestions);
    }

    public void addQuestion(InterviewQuestion question) {
        questions.add(question);
        question.assignToSession(this);
    }

    public void addQuestions(List<InterviewQuestion> questionList) {
        for (InterviewQuestion question : questionList) {
            addQuestion(question);
        }
    }

    public void recordAnswer() {
        this.answeredQuestions++;
        if (this.answeredQuestions.equals(this.totalQuestions)) {
            complete();
        }
    }

    public void complete() {
        this.status = SessionStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        calculateOverallScore();
    }

    public void abandon() {
        this.status = SessionStatus.ABANDONED;
        this.completedAt = LocalDateTime.now();
    }

    public void setAnalysisResults(String recommendations, String strengthsSummary, String weaknessesSummary) {
        this.recommendations = recommendations;
        this.strengthsSummary = strengthsSummary;
        this.weaknessesSummary = weaknessesSummary;
    }

    public void setJobOfferAnalysis(String analysis) {
        this.jobOfferAnalysis = analysis;
    }

    private void calculateOverallScore() {
        if (questions.isEmpty()) {
            this.overallScore = 0;
            return;
        }
        int totalScore = 0;
        int count = 0;
        for (InterviewQuestion question : questions) {
            if (question.getAnswer() != null && question.getAnswer().getFeedback() != null) {
                Integer score = question.getAnswer().getFeedback().getOverallScore();
                if (score != null) {
                    totalScore += score;
                    count++;
                }
            }
        }
        this.overallScore = count > 0 ? totalScore / count : 0;
    }

    public Optional<InterviewQuestion> getCurrentQuestion() {
        return questions.stream()
                .filter(q -> !q.isAnswered())
                .findFirst();
    }

    public Optional<InterviewQuestion> getQuestionByIndex(int index) {
        return questions.stream()
                .filter(q -> q.getOrderIndex() == index)
                .findFirst();
    }

    public boolean isCompleted() {
        return status == SessionStatus.COMPLETED;
    }

    public boolean isInProgress() {
        return status == SessionStatus.IN_PROGRESS;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public JobOffer getJobOffer() {
        return jobOffer;
    }

    public SessionMode getMode() {
        return mode;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public Integer getAnsweredQuestions() {
        return answeredQuestions;
    }

    public Integer getOverallScore() {
        return overallScore;
    }

    public String getJobOfferAnalysis() {
        return jobOfferAnalysis;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public String getStrengthsSummary() {
        return strengthsSummary;
    }

    public String getWeaknessesSummary() {
        return weaknessesSummary;
    }

    public List<InterviewQuestion> getQuestions() {
        return questions;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }
}
