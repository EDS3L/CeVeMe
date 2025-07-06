package pl.ceveme.application.dto.exception;

import java.time.Instant;

public record ApiError(
        String errorCode,  // np. SCRAP_TIMEOUT, INVALID_SOURCE
        String message,
        Instant timestamp,
        String path
) {}