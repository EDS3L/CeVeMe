package pl.ceveme.application.usecase.applicationHistory;


import org.springframework.stereotype.Service;
import pl.ceveme.application.dto.applicationHistories.ApplicationStatusCounts;
import pl.ceveme.domain.services.applicationHistory.ApplicationHistoryService;

@Service
public class GetTheCountedStatuses {

    private final ApplicationHistoryService applicationHistoryService;

    public GetTheCountedStatuses(ApplicationHistoryService applicationHistoryService) {
        this.applicationHistoryService = applicationHistoryService;
    }

    public ApplicationStatusCounts execute(Long userID) {
        return applicationHistoryService.statusCounts(userID);
    }
}
