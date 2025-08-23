package pl.ceveme.application.dto.entity.applicationHistory;

public record ApplicationHistoryRequest(String email, Long idJobOffer, Long cvId) {
}
