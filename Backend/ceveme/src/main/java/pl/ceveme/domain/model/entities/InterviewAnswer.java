package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_answers")
public class InterviewAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String answerText;

    @Column(columnDefinition = "TEXT")
    private String transcription;

    private Integer responseTimeSeconds;

    private LocalDateTime answeredAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private InterviewQuestion question;

    @OneToOne(mappedBy = "answer", cascade = CascadeType.ALL, orphanRemoval = true)
    private AnswerFeedback feedback;

    public InterviewAnswer() {
    }

    public InterviewAnswer(String answerText, String transcription, Integer responseTimeSeconds,
                           LocalDateTime answeredAt, InterviewQuestion question) {
        this.answerText = answerText;
        this.transcription = transcription;
        this.responseTimeSeconds = responseTimeSeconds;
        this.answeredAt = answeredAt;
        this.question = question;
    }

    public static InterviewAnswer create(String answerText, String transcription,
                                         Integer responseTimeSeconds, InterviewQuestion question) {
        return new InterviewAnswer(answerText, transcription, responseTimeSeconds, LocalDateTime.now(), question);
    }

    public void attachFeedback(AnswerFeedback feedback) {
        this.feedback = feedback;
        feedback.setAnswer(this);
    }

    public Long getId() {
        return id;
    }

    public String getAnswerText() {
        return answerText;
    }

    public String getTranscription() {
        return transcription;
    }

    public Integer getResponseTimeSeconds() {
        return responseTimeSeconds;
    }

    public LocalDateTime getAnsweredAt() {
        return answeredAt;
    }

    public InterviewQuestion getQuestion() {
        return question;
    }

    public AnswerFeedback getFeedback() {
        return feedback;
    }

    public void setFeedback(AnswerFeedback feedback) {
        this.feedback = feedback;
    }
}
