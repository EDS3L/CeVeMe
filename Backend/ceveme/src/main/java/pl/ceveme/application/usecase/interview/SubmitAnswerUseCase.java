package pl.ceveme.application.usecase.interview;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.interview.FeedbackResponse;
import pl.ceveme.application.dto.interview.QuestionResponse;
import pl.ceveme.application.dto.interview.SubmitAnswerRequest;
import pl.ceveme.application.dto.interview.SubmitAnswerResponse;
import pl.ceveme.application.mapper.InterviewMapper;
import pl.ceveme.domain.model.entities.*;
import pl.ceveme.domain.repositories.InterviewAnswerRepository;
import pl.ceveme.domain.repositories.InterviewQuestionRepository;
import pl.ceveme.domain.repositories.InterviewSessionRepository;
import pl.ceveme.infrastructure.external.interview.InterviewAIService;

@Service
public class SubmitAnswerUseCase {

    private final InterviewQuestionRepository questionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final InterviewSessionRepository sessionRepository;
    private final InterviewAIService aiService;
    private final InterviewMapper mapper;

    public SubmitAnswerUseCase(InterviewQuestionRepository questionRepository,
                               InterviewAnswerRepository answerRepository,
                               InterviewSessionRepository sessionRepository,
                               InterviewAIService aiService,
                               InterviewMapper mapper) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.sessionRepository = sessionRepository;
        this.aiService = aiService;
        this.mapper = mapper;
    }

    @Transactional
    public SubmitAnswerResponse execute(SubmitAnswerRequest request, User user) {
        InterviewQuestion question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        InterviewSession session = question.getSession();

        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        if (question.isAnswered()) {
            throw new IllegalArgumentException("Question already answered");
        }

        String answerText = request.answerText() != null ? request.answerText() : request.transcription();
        if (answerText == null || answerText.isBlank()) {
            throw new IllegalArgumentException("Answer cannot be empty");
        }

        InterviewAnswer answer = InterviewAnswer.create(
                request.answerText(),
                request.transcription(),
                request.responseTimeSeconds(),
                question
        );

        AnswerFeedback feedback = aiService.evaluateAnswer(question, answerText, session.getMode());
        answer.attachFeedback(feedback);

        question.setAnswer(answer);
        answerRepository.save(answer);

        session.recordAnswer();
        sessionRepository.save(session);

        QuestionResponse nextQuestion = session.getCurrentQuestion()
                .map(mapper::toQuestionResponse)
                .orElse(null);

        FeedbackResponse feedbackResponse = mapper.toFeedbackResponse(feedback);

        return new SubmitAnswerResponse(
                answer.getId(),
                question.getId(),
                feedbackResponse,
                nextQuestion,
                session.isCompleted(),
                session.getAnsweredQuestions(),
                session.getTotalQuestions()
        );
    }
}
