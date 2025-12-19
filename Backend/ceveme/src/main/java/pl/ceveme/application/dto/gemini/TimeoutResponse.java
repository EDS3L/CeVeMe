package pl.ceveme.application.dto.gemini;

import pl.ceveme.domain.model.enums.EndpointType;

public record TimeoutResponse(String message, Long howMuchLeft, EndpointType endpointType) {
}
