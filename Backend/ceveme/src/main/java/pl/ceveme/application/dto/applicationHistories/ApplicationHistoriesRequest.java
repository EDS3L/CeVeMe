package pl.ceveme.application.dto.applicationHistories;

import pl.ceveme.domain.model.entities.ApplicationHistory;

public record ApplicationHistoriesRequest(Long applicationHistoriesID, ApplicationHistory.STATUS status) {


}
