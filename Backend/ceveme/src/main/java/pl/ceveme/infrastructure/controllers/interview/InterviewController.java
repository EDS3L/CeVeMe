package pl.ceveme.infrastructure.controllers.interview;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.ceveme.application.dto.interview.*;
import pl.ceveme.application.usecase.interview.*;
import pl.ceveme.domain.model.entities.User;

/**
 * Kontroler API dla modułu rozmów kwalifikacyjnych.
 * 
 * AI jest wykorzystywane wyłącznie do:
 * - Generowania pytań rekrutacyjnych (podczas tworzenia sesji)
 * - Oceny odpowiedzi kandydata (podczas submitAnswer)
 * - Generowania podsumowań sesji (w raporcie)
 * 
 * Dane oferty pracy (wymagania, obowiązki, trudność) są pobierane
 * bezpośrednio z bazy danych przez endpoint /api/job-offers/{id}.
 */
@RestController
@RequestMapping("api/interview")
public class InterviewController {

    private final CreateInterviewSessionUseCase createSessionUseCase;
    private final GetInterviewSessionUseCase getSessionUseCase;
    private final SubmitAnswerUseCase submitAnswerUseCase;
    private final GetSessionReportUseCase getReportUseCase;
    private final GetUserSessionsUseCase getUserSessionsUseCase;
    private final GetUserStatsUseCase getUserStatsUseCase;
    private final DeleteSessionUseCase deleteSessionUseCase;
    private final AbandonSessionUseCase abandonSessionUseCase;

    public InterviewController(CreateInterviewSessionUseCase createSessionUseCase,
                               GetInterviewSessionUseCase getSessionUseCase,
                               SubmitAnswerUseCase submitAnswerUseCase,
                               GetSessionReportUseCase getReportUseCase,
                               GetUserSessionsUseCase getUserSessionsUseCase,
                               GetUserStatsUseCase getUserStatsUseCase,
                               DeleteSessionUseCase deleteSessionUseCase,
                               AbandonSessionUseCase abandonSessionUseCase) {
        this.createSessionUseCase = createSessionUseCase;
        this.getSessionUseCase = getSessionUseCase;
        this.submitAnswerUseCase = submitAnswerUseCase;
        this.getReportUseCase = getReportUseCase;
        this.getUserSessionsUseCase = getUserSessionsUseCase;
        this.getUserStatsUseCase = getUserStatsUseCase;
        this.deleteSessionUseCase = deleteSessionUseCase;
        this.abandonSessionUseCase = abandonSessionUseCase;
    }

    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> createSession(
            @RequestBody CreateSessionRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        SessionResponse response = createSessionUseCase.execute(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<SessionResponse> getSession(
            @PathVariable Long sessionId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        SessionResponse response = getSessionUseCase.execute(sessionId, user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sessions/{sessionId}/answers")
    public ResponseEntity<SubmitAnswerResponse> submitAnswer(
            @PathVariable Long sessionId,
            @RequestBody SubmitAnswerRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        SubmitAnswerResponse response = submitAnswerUseCase.execute(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions/{sessionId}/report")
    public ResponseEntity<SessionReportResponse> getSessionReport(
            @PathVariable Long sessionId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        SessionReportResponse response = getReportUseCase.execute(sessionId, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions")
    public ResponseEntity<Page<SessionSummaryResponse>> getUserSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<SessionSummaryResponse> response = getUserSessionsUseCase.execute(user, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponse> getUserStats(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserStatsResponse response = getUserStatsUseCase.execute(user);
        return ResponseEntity.ok(response);
    }

    // Usunięto endpoint /analyze/{jobOfferId} - dane oferty są dostępne przez /api/job-offers/{id}
    // AI nie jest już używane do analizy wymagań i trudności oferty

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long sessionId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        deleteSessionUseCase.execute(sessionId, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sessions/{sessionId}/abandon")
    public ResponseEntity<Void> abandonSession(
            @PathVariable Long sessionId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        abandonSessionUseCase.execute(sessionId, user);
        return ResponseEntity.noContent().build();
    }
}
