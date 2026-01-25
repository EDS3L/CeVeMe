package pl.ceveme.domain.model.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "answer_feedbacks")
public class AnswerFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer overallScore;

    private Integer situationScore;
    private Integer taskScore;
    private Integer actionScore;
    private Integer resultScore;

    private Integer clarityScore;
    private Integer relevanceScore;
    private Integer depthScore;
    private Integer confidenceScore;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String improvements;

    @Column(columnDefinition = "TEXT")
    private String sampleAnswer;

    @Column(columnDefinition = "TEXT")
    private String keyPointsCovered;

    @Column(columnDefinition = "TEXT")
    private String keyPointsMissed;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id")
    private InterviewAnswer answer;

    public AnswerFeedback() {
    }

    public AnswerFeedback(Integer overallScore, Integer situationScore, Integer taskScore,
                          Integer actionScore, Integer resultScore, Integer clarityScore,
                          Integer relevanceScore, Integer depthScore, Integer confidenceScore,
                          String strengths, String improvements, String sampleAnswer,
                          String keyPointsCovered, String keyPointsMissed) {
        this.overallScore = overallScore;
        this.situationScore = situationScore;
        this.taskScore = taskScore;
        this.actionScore = actionScore;
        this.resultScore = resultScore;
        this.clarityScore = clarityScore;
        this.relevanceScore = relevanceScore;
        this.depthScore = depthScore;
        this.confidenceScore = confidenceScore;
        this.strengths = strengths;
        this.improvements = improvements;
        this.sampleAnswer = sampleAnswer;
        this.keyPointsCovered = keyPointsCovered;
        this.keyPointsMissed = keyPointsMissed;
    }

    public static AnswerFeedback create(Integer overallScore, Integer situationScore, Integer taskScore,
                                        Integer actionScore, Integer resultScore, Integer clarityScore,
                                        Integer relevanceScore, Integer depthScore, Integer confidenceScore,
                                        String strengths, String improvements, String sampleAnswer,
                                        String keyPointsCovered, String keyPointsMissed) {
        return new AnswerFeedback(overallScore, situationScore, taskScore, actionScore, resultScore,
                clarityScore, relevanceScore, depthScore, confidenceScore, strengths, improvements,
                sampleAnswer, keyPointsCovered, keyPointsMissed);
    }

    public int calculateStarAverage() {
        int count = 0;
        int sum = 0;
        if (situationScore != null) { sum += situationScore; count++; }
        if (taskScore != null) { sum += taskScore; count++; }
        if (actionScore != null) { sum += actionScore; count++; }
        if (resultScore != null) { sum += resultScore; count++; }
        return count > 0 ? sum / count : 0;
    }

    public Long getId() {
        return id;
    }

    public Integer getOverallScore() {
        return overallScore;
    }

    public Integer getSituationScore() {
        return situationScore;
    }

    public Integer getTaskScore() {
        return taskScore;
    }

    public Integer getActionScore() {
        return actionScore;
    }

    public Integer getResultScore() {
        return resultScore;
    }

    public Integer getClarityScore() {
        return clarityScore;
    }

    public Integer getRelevanceScore() {
        return relevanceScore;
    }

    public Integer getDepthScore() {
        return depthScore;
    }

    public Integer getConfidenceScore() {
        return confidenceScore;
    }

    public String getStrengths() {
        return strengths;
    }

    public String getImprovements() {
        return improvements;
    }

    public String getSampleAnswer() {
        return sampleAnswer;
    }

    public String getKeyPointsCovered() {
        return keyPointsCovered;
    }

    public String getKeyPointsMissed() {
        return keyPointsMissed;
    }

    public InterviewAnswer getAnswer() {
        return answer;
    }

    public void setAnswer(InterviewAnswer answer) {
        this.answer = answer;
    }
}
