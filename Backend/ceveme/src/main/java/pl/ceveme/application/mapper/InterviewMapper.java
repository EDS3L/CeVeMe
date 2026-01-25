package pl.ceveme.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import pl.ceveme.application.dto.interview.*;
import pl.ceveme.domain.model.entities.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InterviewMapper {

    @Mapping(target = "isAnswered", expression = "java(question.isAnswered())")
    QuestionResponse toQuestionResponse(InterviewQuestion question);

    List<QuestionResponse> toQuestionResponseList(List<InterviewQuestion> questions);

    FeedbackResponse toFeedbackResponse(AnswerFeedback feedback);

    @Mapping(target = "feedback", source = "feedback")
    AnswerResponse toAnswerResponse(InterviewAnswer answer);

    @Mapping(target = "jobOfferId", source = "jobOffer.id")
    @Mapping(target = "jobTitle", source = "jobOffer.title")
    @Mapping(target = "company", source = "jobOffer.company")
    @Mapping(target = "questions", source = "questions")
    @Mapping(target = "currentQuestion", source = "session", qualifiedByName = "mapCurrentQuestion")
    SessionResponse toSessionResponse(InterviewSession session);

    @Mapping(target = "jobOfferId", source = "jobOffer.id")
    @Mapping(target = "jobTitle", source = "jobOffer.title")
    @Mapping(target = "company", source = "jobOffer.company")
    @Mapping(target = "status", expression = "java(session.getStatus().name())")
    SessionSummaryResponse toSessionSummaryResponse(InterviewSession session);

    List<SessionSummaryResponse> toSessionSummaryResponseList(List<InterviewSession> sessions);

    @Named("mapCurrentQuestion")
    default QuestionResponse mapCurrentQuestion(InterviewSession session) {
        return session.getCurrentQuestion()
                .map(this::toQuestionResponse)
                .orElse(null);
    }

    @Mapping(target = "questionId", source = "id")
    @Mapping(target = "category", expression = "java(question.getCategory().name())")
    @Mapping(target = "difficulty", expression = "java(question.getDifficulty().name())")
    @Mapping(target = "answerText", source = "question.answer.answerText")
    @Mapping(target = "responseTimeSeconds", source = "question.answer.responseTimeSeconds")
    @Mapping(target = "feedback", source = "question.answer.feedback")
    QuestionDetailResponse toQuestionDetailResponse(InterviewQuestion question);

    List<QuestionDetailResponse> toQuestionDetailResponseList(List<InterviewQuestion> questions);
}
