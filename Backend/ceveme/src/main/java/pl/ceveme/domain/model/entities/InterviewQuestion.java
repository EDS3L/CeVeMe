package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;
import pl.ceveme.domain.model.enums.DifficultyLevel;
import pl.ceveme.domain.model.enums.QuestionCategory;

@Entity
@Table(name = "interview_questions")
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String questionText;

    @Enumerated(EnumType.STRING)
    private QuestionCategory category;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficulty;

    @Column(columnDefinition = "TEXT")
    private String expectedKeyPoints;

    @Column(columnDefinition = "TEXT")
    private String starHint;

    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private InterviewSession session;

    @OneToOne(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private InterviewAnswer answer;

    public InterviewQuestion() {
    }

    public InterviewQuestion(String questionText, QuestionCategory category, DifficultyLevel difficulty,
                             String expectedKeyPoints, String starHint, Integer orderIndex) {
        this.questionText = questionText;
        this.category = category;
        this.difficulty = difficulty;
        this.expectedKeyPoints = expectedKeyPoints;
        this.starHint = starHint;
        this.orderIndex = orderIndex;
    }

    public static InterviewQuestion create(String questionText, QuestionCategory category,
                                           DifficultyLevel difficulty, String expectedKeyPoints,
                                           String starHint, Integer orderIndex) {
        return new InterviewQuestion(questionText, category, difficulty, expectedKeyPoints, starHint, orderIndex);
    }

    public void assignToSession(InterviewSession session) {
        this.session = session;
    }

    public Long getId() {
        return id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public QuestionCategory getCategory() {
        return category;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public String getExpectedKeyPoints() {
        return expectedKeyPoints;
    }

    public String getStarHint() {
        return starHint;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public InterviewSession getSession() {
        return session;
    }

    public InterviewAnswer getAnswer() {
        return answer;
    }

    public void setAnswer(InterviewAnswer answer) {
        this.answer = answer;
    }

    public boolean isAnswered() {
        return answer != null;
    }
}
