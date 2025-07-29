package pl.ceveme.infrastructure.controllers.applicationHistory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryRequest;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryResponse;
import pl.ceveme.application.usecase.applicationHistory.SaveApplicationHistoryUseCase;

@RestController
@RequestMapping("/api/applicationHistory")
public class ApplicationHistoryController {

    private final SaveApplicationHistoryUseCase saveApplicationHistoryUseCase;

    public ApplicationHistoryController(SaveApplicationHistoryUseCase saveApplicationHistoryUseCase) {
        this.saveApplicationHistoryUseCase = saveApplicationHistoryUseCase;
    }

    @PostMapping
    public ResponseEntity<ApplicationHistoryResponse> save(@RequestBody ApplicationHistoryRequest request) {
        return ResponseEntity.ok(saveApplicationHistoryUseCase.execute(request));
    }
}
