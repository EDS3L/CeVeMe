package pl.ceveme.application.usecase.applicationHistory;

import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryRequest;
import pl.ceveme.application.dto.entity.applicationHistory.ApplicationHistoryResponse;
import pl.ceveme.domain.services.applicationHistory.ApplicationHistoryService;

@Service
public class SaveApplicationHistoryUseCase {

    private final ApplicationHistoryService applicationHistoryService;

    public SaveApplicationHistoryUseCase(ApplicationHistoryService applicationHistoryService) {
        this.applicationHistoryService = applicationHistoryService;
    }

    public ApplicationHistoryResponse execute(ApplicationHistoryRequest request) {
        return applicationHistoryService.saveApplication(request);
    }
}
